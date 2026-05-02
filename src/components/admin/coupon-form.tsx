"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const couponFormSchema = z.object({
  code: z.string().min(3).max(20),
  type: z.enum(["percentage", "fixed"]),
  value: z.coerce.number().positive(),
  minOrderAmount: z.coerce.number().min(0).optional(),
  maxUsage: z.coerce.number().int().positive().optional(),
  expiresAt: z.string().optional(),
  isActive: z.boolean().default(true),
});

type CouponFormInput = z.input<typeof couponFormSchema>;
export type CouponFormValues = z.output<typeof couponFormSchema>;

interface CouponFormProps {
  defaultValues?: Partial<CouponFormValues> | undefined;
  onSubmit: (values: CouponFormValues) => Promise<void>;
  className?: string;
}

function NumberInput({
  field,
  min = 0,
}: {
  field: {
    name: string;
    value: unknown;
    onChange: (...event: unknown[]) => void;
    onBlur: () => void;
    ref: (instance: HTMLInputElement | null) => void;
  };
  min?: number;
}) {
  return (
    <Input
      type="number"
      min={min}
      name={field.name}
      value={String(field.value ?? "")}
      onChange={field.onChange}
      onBlur={field.onBlur}
      ref={field.ref}
    />
  );
}

/** Admin create/edit coupon form. */
export function CouponForm({ defaultValues, onSubmit, className }: CouponFormProps) {
  const form = useForm<CouponFormInput, unknown, CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: { type: "percentage", isActive: true, ...defaultValues },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-5", className)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coupon Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="SAVE20"
                    className="uppercase"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Type</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed amount (BDT)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Value</FormLabel>
                <FormControl>
                  <NumberInput field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minOrderAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Min Order (BDT){" "}
                  <span className="font-normal text-[var(--color-text-muted)]">optional</span>
                </FormLabel>
                <FormControl>
                  <NumberInput field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxUsage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Max Usage{" "}
                  <span className="font-normal text-[var(--color-text-muted)]">optional</span>
                </FormLabel>
                <FormControl>
                  <NumberInput field={field} min={1} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expiresAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Expires At{" "}
                  <span className="font-normal text-[var(--color-text-muted)]">optional</span>
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormControl>
                <Switch checked={!!field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="!mt-0">Active</FormLabel>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]"
        >
          {form.formState.isSubmitting ? "Saving..." : "Save Coupon"}
        </Button>
      </form>
    </Form>
  );
}
