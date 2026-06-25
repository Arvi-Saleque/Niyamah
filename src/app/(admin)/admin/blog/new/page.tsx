"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { BlogPostForm, type BlogPostFormValues } from "@/components/admin/blog-post-form";
import { Button } from "@/components/ui/button";

export default function NewBlogPostPage() {
  const router = useRouter();

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
    const res = await fetch("/api/v1/admin/blog/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json?.error?.message ?? "Failed to create post");
      return;
    }
    toast.success("Post created");
    router.push(`/admin/blog/${json.data.id}`);
    router.refresh();
  };

  return (
    <div>
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-3">
          <Link href="/admin/blog">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to posts
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
          New Blog Post
        </h1>
      </div>
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
        <BlogPostForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
