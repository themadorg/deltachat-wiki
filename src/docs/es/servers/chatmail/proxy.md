---
title: Configuración de un proxy inverso
description: Cómo ejecutar un relay de chatmail detrás de un proxy inverso.
category: Servidores
---

# Configuración de un proxy inverso

Un MTA de relay de chatmail no rastrea ni depende de la dirección IP del cliente para su funcionamiento, por lo que puede ejecutarse detrás de un proxy inverso. Esto ni siquiera afectará a la autenticación del correo entrante, ya que DKIM solo comprueba la firma criptográfica del mensaje y no utiliza la dirección IP como entrada.

Por ejemplo, es posible que quieras alojar tú mismo tu relay de chatmail y solo utilizar un VPS alojado para proporcionar una dirección IP pública para las conexiones de los clientes y el correo entrante. Puedes conectar el relay de chatmail al VPS utilizando un protocolo de túnel como [WireGuard](https://www.wireguard.com/) y configurar un proxy inverso en el VPS para reenviar las conexiones al relay de chatmail a través del túnel. También puedes configurar múltiples proxies inversos para tu relay de chatmail en diferentes redes para asegurar que tu relay sea accesible incluso cuando una de las IPs se vuelva inaccesible debido a problemas de alojamiento o enrutamiento.

Ten en cuenta que tu relay de chatmail todavía necesita poder realizar conexiones salientes por el puerto 25 para enviar mensajes al exterior.

Para configurar un proxy inverso (o más bien Destination NAT, DNAT) para tu relay de chatmail, sigue estas instrucciones:

## Linux

Coloca la siguiente configuración en `/etc/nftables.conf`:

```text
#!/usr/sbin/nft -f

flush ruleset

define wan = eth0

# Puertos a los que se les hará el proxy.
#
# Ten en cuenta que el puerto SSH no tiene proxy
# para que sea posible loguearse en el servidor proxy
# y no en el servidor original.
define ports = { smtp, http, https, imap, imaps, submission, submissions }

# El host al que queremos hacer el proxy.
define ipv4_address = AAA.BBB.CCC.DDD
define ipv6_address = [XXX::1]

table ip nat {
        chain prerouting {
                type nat hook prerouting priority dstnat; policy accept;
                iif $wan tcp dport $ports dnat to $ipv4_address
        }

        chain postrouting {
                type nat hook postrouting priority 0;

                oifname $wan masquerade
        }
}

table ip6 nat {
        chain prerouting {
                type nat hook prerouting priority dstnat; policy accept;
                iif $wan tcp dport $ports dnat to $ipv6_address
        }

        chain postrouting {
                type nat hook postrouting priority 0;

                oifname $wan masquerade
        }
}

table inet filter {
        chain input {
                type filter hook input priority filter; policy drop;

                # Aceptar ICMP.
                # Es especialmente importante aceptar los mensajes ICMPv6 ND,
                # de lo contrario la conectividad IPv6 se rompe.
                icmp type { echo-request } accept
                icmpv6 type { echo-request, nd-neighbor-solicit, nd-router-advert, nd-neighbor-advert } accept

                # Permitir conexiones SSH entrantes.
                tcp dport { ssh } accept

                ct state established accept
        }
        chain forward {
                type filter hook forward priority filter; policy drop;

                ct state established accept
                ip daddr $ipv4_address counter accept
                ip6 daddr $ipv6_address counter accept
        }
        chain output {
                type filter hook output priority filter;
        }
}
```

Ejecuta `systemctl enable nftables.service` para asegurar que la configuración se recargue cuando el relay proxy se reinicie.

Descomenta en `/etc/sysctl.conf` las siguientes dos líneas:

```text
net.ipv4.ip_forward=1
net.ipv6.conf.all.forwarding=1
```

A continuación, reinicia el relay o ejecuta `sysctl -p` y `nft -f /etc/nftables.conf`.

## FreeBSD / pf

Coloca la siguiente configuración en `/etc/pf.conf`:

```text
ext_if = "em0"
forward_ports = "{ 25, 80, 143, 443, 465, 587, 993 }"
chatmail_ipv4 = "AAA.BBB.CCC.DDD"
icmp_types = "{ echoreq, echorep, unreach, timex }"
chatmail_ipv6 = "XXX::1"
icmp6_types = "{ echorep, echoreq, neighbradv, neighbrsol, routeradv, routersol, unreach, toobig, timex }"

set skip on lo0

nat on $ext_if inet from any to any -> ($ext_if:0)
nat on $ext_if inet6 from any to any -> ($ext_if:0)

# Definir las reglas de redirección
rdr on $ext_if inet proto tcp from any to ($ext_if:0) port $forward_ports -> $chatmail_ipv4
rdr on $ext_if inet6 proto tcp from any to ($ext_if:0) port $forward_ports -> $chatmail_ipv6

# Aceptar el tráfico entrante a los puertos especificados que vamos a redirigir por NAT
pass in quick on $ext_if inet proto tcp from any to any port $forward_ports flags S/SA modulate state
pass in quick on $ext_if inet6 proto tcp from any to any port $forward_ports flags S/SA modulate state

# Permitir SSH entrante para la gestión del host
pass in quick on $ext_if proto tcp from any to ($ext_if) port 22 flags S/SA modulate state

# Permitir ICMP
pass in quick on $ext_if inet proto icmp all icmp-type $icmp_types keep state
pass in quick on $ext_if inet6 proto ipv6-icmp all icmp6-type $icmp6_types keep state

# Permitir que el tráfico de cualquier persona pase a través del NAT
pass on $ext_if inet proto tcp from any to $chatmail_ipv4 flags S/SA modulate state
pass on $ext_if inet6 proto tcp from any to $chatmail_ipv6 flags S/SA modulate state

# Permitir la salida por defecto
pass out quick on $ext_if from any to any

# Bloquear por defecto
block drop in log all
```

Inserta en `/etc/sysctl.conf.local` las siguientes dos líneas:

```text
net.inet.ip.forwarding=1
net.inet6.ip6.forwarding=1
```

Activa los sysctls con `service sysctl onestart`.
Habilita el firewall pf con `service pf enable`.
Aplica las reglas del firewall con `service pf start` o `pfctl -f /etc/pf.conf`.
Ten en cuenta que habilitar el firewall puede interrumpir tu sesión SSH, pero puedes volver a conectarte.

Una vez configurado el relay proxy, puedes añadir su dirección IP al DNS.
