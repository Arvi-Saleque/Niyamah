import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Heading, Text } from "@/components/shared/typography";
import { blogRepository } from "@/modules/blog/infrastructure/blog.repository";

export const revalidate = 300;

export default async function BlogIndexPage() {
  const posts = await blogRepository.listPosts({ status: "published", limit: 24 });

  return (
    <Container className="py-10">
      <Heading as="h1" size="2xl" className="mb-2">
        Journal
      </Heading>
      <Text variant="muted" className="mb-8">
        Stories, guides, and craftsmanship behind Niyamah.
      </Text>

      {posts.length === 0 ? (
        <Text variant="muted">No posts yet.</Text>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white transition hover:shadow-lg"
            >
              {post.featuredImage && (
                <div
                  className="aspect-video bg-cover bg-center"
                  style={{ backgroundImage: `url(${post.featuredImage})` }}
                />
              )}
              <div className="p-5">
                <h3 className="mb-2 text-lg font-semibold group-hover:text-[var(--color-accent)]">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="line-clamp-3 text-sm text-[var(--color-text-secondary)]">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
