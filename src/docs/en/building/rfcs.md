---
title: Protocol RFCs
description: Offline copies of IETF RFCs referenced when building a Chatmail relay.
category: Building
order: 5
---

# Protocol RFCs

Plain-text copies of IETF RFCs used by the [Relay build checklist](/en/docs/building/server). Links open the styled viewer on this site (`/rfcs/rfcXXXX`); use **Raw .txt** on that page for plain text. Canonical specs remain on the [IETF Datatracker](https://datatracker.ietf.org/) if you need the online version.

## By relay feature area

| Area | RFCs | Topics |
|------|------|--------|
| SMTP | [RFC 5321](/rfcs/rfc5321.txt), [RFC 6409](/rfcs/rfc6409.txt), [RFC 3207](/rfcs/rfc3207.txt), [RFC 8314](/rfcs/rfc8314.txt), [RFC 4954](/rfcs/rfc4954.txt), [RFC 6531](/rfcs/rfc6531.txt) | Transport, submission, STARTTLS, SMTPS, AUTH |
| IMAP | [RFC 3501](/rfcs/rfc3501.txt), [RFC 2177](/rfcs/rfc2177.txt), [RFC 2087](/rfcs/rfc2087.txt), [RFC 6851](/rfcs/rfc6851.txt), [RFC 5464](/rfcs/rfc5464.txt), [RFC 6154](/rfcs/rfc6154.txt), [RFC 2595](/rfcs/rfc2595.txt), [RFC 7889](/rfcs/rfc7889.txt) | IMAP4rev1, IDLE, QUOTA, MOVE, METADATA, special-use |
| Messages | [RFC 5322](/rfcs/rfc5322.txt), [RFC 2045](/rfcs/rfc2045.txt)–[RFC 2049](/rfcs/rfc2049.txt), [RFC 3156](/rfcs/rfc3156.txt), [RFC 9580](/rfcs/rfc9580.txt), [RFC 4880](/rfcs/rfc4880.txt) | Message format, MIME, PGP/MIME |
| Auth | [RFC 4616](/rfcs/rfc4616.txt), [RFC 8264](/rfcs/rfc8264.txt), [RFC 8265](/rfcs/rfc8265.txt) | SASL PLAIN, PRECIS usernames |
| Federation | [RFC 9110](/rfcs/rfc9110.txt), [RFC 5322](/rfcs/rfc5322.txt) | HTTP `/mxdeliv`, message bodies |
| Discovery | [RFC 8615](/rfcs/rfc8615.txt), [RFC 8314](/rfcs/rfc8314.txt) | `/.well-known/`, TLS for mail |
| Admin API | [RFC 9110](/rfcs/rfc9110.txt), [RFC 8259](/rfcs/rfc8259.txt), [RFC 6750](/rfcs/rfc6750.txt) | HTTP, JSON, Bearer tokens |
| Calls | [RFC 8656](/rfcs/rfc8656.txt), [RFC 8489](/rfcs/rfc8489.txt), [RFC 8445](/rfcs/rfc8445.txt), [RFC 5464](/rfcs/rfc5464.txt) | TURN, STUN, ICE, METADATA discovery |
| TLS & certs | [RFC 8446](/rfcs/rfc8446.txt), [RFC 8555](/rfcs/rfc8555.txt) | TLS 1.3, ACME |

Autoconfig XML follows the [Mozilla ISPDB](https://github.com/thunderbird/autoconfig) format (not an IETF RFC). Delta Chat IMAP capabilities (`XCHATMAIL`, `XDELTAPUSH`) are Chatmail extensions documented by reference implementations.

## STUN / TURN / ICE (calls)

| RFC | Title |
|-----|-------|
| [RFC 3489](/rfcs/rfc3489.txt) | STUN (classic; historic) |
| [RFC 5389](/rfcs/rfc5389.txt) | Session Traversal Utilities for NAT (STUN) |
| [RFC 8489](/rfcs/rfc8489.txt) | STUN (bis; current) |
| [RFC 5766](/rfcs/rfc5766.txt) | TURN (historic; see 8656) |
| [RFC 8656](/rfcs/rfc8656.txt) | TURN (current) |
| [RFC 5769](/rfcs/rfc5769.txt) | STUN test vectors |
| [RFC 6062](/rfcs/rfc6062.txt) | TURN extension for TCP relaying |
| [RFC 6156](/rfcs/rfc6156.txt) | TURN IPv6 extension |
| [RFC 6263](/rfcs/rfc6263.txt) | ICE bandwidth management |
| [RFC 8445](/rfcs/rfc8445.txt) | Interactive Connectivity Establishment (ICE) |
| [TURN REST draft](/rfcs/draft-uberti-behave-turn-rest-00.txt) | TURN REST API (shared-secret credentials) |

## Full inventory

| RFC | Title |
|-----|-------|
| [RFC 2045](/rfcs/rfc2045.txt) | MIME Part One: Format of Internet Message Bodies |
| [RFC 2046](/rfcs/rfc2046.txt) | MIME Part Two: Media Types |
| [RFC 2047](/rfcs/rfc2047.txt) | MIME Part Three: Message Header Extensions |
| [RFC 2048](/rfcs/rfc2048.txt) | MIME Part Four: Registration Procedures |
| [RFC 2049](/rfcs/rfc2049.txt) | MIME Part Five: Conformance Criteria |
| [RFC 2087](/rfcs/rfc2087.txt) | IMAP QUOTA extension |
| [RFC 2177](/rfcs/rfc2177.txt) | IMAP IDLE |
| [RFC 2342](/rfcs/rfc2342.txt) | IMAP NAMESPACE |
| [RFC 2595](/rfcs/rfc2595.txt) | Using TLS with IMAP, POP3 and ACAP (STARTTLS) |
| [RFC 2971](/rfcs/rfc2971.txt) | IMAP ID extension |
| [RFC 3156](/rfcs/rfc3156.txt) | MIME Security with OpenPGP |
| [RFC 3207](/rfcs/rfc3207.txt) | SMTP Service Extension for Secure SMTP over TLS (STARTTLS) |
| [RFC 3348](/rfcs/rfc3348.txt) | IMAP CHILDREN extension |
| [RFC 3501](/rfcs/rfc3501.txt) | INTERNET MESSAGE ACCESS PROTOCOL - VERSION 4rev1 |
| [RFC 4616](/rfcs/rfc4616.txt) | The PLAIN SASL Mechanism |
| [RFC 4880](/rfcs/rfc4880.txt) | OpenPGP Message Format (historic) |
| [RFC 4954](/rfcs/rfc4954.txt) | SMTP Service Extension for Authentication |
| [RFC 4978](/rfcs/rfc4978.txt) | IMAP COMPRESS extension |
| [RFC 5256](/rfcs/rfc5256.txt) | IMAP SORT and THREAD |
| [RFC 5321](/rfcs/rfc5321.txt) | Simple Mail Transfer Protocol |
| [RFC 5322](/rfcs/rfc5322.txt) | Internet Message Format |
| [RFC 5464](/rfcs/rfc5464.txt) | IMAP METADATA Extension |
| [RFC 6154](/rfcs/rfc6154.txt) | IMAP SPECIAL-USE extension |
| [RFC 6409](/rfcs/rfc6409.txt) | Message Submission for Mail |
| [RFC 6531](/rfcs/rfc6531.txt) | SMTP Extension for Internationalized Email |
| [RFC 6750](/rfcs/rfc6750.txt) | OAuth 2.0 Bearer Token Usage |
| [RFC 6851](/rfcs/rfc6851.txt) | IMAP MOVE Extension |
| [RFC 7162](/rfcs/rfc7162.txt) | IMAP CONDSTORE |
| [RFC 7889](/rfcs/rfc7889.txt) | IMAP APPENDLIMIT Extension |
| [RFC 8259](/rfcs/rfc8259.txt) | The JavaScript Object Notation (JSON) Data Interchange Format |
| [RFC 8264](/rfcs/rfc8264.txt) | PRECIS Framework |
| [RFC 8265](/rfcs/rfc8265.txt) | Preparation, Enforcement, and Comparison of Internationalized Strings (PRECIS) |
| [RFC 8314](/rfcs/rfc8314.txt) | Cleartext Considered Obsolete: Use of TLS for SMTP Submission |
| [RFC 8446](/rfcs/rfc8446.txt) | The Transport Layer Security (TLS) Protocol Version 1.3 |
| [RFC 8555](/rfcs/rfc8555.txt) | Automatic Certificate Management Environment (ACME) |
| [RFC 8615](/rfcs/rfc8615.txt) | Well-Known Uniform Resource Identifiers (URIs) |
| [RFC 9110](/rfcs/rfc9110.txt) | HTTP Semantics |
| [RFC 9580](/rfcs/rfc9580.txt) | OpenPGP Message Format |

RFC 822 is obsoleted by [RFC 5322](/rfcs/rfc5322.txt); references to “RFC 822 message” mean the Internet Message Format in RFC 5322.

## Updating local copies

Run `static/rfcs/download-rfcs.sh` from the repo root to refresh plain-text files from ietf.org.