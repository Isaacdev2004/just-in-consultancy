import { Router } from "express";
import { db } from "@workspace/db";
import { supplierRegistrationsTable } from "@workspace/db";
import { z } from "zod";

const router = Router();

const registerSchema = z.object({
  companyName: z.string().min(1),
  contactPerson: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  country: z.string().min(1),
  productCategories: z.string().min(1),
  pricingInfo: z.string().optional().nullable(),
  certifications: z.string().optional().nullable(),
  companyDescription: z.string().min(10),
});

router.post("/suppliers/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed" });
  }

  const [registration] = await db
    .insert(supplierRegistrationsTable)
    .values({
      ...parsed.data,
      pricingInfo: parsed.data.pricingInfo ?? null,
      certifications: parsed.data.certifications ?? null,
    })
    .returning();

  return res.status(201).json(formatSupplier(registration));
});

export function formatSupplier(r: typeof supplierRegistrationsTable.$inferSelect) {
  return {
    id: r.id,
    companyName: r.companyName,
    contactPerson: r.contactPerson,
    email: r.email,
    phone: r.phone,
    country: r.country,
    productCategories: r.productCategories,
    pricingInfo: r.pricingInfo ?? null,
    certifications: r.certifications ?? null,
    companyDescription: r.companyDescription,
    createdAt: r.createdAt.toISOString(),
  };
}

export default router;
