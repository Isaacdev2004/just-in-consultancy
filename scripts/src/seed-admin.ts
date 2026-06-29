import { db } from "@workspace/db";
import { adminUsersTable } from "@workspace/db";
import bcrypt from "bcryptjs";

async function main() {
  const hash = await bcrypt.hash("admin123", 10);
  await db.insert(adminUsersTable)
    .values({ username: "admin", passwordHash: hash })
    .onConflictDoUpdate({ target: adminUsersTable.username, set: { passwordHash: hash } });
  console.log("Admin seeded: username=admin, password=admin123");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
