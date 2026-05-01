import slugify from "slugify";

/**
 * Convert any string into a URL-safe lowercase slug.
 * - strips special characters
 * - replaces whitespace with `-`
 * - locks output to ASCII alphanumeric + dash
 */
export function toSlug(input: string): string {
  return slugify(input, {
    lower: true,
    strict: true,
    trim: true,
    locale: "en",
  });
}

/**
 * Generate a unique slug by appending a numeric suffix when needed.
 * `existsCheck` should return true if the slug already exists.
 */
export async function uniqueSlug(
  base: string,
  existsCheck: (candidate: string) => Promise<boolean>,
): Promise<string> {
  const slug = toSlug(base);
  let candidate = slug;
  let n = 2;
  // eslint-disable-next-line no-await-in-loop
  while (await existsCheck(candidate)) {
    candidate = `${slug}-${n}`;
    n += 1;
    if (n > 1000) throw new Error("Could not generate unique slug.");
  }
  return candidate;
}
