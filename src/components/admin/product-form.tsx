"use client";

import { useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const productFormSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  sku: z.string().min(1),
  price: z.coerce.number().positive(),
  salePrice: z.coerce.number().optional(),
  stock: z.coerce.number().int().min(0),
  shortDescription: z.string().max(300).optional(),
  description: z.string().optional(),
  isPublished: z.boolean().default(false),
});

type ProductFormInput = z.input<typeof productFormSchema>;
export type ProductFormValues = z.output<typeof productFormSchema>;

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues> | undefined;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  onPriceChange?: (price: number) => void;
  className?: string;
}

function NumericFieldInput({
  field: { name, value, onChange, onBlur, ref },
  min = 0,
  step,
}: {
  field: {
    name: string;
    value: unknown;
    onChange: (...event: unknown[]) => void;
    onBlur: () => void;
    ref: (instance: HTMLInputElement | null) => void;
  };
  min?: number;
  step?: number;
}) {
  return (
    <Input
      type="number"
      min={min}
      step={step}
      name={name}
      value={String(value ?? "")}
      onChange={onChange}
      onBlur={onBlur}
      ref={ref}
    />
  );
}

/** Admin create/edit product form - basic fields only. Image upload handled separately. */
export function ProductForm({ defaultValues, onSubmit, onPriceChange, className }: ProductFormProps) {
  const form = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: { isPublished: false, ...defaultValues },
  });

  const priceValue = useWatch({ control: form.control, name: "price" });
  useEffect(() => {
    if (onPriceChange) onPriceChange(Number(priceValue) || 0);
  }, [priceValue, onPriceChange]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-5", className)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <NumericFieldInput field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (BDT)</FormLabel>
                <FormControl>
                  <NumericFieldInput field={field} step={0.01} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Sale Price (BDT){" "}
                  <span className="font-normal text-[var(--color-text-muted)]">optional</span>
                </FormLabel>
                <FormControl>
                  <NumericFieldInput field={field} step={0.01} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Description</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormControl>
                <Switch checked={!!field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="!mt-0">Published</FormLabel>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]"
        >
          {form.formState.isSubmitting ? "Saving..." : "Save Product"}
        </Button>
      </form>
    </Form>
  );
}
