import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const supplierRegistrationsTable = pgTable("supplier_registrations", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  country: text("country").notNull(),
  productCategories: text("product_categories").notNull(),
  pricingInfo: text("pricing_info"),
  certifications: text("certifications"),
  companyDescription: text("company_description").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSupplierRegistrationSchema = createInsertSchema(supplierRegistrationsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertSupplierRegistration = z.infer<typeof insertSupplierRegistrationSchema>;
export type SupplierRegistration = typeof supplierRegistrationsTable.$inferSelect;
