import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { addresses } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import type {
  AddressCreateInput,
  AddressUpdateInput,
} from "@/lib/validations/commerce";

export const addressRepository = {
  async listForUser(userId: string) {
    return db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, userId))
      .orderBy(asc(addresses.id));
  },

  async findForUser(id: number, userId: string) {
    const row = await db.query.addresses.findFirst({
      where: and(eq(addresses.id, id), eq(addresses.userId, userId)),
    });
    return row ?? null;
  },

  async create(userId: string, input: AddressCreateInput) {
    if (input.isDefault) {
      await db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, userId));
    }
    const [row] = await db
      .insert(addresses)
      .values({
        userId,
        storeId: DEFAULT_STORE_ID,
        label: input.label ?? null,
        name: input.name,
        phone: input.phone,
        addressLine1: input.addressLine1,
        addressLine2: input.addressLine2 ?? null,
        district: input.district,
        area: input.area ?? null,
        city: input.city ?? null,
        postalCode: input.postalCode ?? null,
        isDefault: input.isDefault ?? false,
      })
      .returning();
    return row;
  },

  async update(id: number, userId: string, input: AddressUpdateInput) {
    if (input.isDefault) {
      await db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, userId));
    }
    const [row] = await db
      .update(addresses)
      .set({
        ...(input.label !== undefined && { label: input.label }),
        ...(input.name !== undefined && { name: input.name }),
        ...(input.phone !== undefined && { phone: input.phone }),
        ...(input.addressLine1 !== undefined && {
          addressLine1: input.addressLine1,
        }),
        ...(input.addressLine2 !== undefined && {
          addressLine2: input.addressLine2,
        }),
        ...(input.district !== undefined && { district: input.district }),
        ...(input.area !== undefined && { area: input.area }),
        ...(input.city !== undefined && { city: input.city }),
        ...(input.postalCode !== undefined && { postalCode: input.postalCode }),
        ...(input.isDefault !== undefined && { isDefault: input.isDefault }),
      })
      .where(and(eq(addresses.id, id), eq(addresses.userId, userId)))
      .returning();
    return row ?? null;
  },

  async remove(id: number, userId: string) {
    const result = await db
      .delete(addresses)
      .where(and(eq(addresses.id, id), eq(addresses.userId, userId)))
      .returning({ id: addresses.id });
    return result.length > 0;
  },
};
