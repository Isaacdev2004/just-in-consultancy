---
name: Port kill via proc filesystem
description: How to kill processes holding a port when fuser/lsof/ss/netstat are unavailable
---

In this Replit environment, `fuser`, `lsof`, `ss`, and `netstat` are not installed.

**How to find and kill a process holding a port via /proc:**
```bash
# Port 8080 is hex 0x1F90
inode=$(cat /proc/net/tcp | awk '$2=="00000000:1F90" {print $10}')
for pid in $(ls /proc | grep -E '^[0-9]+$'); do
  if ls -la /proc/$pid/fd 2>/dev/null | grep -q "socket:\[$inode\]"; then
    kill -9 $pid
  fi
done
```

Replace `1F90` with the hex of the port you want (use `printf '%X' <port>` to convert).

**Why:** The Replit NixOS container only includes minimal system tools. The /proc filesystem is always available.
