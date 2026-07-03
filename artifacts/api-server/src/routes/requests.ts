import { Router } from "express";
import { db } from "@workspace/db";
import { serviceRequestsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

function generateRequestId(): string {
  const prefix = "JIT";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

const submitRequestSchema = z.object({
  companyName: z.string().min(1),
  contactPerson: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  country: z.string().min(1),
  productName: z.string().min(1),
  productCategory: z.string().min(1),
  description: z.string().min(10),
  quantity: z.string().min(1),
  expectedBudget: z.string().optional().nullable(),
  preferredDeliveryCountry: z.string().min(1),
  requiredDeliveryDate: z.string().optional().nullable(),
  additionalNotes: z.string().optional().nullable(),
  attachmentFileName: z.string().optional().nullable(),
  attachmentData: z.string().optional().nullable(),
});

router.post("/requests", async (req, res) => {
  const parsed = submitRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed" });
  }

  const requestId = generateRequestId();
  const [newRequest] = await db.insert(serviceRequestsTable).values({
    requestId,
    ...parsed.data,
    expectedBudget: parsed.data.expectedBudget ?? "Not specified",
    status: "pending",
  }).returning();

  return res.status(201).json(formatRequest(newRequest));
});

export function formatRequest(r: typeof serviceRequestsTable.$inferSelect) {
  return {
    id: r.id,
    requestId: r.requestId,
    companyName: r.companyName,
    contactPerson: r.contactPerson,
    email: r.email,
    phone: r.phone,
    country: r.country,
    productName: r.productName,
    productCategory: r.productCategory,
    description: r.description,
    quantity: r.quantity,
    expectedBudget: r.expectedBudget,
    preferredDeliveryCountry: r.preferredDeliveryCountry,
    requiredDeliveryDate: r.requiredDeliveryDate ?? null,
    additionalNotes: r.additionalNotes ?? null,
    attachmentFileName: r.attachmentFileName ?? null,
    attachmentData: r.attachmentData ?? null,
    status: r.status,
    adminNotes: r.adminNotes ?? null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

export default router;
