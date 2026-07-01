import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  useGetAdminMe,
  getGetAdminMeQueryKey,
  useAdminLogout,
  useGetAnalytics,
  getGetAnalyticsQueryKey,
  useListAdminRequests,
  getListAdminRequestsQueryKey,
  useListAdminMessages,
  getListAdminMessagesQueryKey,
  useUpdateAdminRequest,
  useDeleteAdminRequest,
  useDeleteAdminMessage,
  useExportAdminRequests,
  getExportAdminRequestsQueryKey,
  type ContactMessage,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Tab = "overview" | "requests" | "messages";
type RequestStatus = "pending" | "in_progress" | "completed" | "cancelled";

const STATUS_COLORS: Record<RequestStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={`capitalize text-xs font-semibold ${STATUS_COLORS[status as RequestStatus] || "bg-gray-100 text-gray-700"}`}>
      {status.replace("_", " ")}
    </Badge>
  );
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<null | { id: number; [key: string]: unknown }>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [editStatus, setEditStatus] = useState<RequestStatus>("pending");
  const [editNotes, setEditNotes] = useState("");
  const [page, setPage] = useState(1);
  const [messageSearchQuery, setMessageSearchQuery] = useState("");
  const [messagePage, setMessagePage] = useState(1);

  const logoutMutation = useAdminLogout();
  const updateMutation = useUpdateAdminRequest();
  const deleteMutation = useDeleteAdminRequest();
  const deleteMessageMutation = useDeleteAdminMessage();

  const { data: admin, isLoading: isLoadingAuth, error: authError } = useGetAdminMe({
    query: { queryKey: getGetAdminMeQueryKey(), retry: false },
  });

  const { data: analytics, isLoading: isLoadingAnalytics } = useGetAnalytics({
    query: { queryKey: getGetAnalyticsQueryKey(), enabled: !!admin },
  });

  const requestParams = {
    ...(statusFilter !== "all" && { status: statusFilter as RequestStatus }),
    ...(searchQuery && { search: searchQuery }),
    page,
    limit: 15,
  };

  const { data: requestsData, isLoading: isLoadingRequests } = useListAdminRequests(
    requestParams,
    { query: { queryKey: getListAdminRequestsQueryKey(requestParams), enabled: !!admin && activeTab === "requests" } }
  );

  const messageParams = {
    ...(messageSearchQuery && { search: messageSearchQuery }),
    page: messagePage,
    limit: 15,
  };

  const { data: messagesData, isLoading: isLoadingMessages } = useListAdminMessages(
    messageParams,
    { query: { queryKey: getListAdminMessagesQueryKey(messageParams), enabled: !!admin && activeTab === "messages" } }
  );

  const { data: exportData } = useExportAdminRequests(
    {},
    { query: { queryKey: getExportAdminRequestsQueryKey({}), enabled: false } }
  );

  useEffect(() => {
    if (!isLoadingAuth && (authError || !admin)) {
      setLocation("/admin");
    }
  }, [admin, authError, isLoadingAuth, setLocation]);

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (authError || !admin) {
    return null;
  }

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => setLocation("/admin"),
    });
  };

  const handleUpdate = () => {
    if (!selectedRequest) return;
    updateMutation.mutate(
      { id: selectedRequest.id as number, data: { status: editStatus, adminNotes: editNotes || null } },
      {
        onSuccess: () => {
          toast({ title: "Request Updated", description: "Status and notes saved." });
          queryClient.invalidateQueries({ queryKey: getListAdminRequestsQueryKey(requestParams) });
          queryClient.invalidateQueries({ queryKey: getGetAnalyticsQueryKey() });
          setSelectedRequest(null);
        },
        onError: () => toast({ title: "Error", description: "Failed to update request.", variant: "destructive" }),
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: "Deleted", description: "Request removed." });
          queryClient.invalidateQueries({ queryKey: getListAdminRequestsQueryKey(requestParams) });
          queryClient.invalidateQueries({ queryKey: getGetAnalyticsQueryKey() });
        },
        onError: () => toast({ title: "Error", description: "Failed to delete.", variant: "destructive" }),
      }
    );
  };

  const handleDeleteMessage = (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    deleteMessageMutation.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: "Deleted", description: "Contact message removed." });
          queryClient.invalidateQueries({ queryKey: getListAdminMessagesQueryKey(messageParams) });
          queryClient.invalidateQueries({ queryKey: getGetAnalyticsQueryKey() });
          setSelectedMessage(null);
        },
        onError: () => toast({ title: "Error", description: "Failed to delete message.", variant: "destructive" }),
      }
    );
  };

  const handleExport = () => {
    queryClient.fetchQuery({ queryKey: getExportAdminRequestsQueryKey({}), queryFn: async () => null }).catch(() => {});
    if (!requestsData?.requests) return;
    const headers = ["Request ID", "Company", "Contact", "Email", "Country", "Product", "Category", "Quantity", "Budget", "Status", "Date"];
    const rows = requestsData.requests.map((r) => [
      r.requestId, r.companyName, r.contactPerson, r.email, r.country,
      r.productName, r.productCategory, r.quantity, r.expectedBudget,
      r.status, new Date(r.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jit-requests-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const statCards = [
    { label: "Total Requests", value: analytics?.totalRequests || 0, color: "text-primary" },
    { label: "Contact Messages", value: analytics?.totalContactMessages || 0, color: "text-violet-600" },
    { label: "Pending", value: analytics?.pendingRequests || 0, color: "text-amber-600" },
    { label: "In Progress", value: analytics?.inProgressRequests || 0, color: "text-blue-600" },
    { label: "Completed", value: analytics?.completedRequests || 0, color: "text-emerald-600" },
    { label: "Cancelled", value: analytics?.cancelledRequests || 0, color: "text-red-500" },
  ];

  const tabLabels: Record<Tab, { title: string; subtitle: string }> = {
    overview: { title: "Dashboard Overview", subtitle: "Analytics and recent activity" },
    requests: { title: "Procurement Requests", subtitle: "Manage all client procurement requests" },
    messages: { title: "Contact Messages", subtitle: "Messages from the homepage contact form" },
  };

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-primary-foreground flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <img src="/logo.png" alt="Just-In-Time Consultancy LLC" className="h-20 w-auto object-contain mb-2 bg-white/95 rounded-lg px-2 py-1.5" />
          <p className="text-xs text-white/60">Admin Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {([
            { id: "overview" as Tab, label: "Overview", icon: "grid" },
            { id: "requests" as Tab, label: "All Requests", icon: "clipboard" },
            { id: "messages" as Tab, label: "Contact Messages", icon: "mail" },
          ]).map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                activeTab === id ? "bg-accent text-accent-foreground" : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {icon === "grid" ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              ) : icon === "clipboard" ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              )}
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <div className="px-4 py-2">
            <p className="text-xs text-white/40">Signed in as</p>
            <p className="text-sm font-medium text-white">{admin.username}</p>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-white/60 hover:bg-white/10 hover:text-white text-sm"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-primary">{tabLabels[activeTab].title}</h1>
              <p className="text-sm text-muted-foreground mt-1">{tabLabels[activeTab].subtitle}</p>
            </div>
            {activeTab === "requests" && (
              <Button onClick={handleExport} variant="outline" className="gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Export CSV
              </Button>
            )}
          </div>

          {activeTab === "overview" && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {statCards.map(({ label, value, color }) => (
                  <Card key={label} className="bg-white border-border">
                    <CardHeader className="pb-2 pt-5 px-5">
                      <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-5 pb-5">
                      <div className={`text-3xl font-extrabold ${color}`}>{value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-white border-border">
                  <CardHeader>
                    <CardTitle className="text-base font-bold text-primary">Requests by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingAnalytics ? (
                      <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">Loading...</div>
                    ) : analytics?.requestsByCategory && analytics.requestsByCategory.length > 0 ? (
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={analytics.requestsByCategory} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Bar dataKey="count" fill="hsl(161, 94%, 30%)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
                    )}
                  </CardContent>
                </Card>
                <Card className="bg-white border-border">
                  <CardHeader>
                    <CardTitle className="text-base font-bold text-primary">Monthly Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingAnalytics ? (
                      <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">Loading...</div>
                    ) : analytics?.requestsByMonth && analytics.requestsByMonth.length > 0 ? (
                      <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={[...analytics.requestsByMonth].reverse()} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Line type="monotone" dataKey="count" stroke="hsl(226, 70%, 17%)" strokeWidth={2} dot={{ fill: "hsl(161, 94%, 30%)", r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Requests */}
              <Card className="bg-white border-border">
                <CardHeader>
                  <CardTitle className="text-base font-bold text-primary">Recent Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request ID</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analytics?.recentRequests?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No requests yet</TableCell>
                        </TableRow>
                      ) : analytics?.recentRequests?.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-mono text-xs font-medium text-primary">{r.requestId}</TableCell>
                          <TableCell className="font-medium">{r.companyName}</TableCell>
                          <TableCell className="text-muted-foreground">{r.productName}</TableCell>
                          <TableCell className="text-muted-foreground">{r.country}</TableCell>
                          <TableCell><StatusBadge status={r.status} /></TableCell>
                          <TableCell className="text-muted-foreground text-sm">{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Recent Contact Messages */}
              <Card className="bg-white border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-bold text-primary">Recent Contact Messages</CardTitle>
                  {(analytics?.totalContactMessages ?? 0) > 0 && (
                    <Button variant="ghost" size="sm" className="text-xs" onClick={() => setActiveTab("messages")}>
                      View all
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!analytics?.recentContactMessages?.length ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No contact messages yet</TableCell>
                        </TableRow>
                      ) : analytics.recentContactMessages.map((m) => (
                        <TableRow key={m.id}>
                          <TableCell className="font-medium">{m.name}</TableCell>
                          <TableCell className="text-muted-foreground">{m.email}</TableCell>
                          <TableCell className="text-muted-foreground max-w-[200px] truncate">{m.subject}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{new Date(m.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "requests" && (
            <>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by company, product, or request ID..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                    className="bg-white"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                  <SelectTrigger className="w-48 bg-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Requests Table */}
              <Card className="bg-white border-border">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request ID</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingRequests ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                            Loading...
                          </TableCell>
                        </TableRow>
                      ) : requestsData?.requests.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">No requests found</TableCell>
                        </TableRow>
                      ) : requestsData?.requests.map((r) => (
                        <TableRow key={r.id} className="hover:bg-secondary/80">
                          <TableCell className="font-mono text-xs font-medium text-primary">{r.requestId}</TableCell>
                          <TableCell className="font-medium max-w-[120px] truncate">{r.companyName}</TableCell>
                          <TableCell className="text-muted-foreground max-w-[120px] truncate">{r.productName}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">{r.productCategory}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">{r.country}</TableCell>
                          <TableCell><StatusBadge status={r.status} /></TableCell>
                          <TableCell className="text-muted-foreground text-xs">{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button size="sm" variant="ghost" className="h-7 text-xs"
                                onClick={() => { setSelectedRequest(r as unknown as { id: number; [key: string]: unknown }); setEditStatus(r.status as RequestStatus); setEditNotes((r.adminNotes as string) || ""); }}>
                                Edit
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDelete(r.id)}
                                disabled={deleteMutation.isPending}>
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Pagination */}
              {requestsData && requestsData.totalPages > 1 && (
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Showing {requestsData.requests.length} of {requestsData.total} requests</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                    <span className="px-3 py-1 rounded border text-xs">{page} / {requestsData.totalPages}</span>
                    <Button variant="outline" size="sm" disabled={page >= requestsData.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "messages" && (
            <>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by name, email, subject, or message..."
                    value={messageSearchQuery}
                    onChange={(e) => { setMessageSearchQuery(e.target.value); setMessagePage(1); }}
                    className="bg-white"
                  />
                </div>
              </div>

              <Card className="bg-white border-border">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingMessages ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                            Loading...
                          </TableCell>
                        </TableRow>
                      ) : messagesData?.messages.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No contact messages found</TableCell>
                        </TableRow>
                      ) : messagesData?.messages.map((m) => (
                        <TableRow key={m.id} className="hover:bg-secondary/80">
                          <TableCell className="font-medium">{m.name}</TableCell>
                          <TableCell className="text-muted-foreground">{m.email}</TableCell>
                          <TableCell className="text-muted-foreground max-w-[180px] truncate">{m.subject}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">{new Date(m.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setSelectedMessage(m)}>
                                View
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteMessage(m.id)}
                                disabled={deleteMessageMutation.isPending}>
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {messagesData && messagesData.totalPages > 1 && (
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Showing {messagesData.messages.length} of {messagesData.total} messages</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={messagePage <= 1} onClick={() => setMessagePage(p => p - 1)}>Previous</Button>
                    <span className="px-3 py-1 rounded border text-xs">{messagePage} / {messagesData.totalPages}</span>
                    <Button variant="outline" size="sm" disabled={messagePage >= messagesData.totalPages} onClick={() => setMessagePage(p => p + 1)}>Next</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Message Dialog */}
      {selectedMessage && (
        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-primary">{selectedMessage.subject}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 p-4 bg-secondary rounded-lg">
                {[
                  ["Name", selectedMessage.name],
                  ["Email", selectedMessage.email],
                  ["Phone", selectedMessage.phone || "—"],
                  ["Date", new Date(selectedMessage.createdAt).toLocaleString()],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
                    <p className="font-medium text-primary mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Message</p>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSelectedMessage(null)}>Close</Button>
                <Button variant="destructive" onClick={() => handleDeleteMessage(selectedMessage.id)} disabled={deleteMessageMutation.isPending}>
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Dialog */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-primary">
                Request Details — <span className="font-mono text-sm text-muted-foreground">{String(selectedRequest.requestId)}</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 p-4 bg-secondary rounded-lg">
                {[
                  ["Company", "companyName"], ["Contact", "contactPerson"], ["Email", "email"],
                  ["Phone", "phone"], ["Country", "country"], ["Product", "productName"],
                  ["Category", "productCategory"], ["Quantity", "quantity"], ["Budget", "expectedBudget"],
                  ["Delivery Country", "preferredDeliveryCountry"], ["Delivery Date", "requiredDeliveryDate"],
                ].map(([label, key]) => (
                  <div key={key}>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
                    <p className="font-medium text-primary mt-0.5">{String(selectedRequest[key] || "—")}</p>
                  </div>
                ))}
              </div>
              {Boolean(selectedRequest.description) && (
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Description</p>
                  <p className="text-foreground leading-relaxed">{String(selectedRequest.description)}</p>
                </div>
              )}
              {Boolean(selectedRequest.additionalNotes) && (
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Additional Notes</p>
                  <p className="text-foreground leading-relaxed">{String(selectedRequest.additionalNotes)}</p>
                </div>
              )}
              <div className="border-t pt-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Update Status</label>
                  <Select value={editStatus} onValueChange={(v) => setEditStatus(v as RequestStatus)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Admin Notes</label>
                  <Textarea
                    className="mt-2 resize-none"
                    rows={3}
                    placeholder="Internal notes (not visible to client)..."
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleUpdate} disabled={updateMutation.isPending} className="bg-accent hover:bg-accent/90 text-white">
                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedRequest(null)}>Cancel</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
