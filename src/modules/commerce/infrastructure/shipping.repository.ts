import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { shippingZones, shippingRates } from "@/lib/db/schema";
import { DEFAULT_STORE_ID } from "@/lib/constants/store";
import type {
  ShippingZoneCreateInput,
  ShippingRateCreateInput,
} from "@/lib/validations/commerce";

export const shippingRepository = {
  async listZones() {
    return db
      .select()
      .from(shippingZones)
      .where(eq(shippingZones.storeId, DEFAULT_STORE_ID));
  },

  async createZone(input: ShippingZoneCreateInput) {
    const [row] = await db
      .insert(shippingZones)
      .values({
        storeId: DEFAULT_STORE_ID,
        name: input.name,
        districts: input.districts,
        deliveryDaysMin: input.deliveryDaysMin,
        deliveryDaysMax: input.deliveryDaysMax,
      })
      .returning();
    return row;
  },

  async listRates(zoneId?: number) {
    if (zoneId) {
      return db
        .select()
        .from(shippingRates)
        .where(eq(shippingRates.zoneId, zoneId));
    }
    return db.select().from(shippingRates);
  },

  async createRate(input: ShippingRateCreateInput) {
    const [row] = await db
      .insert(shippingRates)
      .values({
        zoneId: input.zoneId,
        name: input.name,
        price: input.price.toString(),
        freeAboveAmount:
          input.freeAboveAmount != null ? input.freeAboveAmount.toString() : null,
      })
      .returning();
    return row;
  },

  async findRate(rateId: number) {
    const row = await db.query.shippingRates.findFirst({
      where: eq(shippingRates.id, rateId),
    });
    return row ?? null;
  },

  /** Find the shipping zone that contains the given district. */
  async findZoneForDistrict(district: string) {
    const rows = await db
      .select()
      .from(shippingZones)
      .where(
        and(
          eq(shippingZones.storeId, DEFAULT_STORE_ID),
          sql`${district} = ANY(${shippingZones.districts})`,
        ),
      );
    return rows[0] ?? null;
  },

  /**
   * Compute shipping price given a chosen rate and order subtotal.
   * Honors `freeAboveAmount` threshold.
   */
  computePrice(rate: { price: string; freeAboveAmount: string | null }, subtotal: number) {
    if (rate.freeAboveAmount && subtotal >= Number(rate.freeAboveAmount)) {
      return 0;
    }
    return Number(rate.price);
  },
};
