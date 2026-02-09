---
title: Быстрый старт - Напишите бота
description: Создайте эхо-бота на Python, используя deltabot-cli.
category: Боты
---

# Напишите бота

Для начала давайте создадим «эхо-ботов» на языке Python. На каждое сообщение, которое вы ему отправите, он будет отвечать тем же текстом.
Вы можете заглянуть в этот [пример репозитория](https://github.com/deltachat-bot/echo), там есть решения на разных языках программирования!

## Настройка виртуального окружения

Сначала настроим виртуальное окружение Python, где мы сможем безопасно устанавливать и тестировать нужные нам зависимости:

```sh
pip install virtualenv
virtualenv .venv
source .venv/bin/activate
```

## Установка зависимостей

Теперь, когда у нас активно виртуальное окружение для тестирования, давайте установим `deltabot-cli`. Это библиотека высокоуровневого фреймворка для ботов, которая упрощает написание кода и ускоряет разработку:

```sh
pip install deltabot-cli
```

## Создание файла скрипта Python

Теперь создайте файл с именем `echobot.py`, в который вы поместите код своего бота. Первое, что мы туда запишем — это импорт зависимостей:

```python
from deltabot_cli import BotCli
from deltachat2 import MsgData, events
```

## Настройка CLI бота

Теперь настроим интерфейс командной строки бота:

```python
cli = BotCli("echobot")
```

Это создает объект `cli`, который по умолчанию будет использовать `echobot` в качестве имени папки для конфигурации бота (например, `~/.config/echobot/` в Linux).

## Обработка входящих сообщений

С помощью объекта `cli` мы теперь можем регистрировать обработчики событий:

```python
@cli.on(events.NewMessage)
def echo(bot, accid, event):
    msg = event.msg
    reply = MsgData(text=msg.text)
    bot.rpc.send_msg(accid, msg.chat_id, reply)
```

Строка `@cli.on(events.NewMessage)` означает, что следующая за ней функция будет вызываться при получении нового сообщения. Функция принимает следующие параметры:
- `bot`: экземпляр бота,
- `accid`: ID аккаунта, на который пришло сообщение (это актуально для бота, использующего несколько аккаунтов),
- `event`: объект события. Поскольку мы слушаем `NewMessage`, `event` содержит информацию о полученном сообщении:
  - `event.msg` — объект, описывающий полученное сообщение,
  - `event.command` и `event.payload` — строки с командой, введенной пользователем, и полезной нагрузкой команды. Например, если пользователь отправил сообщение с текстом: `/uppercase hello`, то `event.command == "/uppercase"`, а `event.payload == "hello"`.

  Для нашего эхо-бота нам не нужны команды, поэтому мы обращаемся к объекту входящего сообщения напрямую через `event.msg`.

С помощью `reply = MsgData(text=msg.text)` мы создаем объект ответа с тем же текстом, что и во входящем сообщении.

Мы используем `bot.rpc.send_msg(accid, msg.chat_id, reply)`, чтобы отправить ответное сообщение в тот же чат, где было получено входящее. Объект `bot.rpc` позволяет взаимодействовать с [API ядра chatmail](https://github.com/chatmail/core/blob/main/deltachat-jsonrpc/src/api.rs).

## Запуск CLI

При выполнении нашего скрипта `echobot.py` нам нужно запустить CLI бота, чтобы события обрабатывались:

```python
if __name__ == "__main__":
    cli.start()
```

Это наделяет нашего бота полноценным CLI с опциями для настройки и запуска!

## Полный исходный код

Вот и всё! У нас есть полностью функциональный эхо-бот. Вот весь код скрипта `echobot.py`:

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

## Тестирование бота

Пришло время протестировать нашу новую программу!

### Настройка

Сначала создадим профиль бота в chatmail:

```sh
python ./echobot.py init DCACCOUNT:https://nine.testrun.org/new
```

**СОВЕТ:** Мы будем использовать реле nine.testrun.org, но вы можете зарегистрировать аккаунт на многих других существующих [реле chatmail](https://chatmail.at/relays).

После создания профиля мы можем изменить отображаемое имя бота, аватар и статус/описание:

```sh
python ./echobot.py config displayname "Мой эхо-бот"
python ./echobot.py config selfstatus "Привет, я эхо-бот"
python ./echobot.py config selfavatar "./bot-avatar.png"
```

### Получение ссылки-приглашения бота

Чтобы связаться с ботом, нам нужно получить его ссылку-приглашение:

```sh
python ./echobot.py link
```

Ссылка будет выведена в терминал. Откройте её в клиенте Delta Chat или в браузере и отсканируйте QR-код. Бот примет приглашение, как только вы запустите обработку входящих сообщений.

### Запуск бота

Наконец, пришло время пообщаться с вашим ботом!
Мы даем боту команду выйти в сеть и обрабатывать сообщения:

```sh
python ./echobot.py serve
```

Теперь зайдите в Delta Chat — там уже должен быть чат с ботом. Попробуйте отправить ему «привет» или любое другое текстовое сообщение!

### Следующие шаги

Поздравляем! Вы освоили основы создания и запуска бота Delta Chat!

Для дальнейшего изучения:

* [Справочник событий](./events)
* [Страница deltabot-cli](https://github.com/deltachat-bot/deltabot-cli-py)
* [Библиотека deltachat2](https://github.com/adbenitez/deltachat2), используемая в deltabot-cli
* [Примеры реализации эхо-бота на разных языках](https://github.com/deltachat-bot/echo)
* [Документация по TypeScript](https://js.jsonrpc.delta.chat/classes/RawClient.html)
  (Автоматически созданной документации для Python API пока нет, но API TypeScript очень похож по функциям, которые можно вызывать через `event.rpc`)

**ПРИМЕЧАНИЕ:** библиотеки `deltabot-cli` и `deltachat2` находятся в разработке, и полноценная документация пока отсутствует — на данный момент вам придется изучать их примеры и исходный код.
Список доступных методов JSON-RPC можно найти [здесь](https://github.com/chatmail/core/blob/main/deltachat-jsonrpc/src/api.rs).
