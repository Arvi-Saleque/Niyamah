import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/shared/container";
import { Heading, Text } from "@/components/shared/typography";
import { getCurrentUser } from "@/lib/auth/guards";

const links = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/profile", label: "Profile" },
];

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/account");

  return (
    <Container className="py-8">
      <Heading as="h1" size="xl" className="mb-1">
        My Account
      </Heading>
      <Text variant="muted" className="mb-8">
        Welcome back, {user.email}
      </Text>
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block rounded-lg px-3 py-2 text-sm hover:bg-[var(--color-surface-alt)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div>{children}</div>
      </div>
    </Container>
  );
}
