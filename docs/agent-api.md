# AwesomeDS agent API

AwesomeDS exposes a small, versioned, read-only interface for AI agents and
other tools. The API is generated from the same validated Atlas and Canon data
used by the website; it is not a second content store.

Production origin: `https://awesome-design-system.yumaker.studio`

## Discovery

- `GET /llms.txt` gives agents a compact plain-text map, dataset counts, query
  capabilities, and usage guidance.
- `GET /api/v1/manifest` reports API/schema versions, collection counts,
  freshness buckets, evidence-graph integrity, and canonical endpoint links.

## Reference Atlas

`GET /api/v1/references` returns references sorted by stable reference ID. It
accepts exact-match `topic`, `sourceClass`, `owner`, `language`, and
`evidenceLevel` filters, plus the case-insensitive full-text `q` filter.

```text
GET /api/v1/references?topic=accessibility&sourceClass=official-system&limit=25
GET /api/v1/references?q=reduced%20motion&language=en
GET /api/v1/references?limit=100&offset=100
```

The default limit is 50 and the maximum is 100. Use the returned `nextOffset`
as the next request's `offset` until it is `null`. Each response includes the
total collection size, matched and returned counts, and a `truncated` flag.
Internal paths and observation hashes are never exposed.

## Canon rules

`GET /api/v1/rules` returns Canon rules sorted by stable rule ID. It accepts
exact-match `id`, `domain`, and `status` filters. Status is one of `canon`,
`draft`, or `deprecated`.

```text
GET /api/v1/rules?domain=accessibility&status=canon
GET /api/v1/rules?id=rule.motion.reduced-motion
```

The default limit is 100 and the maximum is 200.

## Response contract

Successful JSON responses have an endpoint-specific payload and a shared
`meta` object:

```json
{
  "meta": {
    "schema": "awesome-ds/reference-atlas",
    "schemaVersion": "1.0.0",
    "apiVersion": "v1",
    "generatedAt": "2026-07-16T00:00:00.000Z",
    "canonical": "https://awesome-design-system.yumaker.studio/api/v1/references"
  },
  "query": {
    "filters": { "topic": "accessibility" },
    "limit": 25,
    "offset": 0,
    "total": 127,
    "matched": 12,
    "returned": 12,
    "truncated": false,
    "nextOffset": null
  },
  "references": []
}
```

The major API version is encoded in the path. Additive fields may be introduced
within `v1`; breaking shape or meaning changes require a new path version.
Clients should follow canonical links and ignore unknown fields.

Invalid filters return HTTP 400 with `INVALID_QUERY`. Missing or empty Atlas
data fails closed with HTTP 503 and `ATLAS_INTEGRITY_ERROR`, instead of returning
a misleading successful empty collection. Successful responses are CDN cached
for one hour and may be served stale for one day during revalidation; errors are
never cached.
