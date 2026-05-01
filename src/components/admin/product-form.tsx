"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
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

export type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  className?: string;
}

/** Admin create/edit product form — basic fields only. Image upload handled separately. */
export function ProductForm({ defaultValues, onSubmit, className }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: { isPublished: false, ...defaultValues },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-5", className)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Product Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="slug" render={({ field }) => (
            <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="sku" render={({ field }) => (
            <FormItem><FormLabel>SKU</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="stock" render={({ field }) => (
            <FormItem><FormLabel>Stock</FormLabel><FormControl><Input type="number" min={0} {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="price" render={({ field }) => (
            <FormItem><FormLabel>Price (৳)</FormLabel><FormControl><Input type="number" min={0} step={0.01} {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="salePrice" render={({ field }) => (
            <FormItem><FormLabel>Sale Price (৳) <span className="text-[var(--color-text-muted)] font-normal">optional</span></FormLabel><FormControl><Input type="number" min={0} step={0.01} {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        <FormField control={form.control} name="shortDescription" render={({ field }) => (
          <FormItem><FormLabel>Short Description</FormLabel><FormControl><Textarea rows={2} {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem><FormLabel>Full Description</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
        )} />

        <FormField control={form.control} name="isPublished" render={({ field }) => (
          <FormItem className="flex items-center gap-3">
            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            <FormLabel className="!mt-0">Published</FormLabel>
          </FormItem>
        )} />

        <Button type="submit" disabled={form.formState.isSubmitting} className="bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]">
          {form.formState.isSubmitting ? "Saving…" : "Save Product"}
        </Button>
      </form>
    </Form>
  );
}
