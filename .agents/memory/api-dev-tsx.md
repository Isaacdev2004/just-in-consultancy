---
name: API dev mode tsx
description: Why api-server uses tsx instead of build+start for dev, and the EADDRINUSE risk
---

Use `NODE_ENV=development tsx --tsconfig tsconfig.json src/index.ts` as the dev script for the api-server.

**Why:** The original `build && start` pattern spawns a child `node` process. When the Replit workflow system sends SIGTERM to restart, it hits the pnpm parent but the node child can keep holding the port. This causes EADDRINUSE on every restart. With tsx, a single process runs and receives SIGTERM directly.

**How to apply:** Keep `"dev": "NODE_ENV=development tsx --tsconfig tsconfig.json src/index.ts"` in `artifacts/api-server/package.json`. Do not revert to build+start for dev. Production still uses the esbuild bundle via the `build` + `start` scripts.
