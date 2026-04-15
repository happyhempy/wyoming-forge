import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Database } from "@/integrations/supabase/types";

type Lead = Database["public"]["Tables"]["leads"]["Row"];
type Affiliate = Database["public"]["Tables"]["affiliates"]["Row"];
type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];

export const Route = createFileRoute("/_authenticated/_admin/super-admin")({
  component: SuperAdminPanel,
  head: () => ({
    meta: [{ title: "Super Admin — US LLC Formation" }],
  }),
});

function SuperAdminPanel() {
  const [tab, setTab] = useState<"overview" | "clients" | "admins" | "leads" | "affiliates" | "blog">("overview");
  const [stats, setStats] = useState({ totalClients: 0, totalRevenue: 0, activeCases: 0, completedCases: 0 });
  const [leads, setLeads] = useState<Lead[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Blog form
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSlug, setBlogSlug] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogPublished, setBlogPublished] = useState(false);
  const [editingBlog, setEditingBlog] = useState<string | null>(null);

  // Admin form
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [casesRes, leadsRes, affiliatesRes, blogRes] = await Promise.all([
      supabase.from("cases").select("*"),
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("affiliates").select("*").order("created_at", { ascending: false }),
      supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
    ]);

    const cases = casesRes.data ?? [];
    setStats({
      totalClients: cases.length,
      totalRevenue: cases.filter((c) => c.payment_status === "completed").length * 399,
      activeCases: cases.filter((c) => c.current_step < 8).length,
      completedCases: cases.filter((c) => c.current_step >= 8).length,
    });

    setLeads(leadsRes.data ?? []);
    setAffiliates(affiliatesRes.data ?? []);
    setBlogPosts(blogRes.data ?? []);
    setLoading(false);
  };

  const saveBlogPost = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const postData = {
      title: blogTitle,
      slug: blogSlug || blogTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      excerpt: blogExcerpt,
      content: blogContent,
      published: blogPublished,
      author_id: user.id,
    };

    if (editingBlog) {
      await supabase.from("blog_posts").update(postData).eq("id", editingBlog);
    } else {
      await supabase.from("blog_posts").insert(postData);
    }

    resetBlogForm();
    loadData();
  };

  const resetBlogForm = () => {
    setBlogTitle("");
    setBlogSlug("");
    setBlogExcerpt("");
    setBlogContent("");
    setBlogPublished(false);
    setEditingBlog(null);
  };

  const editBlogPost = (post: BlogPost) => {
    setBlogTitle(post.title);
    setBlogSlug(post.slug);
    setBlogExcerpt(post.excerpt ?? "");
    setBlogContent(post.content ?? "");
    setBlogPublished(post.published);
    setEditingBlog(post.id);
    setTab("blog");
  };

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "clients" as const, label: "Clients" },
    { id: "admins" as const, label: "Admins" },
    { id: "leads" as const, label: "Leads" },
    { id: "affiliates" as const, label: "Affiliates" },
    { id: "blog" as const, label: "Blog" },
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold mb-6">Super Admin Panel</h1>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {tabs.map((t) => (
              <Button
                key={t.id}
                variant={tab === t.id ? "gold" : "outline"}
                size="sm"
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </Button>
            ))}
          </div>

          {/* Overview */}
          {tab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "Total Clients", value: stats.totalClients },
                { label: "Est. Revenue", value: `$${stats.totalRevenue.toLocaleString()}` },
                { label: "Active Cases", value: stats.activeCases },
                { label: "Completed", value: stats.completedCases },
              ].map((s) => (
                <div key={s.label} className="bg-card border border-border rounded-2xl p-6 text-center">
                  <p className="text-3xl font-bold text-gold">{s.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Leads */}
          {tab === "leads" && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Leads ({leads.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Email</th>
                      <th className="text-left py-2">Phone</th>
                      <th className="text-left py-2">Business</th>
                      <th className="text-left py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((l) => (
                      <tr key={l.id} className="border-b border-border/50">
                        <td className="py-2">{l.full_name}</td>
                        <td className="py-2">{l.email}</td>
                        <td className="py-2">{l.phone || "—"}</td>
                        <td className="py-2">{l.business_type}</td>
                        <td className="py-2">{new Date(l.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Affiliates */}
          {tab === "affiliates" && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Affiliate Applications ({affiliates.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Email</th>
                      <th className="text-left py-2">Website</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {affiliates.map((a) => (
                      <tr key={a.id} className="border-b border-border/50">
                        <td className="py-2">{a.full_name}</td>
                        <td className="py-2">{a.email}</td>
                        <td className="py-2">{a.website || "—"}</td>
                        <td className="py-2 capitalize">{a.status}</td>
                        <td className="py-2">
                          {a.status === "pending" && (
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" onClick={() => supabase.from("affiliates").update({ status: "approved" }).eq("id", a.id).then(loadData)}>
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => supabase.from("affiliates").update({ status: "rejected" }).eq("id", a.id).then(loadData)}>
                                Reject
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Blog */}
          {tab === "blog" && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">{editingBlog ? "Edit Post" : "New Blog Post"}</h2>
                <div className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label>Slug</Label>
                    <Input value={blogSlug} onChange={(e) => setBlogSlug(e.target.value)} placeholder="auto-generated" className="mt-1" />
                  </div>
                  <div>
                    <Label>Excerpt</Label>
                    <Textarea value={blogExcerpt} onChange={(e) => setBlogExcerpt(e.target.value)} rows={2} className="mt-1" />
                  </div>
                  <div>
                    <Label>Content</Label>
                    <Textarea value={blogContent} onChange={(e) => setBlogContent(e.target.value)} rows={10} className="mt-1" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={blogPublished} onChange={(e) => setBlogPublished(e.target.checked)} id="published" />
                    <Label htmlFor="published">Published</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="gold" onClick={saveBlogPost}>
                      {editingBlog ? "Update Post" : "Create Post"}
                    </Button>
                    {editingBlog && (
                      <Button variant="outline" onClick={resetBlogForm}>Cancel</Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">All Posts ({blogPosts.length})</h2>
                <div className="space-y-3">
                  {blogPosts.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.published ? "Published" : "Draft"} • {new Date(p.created_at).toLocaleDateString()}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => editBlogPost(p)}>Edit</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Clients tab placeholder */}
          {tab === "clients" && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">All Clients</h2>
              <p className="text-muted-foreground text-sm">Client management is available in the Admin Panel. Navigate to /admin to manage individual cases.</p>
            </div>
          )}

          {/* Admins tab */}
          {tab === "admins" && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Create Admin Account</h2>
              <p className="text-sm text-muted-foreground mb-4">Create a new admin user who can manage assigned client cases.</p>
              <div className="space-y-4 max-w-md">
                <div>
                  <Label>Full Name</Label>
                  <Input value={adminName} onChange={(e) => setAdminName(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="mt-1" />
                </div>
                <Button variant="gold" onClick={async () => {
                  if (!adminEmail || !adminPassword || !adminName) return;
                  // Note: In production, this should be done via a server function with admin privileges
                  alert("Admin creation requires a server function with service role access. This will be implemented with the payments setup.");
                  setAdminEmail("");
                  setAdminPassword("");
                  setAdminName("");
                }}>
                  Create Admin
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
