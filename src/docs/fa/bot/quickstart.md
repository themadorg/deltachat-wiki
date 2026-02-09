---
title: شروع سریع - نوشتن بات
description: ساخت یک بات echo در پایتون با استفاده از deltabot-cli.
category: بات
---

# نوشتن بات

برای شروع، بیایید یک بات "echo" در پایتون بسازیم. برای هر پیامی که به آن بفرستید، با همان متن پاسخ خواهد داد.
می‌توانید این [مخزن نمونه](https://github.com/deltachat-bot/echo) را برای راه‌حل‌ها در زبان‌های برنامه‌نویسی مختلف ببینید!

## ایجاد محیط مجازی

ابتدا بیایید یک محیط مجازی پایتون راه‌اندازی کنیم تا بتوانیم وابستگی‌های مورد نیاز را با اطمینان نصب و تست کنیم:

```sh
pip install virtualenv
virtualenv .venv
source .venv/bin/activate
```

## نصب وابستگی‌ها

حالا که یک محیط مجازی فعال برای تست داریم، بیایید `deltabot-cli` را نصب کنیم، یک کتابخانه فریم‌ورک بات سطح بالا که نوشتن بات‌ها را ساده‌تر می‌کند و توسعه را سرعت می‌بخشد:

```sh
pip install deltabot-cli
```

## ایجاد فایل اسکریپت پایتون

حالا یک فایل به نام `echobot.py` بسازید که کد بات خود را در آن قرار خواهید داد. اولین چیزی که داخل آن قرار می‌دهیم، import وابستگی‌هایی است که استفاده خواهیم کرد:

```python
from deltabot_cli import BotCli
from deltachat2 import MsgData, events
```

## راه‌اندازی CLI بات

حالا بیایید رابط خط فرمان بات را راه‌اندازی کنیم:

```python
cli = BotCli("echobot")
```

این یک آبجکت `cli` ایجاد می‌کند که از `echobot` به عنوان نام پوشه پیش‌فرض برای پوشه پیکربندی بات استفاده می‌کند (مثلاً `~/.config/echobot/` در لینوکس).

## مدیریت پیام‌های ورودی

با آبجکت `cli` حالا می‌توانیم هندلرهای رویداد را ثبت کنیم:

```python
@cli.on(events.NewMessage)
def echo(bot, accid, event):
    msg = event.msg
    reply = MsgData(text=msg.text)
    bot.rpc.send_msg(accid, msg.chat_id, reply)
```

خط `@cli.on(events.NewMessage)` به این معنی است که تابع زیر هنگام دریافت پیام جدید فراخوانی خواهد شد. تابع این پارامترها را دریافت می‌کند:
- `bot`: نمونه بات،
- `accid`: شناسه حسابی که پیام در آن دریافت شده (این برای باتی که از چند حساب استفاده می‌کند مرتبط است)
- `event`: آبجکت رویداد. از آنجایی که ما NewMessage را گوش می‌دهیم، `event` اطلاعاتی درباره پیام دریافتی ارائه می‌دهد:
  - `event.msg` یک آبجکت است که پیام دریافتی را توصیف می‌کند
  - `event.command` و `event.payload` رشته‌هایی هستند با دستور صادر شده توسط کاربر و بارداده دستور. برای مثال، اگر کاربر پیامی با متن `/uppercase hello` ارسال کند، آنگاه `event.command == "/uppercase"` و `event.payload == "hello"`.

  برای بات echo ما نیازی به هیچ دستوری نداریم، بنابراین مستقیماً از طریق `event.msg` به آبجکت پیام ورودی دسترسی پیدا می‌کنیم.

با `reply = MsgData(text=msg.text)` یک آبجکت پاسخ با همان متن پیام ورودی ایجاد می‌کنیم.

از `bot.rpc.send_msg(accid, msg.chat_id, reply)` برای ارسال پیام پاسخ به همان چتی که پیام ورودی از آنجا دریافت شده استفاده می‌کنیم. آبجکت `bot.rpc` به شما امکان تعامل با [API هسته chatmail](https://github.com/chatmail/core/blob/main/deltachat-jsonrpc/src/api.rs) را می‌دهد.

## شروع CLI

وقتی اسکریپت `echobot.py` ما اجرا شود، باید CLI بات را شروع کنیم تا رویدادها پردازش شوند:

```python
if __name__ == "__main__":
    cli.start()
```

این بات ما را با یک CLI کامل با امکاناتی برای پیکربندی و اجرای بات قدرت می‌بخشد!

## کد منبع کامل

تمام! ما یک بات echo کاملاً کاربردی داریم، اینجا کد منبع کامل اسکریپت `echobot.py` ماست:

```python
from deltabot_cli import BotCli
from deltachat2 import MsgData, events

cli = BotCli("echobot")

@cli.on(events.NewMessage)
def echo(bot, accid, event):
    msg = event.msg
    reply = MsgData(text=msg.text)
    bot.rpc.send_msg(accid, msg.chat_id, reply)

if __name__ == "__main__":
    cli.start()
```

## تست بات

حالا وقت تست برنامه بات جدید ماست!

### پیکربندی

ابتدا بیایید پروفایل chatmail بات را ایجاد کنیم:

```sh
python ./echobot.py init DCACCOUNT:https://nine.testrun.org/new
```

**نکته:** ما از رله chatmail در nine.testrun.org استفاده خواهیم کرد، می‌توانید حساب جدیدی در بسیاری از [رله‌های chatmail](https://chatmail.at/relays) موجود دیگر ثبت کنید

پس از ایجاد پروفایل، می‌توانیم نام نمایشی بات، آواتار و پیام وضعیت/توضیحات را تنظیم کنیم:

```sh
python ./echobot.py config displayname "My Echo Bot"
python ./echobot.py config selfstatus "Hi, I am an echo-bot"
python ./echobot.py config selfavatar "./bot-avatar.png"
```

### دریافت لینک دعوت چت بات

برای تماس با بات نیاز داریم لینک دعوت بات را بگیریم:

```sh
python ./echobot.py link
```

لینک دعوت بات در ترمینال چاپ خواهد شد، آن را با کلاینت دلتا چت خود یا در مرورگر باز کنید و کد QR را اسکن کنید. دعوت چت توسط بات پس از اینکه به بات اجازه دهید پیام‌های ورودی را پردازش کند پذیرفته خواهد شد، به مرحله بعدی ادامه دهید.

### اجرای بات

بالاخره زمان شروع چت با بات شما رسیده!
ما به بات دستور می‌دهیم آنلاین شود و پیام‌ها را با این دستور پردازش کند:

```sh
python ./echobot.py serve
```

حالا به دلتا چت خود بروید، باید قبلاً یک چت با بات داشته باشید، سعی کنید "hi" یا هر پیام متنی دیگری به آن بفرستید!

### مراحل بعدی

تبریک! شما اصول ایجاد و اجرای یک بات دلتا چت را یاد گرفتید!

مطالعه بیشتر:

* [مرجع رویدادها](./events)
* [صفحه deltabot-cli](https://github.com/deltachat-bot/deltabot-cli-py)
* [کتابخانه deltachat2 استفاده شده توسط deltabot-cli](https://github.com/adbenitez/deltachat2)
* [نمونه‌های پیاده‌سازی بات echo در زبان‌های مختلف](https://github.com/deltachat-bot/echo)
* [مستندات رندر شده TypeScript](https://js.jsonrpc.delta.chat/classes/RawClient.html)
  (مستندات رندر شده خودکار برای API پایتون وجود ندارد، اما API تایپ‌اسکریپت بسیار شبیه به توابعی است که می‌توان روی `event.rpc` فراخوانی کرد)

**توجه:** کتابخانه‌های `deltabot-cli` و `deltachat2` در حال توسعه هستند و مستندات کاملی ندارند، در حال حاضر باید نمونه‌های ارائه شده و کد منبع آن‌ها را بخوانید.
برای لیست متدهای JSON-RPC موجود [اینجا کلیک کنید](https://github.com/chatmail/core/blob/main/deltachat-jsonrpc/src/api.rs)
