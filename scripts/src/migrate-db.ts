import { pool } from "@workspace/db";

async function migrate() {
  await pool.query(`
    DO $$ BEGIN
      CREATE TYPE request_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS service_requests (
      id serial PRIMARY KEY,
      request_id text NOT NULL UNIQUE,
      company_name text NOT NULL,
      contact_person text NOT NULL,
      email text NOT NULL,
      phone text NOT NULL,
      country text NOT NULL,
      product_name text NOT NULL,
      product_category text NOT NULL,
      description text NOT NULL,
      quantity text NOT NULL,
      expected_budget text NOT NULL,
      preferred_delivery_country text NOT NULL,
      required_delivery_date text,
      additional_notes text,
      attachment_file_name text,
      attachment_data text,
      status request_status NOT NULL DEFAULT 'pending',
      admin_notes text,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS attachment_file_name text;`);
  await pool.query(`ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS attachment_data text;`);
  await pool.query(`ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS admin_notes text;`);
  await pool.query(`ALTER TABLE service_requests ALTER COLUMN created_at SET DEFAULT now();`);
  await pool.query(`ALTER TABLE service_requests ALTER COLUMN updated_at SET DEFAULT now();`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id serial PRIMARY KEY,
      name text NOT NULL,
      email text NOT NULL,
      phone text,
      subject text NOT NULL,
      message text NOT NULL,
      created_at timestamp NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS supplier_registrations (
      id serial PRIMARY KEY,
      company_name text NOT NULL,
      contact_person text NOT NULL,
      email text NOT NULL,
      phone text NOT NULL,
      country text NOT NULL,
      product_categories text NOT NULL,
      pricing_info text,
      certifications text,
      company_description text NOT NULL,
      created_at timestamp NOT NULL DEFAULT now()
    );
  `);

  console.log("Database migration completed.");
}

migrate()
  .catch((err) => {
    console.error("Database migration failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
