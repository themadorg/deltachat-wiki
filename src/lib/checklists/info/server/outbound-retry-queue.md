---
layout: checklist-info
---

# Failed remote deliveries queued with retry backoff

Persist failed deliveries to disk (or durable store) and retry with exponential backoff. Typical settings:

| Setting | Typical value |
|---------|----------------|
| Max tries | 3 |
| Initial retry delay | 1 minute |
| Backoff multiplier | 1.25× |
| Max wall-clock in queue | 10 minutes |

HTTP **4xx** (except retryable cases) → drop immediately. **5xx** / timeouts → requeue. Operators need visibility into queue depth and oldest stuck message.