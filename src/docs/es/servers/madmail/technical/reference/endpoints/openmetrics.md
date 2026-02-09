---
title: Referencia de OpenMetrics
description: Referencia para el módulo openmetrics, que proporciona estadísticas del servidor en formato OpenMetrics/Prometheus.
category: Técnico
---

# Telemetría OpenMetrics/Prometheus

Varias estadísticas del servidor son proporcionadas en formato OpenMetrics por el módulo "openmetrics".

Para activarlo, añade la siguiente línea a la configuración del servidor:

```
openmetrics tcp://127.0.0.1:9749 { }
```

El punto final de raspado (scrape endpoint) sería `http://127.0.0.1:9749/metrics`.

## Métricas

```
# Fallos del comando AUTH debido a credenciales inválidas.
maddy_smtp_failed_logins{module}
# Comandos de transacciones SMTP fallidos (MAIL, RCPT, DATA).
maddy_smtp_failed_commands{module, command, smtp_code, smtp_enchcode}
# Mensajes rechazados con un código 4xx debido a la limitación de frecuencia (ratelimiting).
maddy_smtp_ratelimit_deferred{module}
# Cantidad de transacciones SMTP iniciadas.
maddy_smtp_started_transactions{module}
# Cantidad de transacciones SMTP abortadas.
maddy_smtp_aborted_transactions{module}
# Cantidad de transacciones SMTP completadas.
maddy_smtp_completed_transactions{module}
# Número de veces que una comprobación devolvió el resultado 'reject' (puede ser más que los
# mensajes procesados si la comprobación lo hace por destinatario).
maddy_check_reject{check}
# Número de veces que una comprobación devolvió el resultado 'quarantine' (puede ser más que
# los mensajes procesados si la comprobación lo hace por destinatario).
maddy_check_quarantined{check}
# Cantidad de mensajes en cola.
maddy_queue_length{module, location}
# Conexiones de salida establecidas con un nivel de seguridad TLS específico.
maddy_remote_conns_tls_level{module, level}
# Conexiones de salida establecidas con un nivel de seguridad MX específico.
maddy_remote_conns_mx_level{module, level}
```
