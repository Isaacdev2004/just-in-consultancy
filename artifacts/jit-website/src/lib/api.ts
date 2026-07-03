const API_BASE = "/api";

export type SupplierRegistrationInput = {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  productCategories: string;
  pricingInfo?: string;
  certifications?: string;
  companyDescription: string;
};

export async function submitSupplierRegistration(data: SupplierRegistrationInput) {
  const res = await fetch(`${API_BASE}/suppliers/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Submission failed");
  }
  return res.json();
}

export type SupplierRegistration = SupplierRegistrationInput & {
  id: number;
  createdAt: string;
};

export async function listAdminSuppliers(page = 1, search = "") {
  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (search) params.set("search", search);
  const res = await fetch(`${API_BASE}/admin/suppliers?${params}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load suppliers");
  return res.json() as Promise<{
    suppliers: SupplierRegistration[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
}

export async function deleteAdminSupplier(id: number) {
  const res = await fetch(`${API_BASE}/admin/suppliers/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete");
  return res.json();
}
