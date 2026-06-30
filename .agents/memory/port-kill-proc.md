# Port kill via /proc when standard tools unavailable

On minimal Linux containers, `fuser`, `lsof`, `ss`, and `netstat` may not be installed.

**Fallback:** Use `/proc/net/tcp` to find the inode for the port, then scan `/proc/*/fd/*` to find the PID holding it.

**Why:** The /proc filesystem is always available on Linux.
