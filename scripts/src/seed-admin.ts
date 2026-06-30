import { db, pool } from "@workspace/db";
import { adminUsersTable } from "@workspace/db";
import bcrypt from "bcryptjs";

const ADMIN_USERNAME = "admin@justinconsultancy.com";
const ADMIN_PASSWORD = "Admin@123!";

async function ensureSessionTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "session" (
      "sid" varchar NOT NULL,
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL,
      CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
    );
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
  `);
}

async function main() {
  await ensureSessionTable();

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await db.insert(adminUsersTable)
    .values({ username: ADMIN_USERNAME, passwordHash: hash })
    .onConflictDoUpdate({ target: adminUsersTable.username, set: { passwordHash: hash } });
  console.log(`Admin seeded: username=${ADMIN_USERNAME}`);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
