# API dev mode uses tsx

The api-server `dev` script uses `tsx` directly (not `build && start`).

**Why:** The original `build && start` pattern spawns a child `node` process. When the dev process receives SIGTERM to restart, it hits the pnpm parent but the node child can keep holding the port. This causes EADDRINUSE on every restart. With tsx, a single process runs and receives SIGTERM directly.
