import { notFound } from "next/navigation";
import Script from "next/script";
import Image from "next/image";
import { Container } from "@/components/shared/container";
import { Heading, Text } from "@/components/shared/typography";
import { blogRepository } from "@/modules/blog/infrastructure/blog.repository";
import { articleLd } from "@/lib/marketing/json-ld";

export const revalidate = 300;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://niyamah.com.bd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await blogRepository.findPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: `${post.title} — Niyamah Journal`,
    description: post.excerpt ?? "",
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await blogRepository.findPostBySlug(slug);
  if (!post || post.status !== "published") notFound();

  return (
    <Container className="py-10">
      <article className="mx-auto max-w-3xl">
        {post.featuredImage && (
          <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}
        <Heading as="h1" size="2xl" className="mb-3">
          {post.title}
        </Heading>
        {post.excerpt && (
          <Text variant="muted" className="mb-8 text-lg">
            {post.excerpt}
          </Text>
        )}
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
        />
      </article>

      <Script
        id="ld-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleLd({
              headline: post.title,
              description: post.excerpt ?? "",
              ...(post.featuredImage && { image: post.featuredImage }),
              ...(post.author?.name && { authorName: post.author.name }),
              datePublished:
                post.publishedAt?.toISOString() ?? new Date().toISOString(),
              url: `${SITE_URL}/blog/${post.slug}`,
            }),
          ),
        }}
      />
    </Container>
  );
}
