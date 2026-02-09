---
title: راه‌اندازی پراکسی معکوس
description: نحوه اجرای رله chatmail پشت یک پراکسی معکوس.
category: سرورها
---

# راه‌اندازی پراکسی معکوس

MTA رله chatmail برای فعالیت خود نیازی به ردیابی یا وابستگی به آدرس IP کلاینت ندارد، بنابراین می‌توان آن را پشت یک پراکسی معکوس (Reverse Proxy) اجرا کرد. این کار حتی بر اعتبار‌سنجی ایمیل‌های ورودی نیز تأثیری نخواهد داشت، زیرا DKIM تنها امضای رمزنگاری شده پیام را بررسی می‌کند و از آدرس IP به‌عنوان ورودی استفاده نمی‌کند.

به‌عنوان مثال، ممکن است بخواهید رله chatmail خود را به‌صورت محلی (Self-host) میزبانی کنید و تنها از یک VPS برای ارائه یک IP عمومی جهت اتصال کلاینت‌ها و دریافت ایمیل استفاده کنید. شما می‌توانید رله chatmail را با استفاده از پروتکل‌های تونل مانند [WireGuard](https://www.wireguard.com/) به VPS متصل کرده و یک پراکسی معکوس روی VPS راه‌اندازی کنید تا اتصالات را از طریق تونل به رله chatmail هدایت کند. همچنین می‌توانید چندین پراکسی معکوس برای رله chatmail خود در شبکه‌های مختلف راه‌اندازی کنید تا اطمینان حاصل کنید که رله شما حتی در صورت عدم دسترسی به یکی از IPها به دلیل مشکلات میزبانی یا مسیریابی، همچنان در دسترس است.

توجه داشته باشید که رله chatmail شما همچنان باید بتواند برای ارسال پیام به بیرون، روی پورت ۲۵ ارتباط خروجی برقرار کند.

برای راه‌اندازی پراکسی معکوس (یا به عبارتی Destination NAT، DNAT) برای رله chatmail خود، مراحل زیر را دنبال کنید:

## لینوکس (Linux)

تنظیمات زیر را در فایل `/etc/nftables.conf` قرار دهید:

```text
#!/usr/sbin/nft -f

flush ruleset

define wan = eth0

# پورت‌هایی که می‌خواهیم پراکسی شوند.
#
# توجه داشته باشید که SSH پراکسی نمی‌شود
# تا امکان ورود به سرور پراکسی فراهم باشد.
define ports = { smtp, http, https, imap, imaps, submission, submissions }

# هاستی که می‌خواهیم ترافیک به آن هدایت شود.
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

                # پذیرش ICMP.
                # پذیرش پیام‌های ICMPv6 ND به خصوص برای برقراری اتصال IPv6 بسیار مهم است.
                icmp type { echo-request } accept
                icmpv6 type { echo-request, nd-neighbor-solicit, nd-router-advert, nd-neighbor-advert } accept

                # اجازه اتصالات ورودی SSH.
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

دستور `systemctl enable nftables.service` را اجرا کنید تا مطمئن شوید تنظیمات پس از ریبوت سرور دوباره بارگذاری می‌شوند.

در فایل `/etc/sysctl.conf` دو خط زیر را از حالت کامنت خارج کنید:

```text
net.ipv4.ip_forward=1
net.ipv6.conf.all.forwarding=1
```

سپس سرور را ریبوت کنید یا دستورات `sysctl -p` و `nft -f /etc/nftables.conf` را اجرا کنید.

## FreeBSD / pf

تنظیمات زیر را در فایل `/etc/pf.conf` قرار دهید:

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

# تعریف قوانین هدایت (Redirect)
rdr on $ext_if inet proto tcp from any to ($ext_if:0) port $forward_ports -> $chatmail_ipv4
rdr on $ext_if inet6 proto tcp from any to ($ext_if:0) port $forward_ports -> $chatmail_ipv6

# پذیرش ترافیک ورودی به پورت‌های مشخص شده که NAT Redirect می‌شوند
pass in quick on $ext_if inet proto tcp from any to any port $forward_ports flags S/SA modulate state
pass in quick on $ext_if inet6 proto tcp from any to any port $forward_ports flags S/SA modulate state

# اجازه ورود SSH برای مدیریت هاست
pass in quick on $ext_if proto tcp from any to ($ext_if) port 22 flags S/SA modulate state

# اجازه ICMP
pass in quick on $ext_if inet proto icmp all icmp-type $icmp_types keep state
pass in quick on $ext_if inet6 proto ipv6-icmp all icmp6-type $icmp6_types keep state

# اجازه عبور ترافیک از NAT برای همه
pass on $ext_if inet proto tcp from any to $chatmail_ipv4 flags S/SA modulate state
pass on $ext_if inet6 proto tcp from any to $chatmail_ipv6 flags S/SA modulate state

# اجازه خروج پیش‌فرض
pass out quick on $ext_if from any to any

# مسدود کردن پیش‌فرض
block drop in log all
```

در فایل `/etc/sysctl.conf.local` دو خط زیر را وارد کنید:

```text
net.inet.ip.forwarding=1
net.inet6.ip6.forwarding=1
```

تنظیمات sysctl را با `service sysctl onestart` فعال کنید.
سرویس دیوار آتش pf را با `service pf enable` فعال کنید.
قوانین دیوار آتش را با `service pf start` یا `pfctl -f /etc/pf.conf` اعمال کنید.
توجه داشته باشید که فعال کردن دیوار آتش ممکن است اتصال SSH شما را قطع کند، اما می‌توانید دوباره متصل شوید.

پس از راه‌اندازی رله پراکسی، می‌توانید آدرس IP آن را به DNS اضافه کنید.
