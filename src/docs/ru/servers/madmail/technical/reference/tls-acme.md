---
title: ACME (Let's Encrypt)
category: Справочник
---

# Автоматическое управление сертификатами через ACME

Madmail поддерживает получение сертификатов по протоколу ACME (например, через Let's Encrypt).

Чтобы использовать его, создайте конфигурацию с именем для `tls.loader.acme` и сошлитесь на нее из эндпоинтов:

```
tls.loader.acme local_tls {
    email ваш-email@example.org
    agreed # подтверждение вашего согласия с условиями использования Let's Encrypt
    challenge dns-01
}

smtp tcp://127.0.0.1:25 {
    tls &local_tls
    ...
}
```

Вы также можете использовать глобальную директиву `tls`:

```
tls {
    loader acme {
        email madmail-acme@example.org
        agreed
        challenge dns-01
    }
}
```

В настоящее время единственным поддерживаемым типом проверки является `dns-01`. Поэтому вы должны настроить DNS-провайдера:

```
tls.loader.acme local_tls {
    email madmail-acme@example.org
    agreed
    challenge dns-01
    dns PROVIDER_NAME {
        ...
    }
}
```

## Директивы конфигурации

### `debug [boolean]`
По умолчанию: значение глобальной директивы.
Включает отладочное логирование для операций ACME.

### `hostname [str]`
**Обязательно.**
Доменное имя, для которого выпускается сертификат.

### `store_path [path]`
По умолчанию: `state_dir/acme`
Где хранить выпущенные сертификаты и метаданные (только на файловой системе).

### `ca [url]`
По умолчанию: продуктивный CA Let's Encrypt.
URL директории ACME.

### `test_ca [url]`
По умолчанию: тестовый (staging) CA Let's Encrypt.
Используется для повторных попыток в случае сбоя основного CA, чтобы избежать ограничений по частоте запросов (rate limits).

### `override_domain [domain]`
Переопределяет домен для записи TXT в проверке `dns-01` (для делегирования).

### `email [str]`
Email для регистрации аккаунта.

### `agreed [boolean]`
Должно быть `true` для подтверждения согласия с условиями использования (ToS) центра сертификации.

## DNS-провайдеры

Поддержка некоторых провайдеров требует сборки с соответствующим тегом `libdns_PROVIDER`.

### Популярные провайдеры

- **Cloudflare**
  ```
  dns cloudflare {
      api_token "..."
  }
  ```
- **DigitalOcean**
  ```
  dns digitalocean {
      api_token "..."
  }
  ```
- **Gandi**
  ```
  dns gandi {
      api_token "token"
  }
  ```
- **Hetzner**
  ```
  dns hetzner {
      api_token "..."
  }
  ```
- **Route53**
  ```
  dns route53 {
      secret_access_key "..."
      access_key_id "..."
  }
  ```

Поддерживается множество других провайдеров (Namecheap, Vultr, Google Cloud DNS, Alibaba Cloud и т.д.). Требования к конфигурации каждого из них можно найти в репозиториях [libdns](https://github.com/libdns).
