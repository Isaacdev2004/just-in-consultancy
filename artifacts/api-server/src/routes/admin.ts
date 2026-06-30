import { Router } from "express";
import { db } from "@workspace/db";
import { serviceRequestsTable, adminUsersTable, contactMessagesTable } from "@workspace/db";
import { eq, and, or, ilike, desc, sql, count } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { requireAdmin } from "../middlewares/auth";
import { formatRequest } from "./requests";
import { formatContactMessage } from "./contact";

const router = Router();

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const updateRequestSchema = z.object({
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]).optional(),
  adminNotes: z.string().nullable().optional(),
});

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const [admin] = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.username, parsed.data.username))
    .limit(1);

  if (!admin) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(parsed.data.password, admin.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  void req.session.regenerate((regErr) => {
    if (regErr) {
      res.status(500).json({ error: "Failed to create session" });
      return;
    }

    req.session.adminId = admin.id;
    req.session.adminUsername = admin.username;

    req.session.save((saveErr) => {
      if (saveErr) {
        res.status(500).json({ error: "Failed to create session" });
        return;
      }

      res.json({
        message: "Login successful",
        admin: { id: admin.id, username: admin.username },
      });
    });
  });
});

router.post("/admin/logout", (req, res) => {
  req.session.destroy(() => {});
  return res.json({ message: "Logged out" });
});

router.get("/admin/me", requireAdmin, async (req, res) => {
  return res.json({
    id: req.session.adminId,
    username: req.session.adminUsername,
  });
});

router.get("/admin/requests/export", requireAdmin, async (req, res) => {
  const status = Array.isArray(req.query.status) ? String(req.query.status[0]) : String(req.query.status || "");

  const conditions = [];
  if (status && ["pending", "in_progress", "completed", "cancelled"].includes(status)) {
    conditions.push(eq(serviceRequestsTable.status, status as "pending" | "in_progress" | "completed" | "cancelled"));
  }

  const requests = await db
    .select()
    .from(serviceRequestsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(serviceRequestsTable.createdAt));

  return res.json({
    data: requests.map(formatRequest),
    filename: `jit-requests-${new Date().toISOString().split("T")[0]}.csv`,
  });
});

router.get("/admin/requests", requireAdmin, async (req, res) => {
  const status = Array.isArray(req.query.status) ? String(req.query.status[0]) : String(req.query.status || "");
  const search = Array.isArray(req.query.search) ? String(req.query.search[0]) : String(req.query.search || "");
  const page = Array.isArray(req.query.page) ? String(req.query.page[0]) : String(req.query.page || "1");
  const limit = Array.isArray(req.query.limit) ? String(req.query.limit[0]) : String(req.query.limit || "20");

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  const conditions = [];
  if (status && ["pending", "in_progress", "completed", "cancelled"].includes(status)) {
    conditions.push(eq(serviceRequestsTable.status, status as "pending" | "in_progress" | "completed" | "cancelled"));
  }
  if (search) {
    conditions.push(
      or(
        ilike(serviceRequestsTable.companyName, `%${search}%`),
        ilike(serviceRequestsTable.productName, `%${search}%`),
        ilike(serviceRequestsTable.contactPerson, `%${search}%`),
        ilike(serviceRequestsTable.requestId, `%${search}%`),
      )
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalResult] = await db
    .select({ count: count() })
    .from(serviceRequestsTable)
    .where(where);

  const total = Number(totalResult.count);

  const requests = await db
    .select()
    .from(serviceRequestsTable)
    .where(where)
    .orderBy(desc(serviceRequestsTable.createdAt))
    .limit(limitNum)
    .offset(offset);

  return res.json({
    requests: requests.map(formatRequest),
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  });
});

router.get("/admin/requests/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const [request] = await db
    .select()
    .from(serviceRequestsTable)
    .where(eq(serviceRequestsTable.id, id))
    .limit(1);

  if (!request) return res.status(404).json({ error: "Request not found" });

  return res.json(formatRequest(request));
});

router.patch("/admin/requests/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const parsed = updateRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed" });
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (parsed.data.status !== undefined) updates.status = parsed.data.status;
  if (parsed.data.adminNotes !== undefined) updates.adminNotes = parsed.data.adminNotes;

  const [updated] = await db
    .update(serviceRequestsTable)
    .set(updates)
    .where(eq(serviceRequestsTable.id, id))
    .returning();

  if (!updated) return res.status(404).json({ error: "Request not found" });

  return res.json(formatRequest(updated));
});

router.delete("/admin/requests/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const [deleted] = await db
    .delete(serviceRequestsTable)
    .where(eq(serviceRequestsTable.id, id))
    .returning();

  if (!deleted) return res.status(404).json({ error: "Request not found" });

  return res.json({ message: "Request deleted" });
});

router.get("/admin/messages", requireAdmin, async (req, res) => {
  const search = Array.isArray(req.query.search) ? String(req.query.search[0]) : String(req.query.search || "");
  const page = Array.isArray(req.query.page) ? String(req.query.page[0]) : String(req.query.page || "1");
  const limit = Array.isArray(req.query.limit) ? String(req.query.limit[0]) : String(req.query.limit || "20");

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  const conditions = [];
  if (search) {
    conditions.push(
      or(
        ilike(contactMessagesTable.name, `%${search}%`),
        ilike(contactMessagesTable.email, `%${search}%`),
        ilike(contactMessagesTable.subject, `%${search}%`),
        ilike(contactMessagesTable.message, `%${search}%`),
      )
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalResult] = await db
    .select({ count: count() })
    .from(contactMessagesTable)
    .where(where);

  const total = Number(totalResult.count);

  const messages = await db
    .select()
    .from(contactMessagesTable)
    .where(where)
    .orderBy(desc(contactMessagesTable.createdAt))
    .limit(limitNum)
    .offset(offset);

  return res.json({
    messages: messages.map(formatContactMessage),
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  });
});

router.get("/admin/messages/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const [message] = await db
    .select()
    .from(contactMessagesTable)
    .where(eq(contactMessagesTable.id, id))
    .limit(1);

  if (!message) return res.status(404).json({ error: "Message not found" });

  return res.json(formatContactMessage(message));
});

router.delete("/admin/messages/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id));
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const [deleted] = await db
    .delete(contactMessagesTable)
    .where(eq(contactMessagesTable.id, id))
    .returning();

  if (!deleted) return res.status(404).json({ error: "Message not found" });

  return res.json({ message: "Message deleted" });
});

router.get("/admin/analytics", requireAdmin, async (req, res) => {
  const [totals] = await db
    .select({
      total: count(),
      pending: sql<number>`count(*) filter (where status = 'pending')`,
      in_progress: sql<number>`count(*) filter (where status = 'in_progress')`,
      completed: sql<number>`count(*) filter (where status = 'completed')`,
      cancelled: sql<number>`count(*) filter (where status = 'cancelled')`,
    })
    .from(serviceRequestsTable);

  const recentRequests = await db
    .select()
    .from(serviceRequestsTable)
    .orderBy(desc(serviceRequestsTable.createdAt))
    .limit(5);

  const [contactTotalResult] = await db
    .select({ count: count() })
    .from(contactMessagesTable);

  const recentContactMessages = await db
    .select()
    .from(contactMessagesTable)
    .orderBy(desc(contactMessagesTable.createdAt))
    .limit(5);

  const categoryRows = await db
    .select({
      category: serviceRequestsTable.productCategory,
      count: count(),
    })
    .from(serviceRequestsTable)
    .groupBy(serviceRequestsTable.productCategory)
    .orderBy(desc(count()));

  const monthlyRows = await db.execute(sql`
    SELECT
      to_char(created_at, 'YYYY-MM') as month,
      COUNT(*)::int as count
    FROM service_requests
    GROUP BY to_char(created_at, 'YYYY-MM')
    ORDER BY month DESC
    LIMIT 12
  `);

  return res.json({
    totalRequests: Number(totals.total),
    pendingRequests: Number(totals.pending),
    inProgressRequests: Number(totals.in_progress),
    completedRequests: Number(totals.completed),
    cancelledRequests: Number(totals.cancelled),
    totalContactMessages: Number(contactTotalResult.count),
    recentRequests: recentRequests.map(formatRequest),
    recentContactMessages: recentContactMessages.map(formatContactMessage),
    requestsByCategory: categoryRows.map((r) => ({
      category: r.category,
      count: Number(r.count),
    })),
    requestsByMonth: (monthlyRows.rows as { month: string; count: number }[]).map((r) => ({
      month: r.month,
      count: Number(r.count),
    })),
  });
});

export default router;
