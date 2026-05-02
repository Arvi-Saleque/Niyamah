import type { SQL } from "drizzle-orm";
import { and, asc, desc, eq, ilike, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  products,
  productImages,
  productVariants,
  inventory,
  variantOptionTypes,
  variantOptionValues,
  productVariantOptions,
} from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import { toSlug, uniqueSlug } from "@/lib/utils/slug";
import type {
  ProductCreateInput,
  ProductUpdateInput,
  ListQueryInput,
} from "@/lib/validations/catalog";

function pickOrderBy(sort: ListQueryInput["sort"]) {
  switch (sort) {
    case "oldest":
      return asc(products.createdAt);
    case "price-asc":
      return asc(products.price);
    case "price-desc":
      return desc(products.price);
    case "name-asc":
      return asc(products.name);
    case "name-desc":
      return desc(products.name);
    case "newest":
    default:
      return desc(products.createdAt);
  }
}

export const productRepository = {
  async list(query: Partial<ListQueryInput> = {}) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: SQL[] = [eq(products.storeId, DEFAULT_STORE_ID)];

    if (query.q) where.push(ilike(products.name, `%${query.q}%`));
    if (query.categoryId) where.push(eq(products.categoryId, query.categoryId));
    if (query.brandId) where.push(eq(products.brandId, query.brandId));
    if (query.status) where.push(eq(products.status, query.status));
    if (query.featured !== undefined)
      where.push(eq(products.featured, query.featured));

    const orderBy = pickOrderBy(query.sort ?? "newest");

    const [rows, countRows] = await Promise.all([
      db
        .select()
        .from(products)
        .where(and(...where))
        .orderBy(orderBy)
        .limit(limit)
        .offset((page - 1) * limit),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(products)
        .where(and(...where)),
    ]);

    return { items: rows, total: countRows[0]?.count ?? 0, page, limit };
  },

  async findById(id: number) {
    const product = await db.query.products.findFirst({
      where: and(eq(products.storeId, DEFAULT_STORE_ID), eq(products.id, id)),
    });
    if (!product) return null;
    const images = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, product.id))
      .orderBy(asc(productImages.sortOrder));
    const variants = await db
      .select({
        id: productVariants.id,
        productId: productVariants.productId,
        sku: productVariants.sku,
        barcode: productVariants.barcode,
        priceOverride: productVariants.priceOverride,
        salePriceOverride: productVariants.salePriceOverride,
        imageUrl: productVariants.imageUrl,
        status: productVariants.status,
        sortOrder: productVariants.sortOrder,
        stockAvailable: inventory.stockAvailable,
        trackStock: inventory.trackStock,
      })
      .from(productVariants)
      .leftJoin(inventory, eq(inventory.variantId, productVariants.id))
      .where(eq(productVariants.productId, product.id))
      .orderBy(asc(productVariants.sortOrder));
    return { ...product, images, variants };
  },

  async findBySlug(slug: string) {
    const product = await db.query.products.findFirst({
      where: and(
        eq(products.storeId, DEFAULT_STORE_ID),
        eq(products.slug, slug),
      ),
    });
    if (!product) return null;
    return this.findById(product.id);
  },

  async existsBySlug(slug: string, excludeId?: number) {
    const row = await db.query.products.findFirst({
      where: and(
        eq(products.storeId, DEFAULT_STORE_ID),
        eq(products.slug, slug),
      ),
      columns: { id: true },
    });
    if (!row) return false;
    if (excludeId && row.id === excludeId) return false;
    return true;
  },

  async create(input: ProductCreateInput) {
    const baseSlug = input.slug ? toSlug(input.slug) : toSlug(input.name);
    const slug = await uniqueSlug(baseSlug, (s) => this.existsBySlug(s));

    return db.transaction(async (tx) => {
      const [product] = await tx
        .insert(products)
        .values({
          storeId: DEFAULT_STORE_ID,
          name: input.name,
          slug,
          categoryId: input.categoryId ?? null,
          brandId: input.brandId ?? null,
          shortDescription: input.shortDescription ?? null,
          description: input.description ?? null,
          price: input.price.toString(),
          salePrice: input.salePrice != null ? input.salePrice.toString() : null,
          costPrice: input.costPrice != null ? input.costPrice.toString() : null,
          sku: input.sku ?? null,
          barcode: input.barcode ?? null,
          weight: input.weight != null ? input.weight.toString() : null,
          status: input.status,
          featured: input.featured ?? false,
          bestSeller: input.bestSeller ?? false,
          seoTitle: input.seoTitle ?? null,
          seoDescription: input.seoDescription ?? null,
          ogImage: input.ogImage ?? null,
          tags: input.tags ?? null,
        })
        .returning();
      if (!product) throw new Error("Product insert failed.");

      // Images
      if (input.images?.length) {
        await tx.insert(productImages).values(
          input.images.map((img) => ({
            productId: product.id,
            url: img.url,
            alt: img.alt ?? null,
            sortOrder: img.sortOrder ?? 0,
            isPrimary: img.isPrimary ?? false,
          })),
        );
      }

      // Variants
      const variantInputs = input.variants?.length
        ? input.variants
        : [
            {
              sku: input.sku ?? null,
              priceOverride: null,
              salePriceOverride: null,
              imageUrl: null,
              status: true,
              sortOrder: 0,
              options: [],
              initialStock: input.initialStock ?? 0,
            },
          ];

      for (const v of variantInputs) {
        const [variant] = await tx
          .insert(productVariants)
          .values({
            productId: product.id,
            sku: v.sku ?? null,
            barcode: v.barcode ?? null,
            priceOverride:
              v.priceOverride != null ? v.priceOverride.toString() : null,
            salePriceOverride:
              v.salePriceOverride != null
                ? v.salePriceOverride.toString()
                : null,
            imageUrl: v.imageUrl ?? null,
            status: v.status ?? true,
            sortOrder: v.sortOrder ?? 0,
          })
          .returning();
        if (!variant) throw new Error("Product variant insert failed.");

        // Options (type/value)
        if (v.options?.length) {
          for (const opt of v.options) {
            // Find or insert option type for this product
            let [type] = await tx
              .select()
              .from(variantOptionTypes)
              .where(
                and(
                  eq(variantOptionTypes.productId, product.id),
                  eq(variantOptionTypes.name, opt.type),
                ),
              );
            if (!type) {
              [type] = await tx
                .insert(variantOptionTypes)
                .values({ productId: product.id, name: opt.type })
                .returning();
            }
            if (!type) throw new Error("Variant option type insert failed.");
            // Find or insert value
            let [value] = await tx
              .select()
              .from(variantOptionValues)
              .where(
                and(
                  eq(variantOptionValues.optionTypeId, type.id),
                  eq(variantOptionValues.value, opt.value),
                ),
              );
            if (!value) {
              [value] = await tx
                .insert(variantOptionValues)
                .values({ optionTypeId: type.id, value: opt.value })
                .returning();
            }
            if (!value) throw new Error("Variant option value insert failed.");
            await tx
              .insert(productVariantOptions)
              .values({ variantId: variant.id, optionValueId: value.id });
          }
        }

        // Inventory row
        const stock = v.initialStock ?? 0;
        await tx.insert(inventory).values({
          storeId: DEFAULT_STORE_ID,
          variantId: variant.id,
          stockOnHand: stock,
          stockReserved: 0,
          stockAvailable: stock,
        });
      }

      return product;
    });
  },

  async update(id: number, input: ProductUpdateInput) {
    let slug: string | undefined;
    if (input.slug) {
      const baseSlug = toSlug(input.slug);
      slug = await uniqueSlug(baseSlug, (s) => this.existsBySlug(s, id));
    }

    const [row] = await db
      .update(products)
      .set({
        ...(input.name !== undefined && { name: input.name }),
        ...(slug !== undefined && { slug }),
        ...(input.categoryId !== undefined && { categoryId: input.categoryId }),
        ...(input.brandId !== undefined && { brandId: input.brandId }),
        ...(input.shortDescription !== undefined && {
          shortDescription: input.shortDescription,
        }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.price !== undefined && { price: input.price.toString() }),
        ...(input.salePrice !== undefined && {
          salePrice: input.salePrice != null ? input.salePrice.toString() : null,
        }),
        ...(input.costPrice !== undefined && {
          costPrice: input.costPrice != null ? input.costPrice.toString() : null,
        }),
        ...(input.sku !== undefined && { sku: input.sku }),
        ...(input.barcode !== undefined && { barcode: input.barcode }),
        ...(input.weight !== undefined && {
          weight: input.weight != null ? input.weight.toString() : null,
        }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.featured !== undefined && { featured: input.featured }),
        ...(input.bestSeller !== undefined && { bestSeller: input.bestSeller }),
        ...(input.seoTitle !== undefined && { seoTitle: input.seoTitle }),
        ...(input.seoDescription !== undefined && {
          seoDescription: input.seoDescription,
        }),
        ...(input.ogImage !== undefined && { ogImage: input.ogImage }),
        ...(input.tags !== undefined && { tags: input.tags }),
        ...(input.images !== undefined && {}),
        updatedAt: new Date(),
      })
      .where(and(eq(products.storeId, DEFAULT_STORE_ID), eq(products.id, id)))
      .returning();

    if (!row) return null;

    // Replace images if provided
    if (input.images !== undefined) {
      await db.delete(productImages).where(eq(productImages.productId, id));
      if (input.images.length) {
        await db.insert(productImages).values(
          input.images.map((img) => ({
            productId: id,
            url: img.url,
            alt: img.alt ?? null,
            sortOrder: img.sortOrder ?? 0,
            isPrimary: img.isPrimary ?? false,
          })),
        );
      }
    }

    return row;
  },

  async remove(id: number) {
    const result = await db
      .delete(products)
      .where(and(eq(products.storeId, DEFAULT_STORE_ID), eq(products.id, id)))
      .returning({ id: products.id });
    return result.length > 0;
  },
};
