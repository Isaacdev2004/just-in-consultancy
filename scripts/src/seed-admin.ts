import { db } from "@workspace/db";
import { adminUsersTable } from "@workspace/db";
import bcrypt from "bcryptjs";

const ADMIN_USERNAME = "admin@justinconsultancy.com";
const ADMIN_PASSWORD = "Admin@123!";

async function main() {
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await db.insert(adminUsersTable)
    .values({ username: ADMIN_USERNAME, passwordHash: hash })
    .onConflictDoUpdate({ target: adminUsersTable.username, set: { passwordHash: hash } });
  console.log(`Admin seeded: username=${ADMIN_USERNAME}`);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
