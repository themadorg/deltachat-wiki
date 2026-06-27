---
layout: checklist-info
---

# HTTP POST /mxdeliv receives federated mail

HTTP semantics: [RFC 9110](/rfcs/rfc9110.txt). Message body: [RFC 5322](/rfcs/rfc5322.txt).

**Wire format:**

```http
POST /mxdeliv HTTP/1.1
Host: recipient-server
X-Mail-From: sender@domain
X-Mail-To: user@domain
Content-Type: application/octet-stream

<complete RFC 5322 message>
```

**Processing order:**
1. Validate required headers
2. Parse message body
3. Federation policy on sender domain → **403** if rejected
4. PGP check
5. Body size limit → **413** if too large
6. Deliver to each valid local `X-Mail-To` → **200** on success

Multiple `X-Mail-To` headers allowed for one message. Return **404** if no valid recipients.