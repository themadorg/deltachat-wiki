---
title: Настройка обратного прокси
description: Как запустить реле chatmail за обратным прокси.
category: Серверы
---

# Настройка обратного прокси

MTA реле chatmail не отслеживает IP-адрес клиента и не зависит от него в своей работе, поэтому реле может быть запущено за обратным прокси. Это не повлияет даже на аутентификацию входящей почты, так как DKIM проверяет только криптографическую подпись сообщения и не использует IP-адрес в качестве входных данных.

Например, вы можете захотеть разместить реле chatmail у себя дома и использовать только арендованный VPS для предоставления публичного IP-адреса для клиентских подключений и входящей почты. Вы можете подключить реле chatmail к VPS, используя протокол туннелирования, такой как [WireGuard](https://www.wireguard.com/), и настроить обратный прокси на VPS для пересылки соединений на реле chatmail через туннель. Вы также можете настроить несколько обратных прокси для вашего реле в разных сетях, чтобы обеспечить доступность реле, даже если один из IP-адресов станет недоступен из-за проблем с хостингом или маршрутизацией.

Обратите внимание, что ваше реле chatmail всё равно должно иметь возможность устанавливать исходящие соединения по порту 25 для отправки сообщений во внешний мир.

Чтобы настроить обратный прокси (или, скорее, Destination NAT, DNAT) для вашего реле chatmail, следуйте этим инструкциям:

## Linux

Поместите следующую конфигурацию в `/etc/nftables.conf`:

```text
#!/usr/sbin/nft -f

flush ruleset

define wan = eth0

# Какие порты проксировать.
#
# Обратите внимание, что SSH не проксируется,
# поэтому можно зайти на прокси-сервер,
# а не на оригинальный.
define ports = { smtp, http, https, imap, imaps, submission, submissions }

# Хост, на который мы хотим проксировать.
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

                # Разрешить ICMP.
                # Особенно важно разрешить сообщения ICMPv6 ND,
                # иначе работа IPv6 нарушится.
                icmp type { echo-request } accept
                icmpv6 type { echo-request, nd-neighbor-solicit, nd-router-advert, nd-neighbor-advert } accept

                # Разрешить входящие SSH-соединения.
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

Выполните `systemctl enable nftables.service`, чтобы убедиться, что конфигурация перезагружается при перезагрузке прокси-сервера.

Раскомментируйте в `/etc/sysctl.conf` следующие две строки:

```text
net.ipv4.ip_forward=1
net.ipv6.conf.all.forwarding=1
```

Затем перезагрузите прокси-сервер или выполните команды `sysctl -p` и `nft -f /etc/nftables.conf`.

## FreeBSD / pf

Поместите следующую конфигурацию в `/etc/pf.conf`:

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

# Определение правил перенаправления
rdr on $ext_if inet proto tcp from any to ($ext_if:0) port $forward_ports -> $chatmail_ipv4
rdr on $ext_if inet6 proto tcp from any to ($ext_if:0) port $forward_ports -> $chatmail_ipv6

# Принимать входящий трафик на указанные порты, которые мы будем перенаправлять через NAT
pass in quick on $ext_if inet proto tcp from any to any port $forward_ports flags S/SA modulate state
pass in quick on $ext_if inet6 proto tcp from any to any port $forward_ports flags S/SA modulate state

# Разрешить входящий SSH для управления хостом
pass in quick on $ext_if proto tcp from any to ($ext_if) port 22 flags S/SA modulate state

# Разрешить ICMP
pass in quick on $ext_if inet proto icmp all icmp-type $icmp_types keep state
pass in quick on $ext_if inet6 proto ipv6-icmp all icmp6-type $icmp6_types keep state

# Разрешить любому трафику проходить через NAT
pass on $ext_if inet proto tcp from any to $chatmail_ipv4 flags S/SA modulate state
pass on $ext_if inet6 proto tcp from any to $chatmail_ipv6 flags S/SA modulate state

# Разрешить весь исходящий трафик по умолчанию
pass out quick on $ext_if from any to any

# Блокировать всё остальное по умолчанию
block drop in log all
```

Добавьте в `/etc/sysctl.conf.local` следующие две строки:

```text
net.inet.ip.forwarding=1
net.inet6.ip6.forwarding=1
```

Активируйте sysctl командой `service sysctl onestart`.
Включите брандмауэр pf с помощью `service pf enable`.
Примените правила брандмауэра командой `service pf start` или `pfctl -f /etc/pf.conf`.
Обратите внимание, что включение брандмауэра может прервать ваш SSH-сеанс, но вы сможете подключиться снова.

После настройки прокси-сервера вы можете добавить его IP-адрес в DNS.
