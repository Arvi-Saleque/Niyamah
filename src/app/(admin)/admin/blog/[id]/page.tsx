"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Trash2 } from "lucide-react";
import { BlogPostForm, type BlogPostFormValues } from "@/components/admin/blog-post-form";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [defaults, setDefaults] = useState<Partial<BlogPostFormValues> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await fetch(`/api/v1/admin/blog/posts/${id}`);
      const json = await res.json();
      if (!res.ok) {
        toast.error("Failed to load post");
        return;
      }
      const p = json.data;
      setDefaults({
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt ?? "",
        content: p.content ?? "",
        featuredImage: p.featuredImage ?? "",
        status: p.status ?? "draft",
        seoTitle: p.seoTitle ?? "",
        seoDescription: p.seoDescription ?? "",
      });
      setLoading(false);
    })();
  }, [id]);

  const handleSubmit = async (values: BlogPostFormValues) => {
    const payload = {
      title: values.title,
      slug: values.slug,
      content: values.content,
      ...(values.excerpt && { excerpt: values.excerpt }),
      ...(values.featuredImage && { featuredImage: values.featuredImage }),
      ...(values.seoTitle && { seoTitle: values.seoTitle }),
      ...(values.seoDescription && { seoDescription: values.seoDescription }),
      status: values.status,
    };
    const res = await fetch(`/api/v1/admin/blog/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json?.error?.message ?? "Failed to update");
      return;
    }
    toast.success("Post updated");
    router.refresh();
  };

  const handleDelete = async () => {
    const res = await fetch(`/api/v1/admin/blog/posts/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      toast.error("Failed to delete");
      return;
    }
    toast.success("Post deleted");
    router.push("/admin/blog");
  };

  if (loading || !defaults) {
    return <div className="py-12 text-center text-[var(--color-text-muted)]">Loading…</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-3">
            <Link href="/admin/blog">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
            Edit Blog Post
          </h1>
        </div>
        <ConfirmDialog
          trigger={
            <Button variant="outline" className="text-red-600">
              <Trash2 className="mr-1 h-4 w-4" /> Delete
            </Button>
          }
          title="Delete this post?"
          description="This action cannot be undone."
          confirmLabel="Delete"
          destructive
          onConfirm={handleDelete}
        />
      </div>
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
        <BlogPostForm defaultValues={defaults} onSubmit={handleSubmit} submitLabel="Update post" />
      </div>
    </div>
  );
}
