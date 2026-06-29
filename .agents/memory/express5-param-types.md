---
name: Express 5 param types
description: req.params.id is typed as string|string[] in Express 5 type definitions
---

In Express 5 (`@types/express ^5.x`), `req.params` values are typed as `string | string[]`, not just `string`.

**Why:** The Express 5 type definitions changed the params type. `parseInt(req.params.id)` will fail typecheck with "Argument of type 'string | string[]' is not assignable to parameter of type 'string'".

**How to apply:** Always cast: `parseInt(String(req.params.id))`. Also applies to any other `req.params` access passed to functions expecting `string`.
