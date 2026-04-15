import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];

export const Route = createFileRoute("/blog")({
  component: BlogPage,
  head: () => ({
    meta: [
      { title: "Blog — US LLC Formation Tips & Guides" },
      { name: "description", content: "Expert guides on US LLC formation, Wyoming LLCs, EIN applications, and business banking for international entrepreneurs." },
      { property: "og:title", content: "Blog — US LLC Formation Tips & Guides" },
      { property: "og:description", content: "Expert guides on US LLC formation for international entrepreneurs." },
    ],
  }),
});

function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setPosts(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-navy text-primary-foreground pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-up">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-lg text-primary-foreground/70">
              Expert guides, tips, and insights on US LLC formation for international entrepreneurs.
            </p>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <p className="text-center text-muted-foreground">Loading posts...</p>
            ) : posts.length === 0 ? (
              <p className="text-center text-muted-foreground">No blog posts yet. Check back soon!</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, i) => (
                  <article
                    key={post.id}
                    className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-fade-up"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="h-48 bg-navy flex items-center justify-center">
                      {post.cover_image ? (
                        <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-primary-foreground/30 text-6xl">📄</span>
                      )}
                    </div>
                    <div className="p-6">
                      <p className="text-xs text-muted-foreground mb-2">
                        {new Date(post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                      <h2 className="font-bold text-foreground text-lg mb-2 line-clamp-2">{post.title}</h2>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                      )}
                      <Link to="/blog/$slug" params={{ slug: post.slug }}>
                        <Button variant="navyOutline" size="sm">Read More</Button>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-16 bg-navy text-primary-foreground">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-primary-foreground/70 mb-6">Open your US LLC today — fast, simple, from anywhere.</p>
            <Link to="/">
              <Button variant="gold" size="lg">Get Started Now</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
