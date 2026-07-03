import { pgTable, text, serial, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const requestStatusEnum = pgEnum("request_status", [
  "pending",
  "in_progress",
  "completed",
  "cancelled",
]);

export const serviceRequestsTable = pgTable("service_requests", {
  id: serial("id").primaryKey(),
  requestId: text("request_id").notNull().unique(),
  companyName: text("company_name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  country: text("country").notNull(),
  productName: text("product_name").notNull(),
  productCategory: text("product_category").notNull(),
  description: text("description").notNull(),
  quantity: text("quantity").notNull(),
  expectedBudget: text("expected_budget").notNull(),
  preferredDeliveryCountry: text("preferred_delivery_country").notNull(),
  requiredDeliveryDate: text("required_delivery_date"),
  additionalNotes: text("additional_notes"),
  attachmentFileName: text("attachment_file_name"),
  attachmentData: text("attachment_data"),
  status: requestStatusEnum("status").notNull().default("pending"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertServiceRequestSchema = createInsertSchema(serviceRequestsTable).omit({
  id: true,
  requestId: true,
  status: true,
  adminNotes: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertServiceRequest = z.infer<typeof insertServiceRequestSchema>;
export type ServiceRequest = typeof serviceRequestsTable.$inferSelect;
