"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const settingsFormSchema = z.object({
  storeName: z.string().min(2),
  storeEmail: z.string().email(),
  storePhone: z.string().min(10),
  storeAddress: z.string().min(5),
  currency: z.string().default("BDT"),
  freeShippingThreshold: z.coerce.number().min(0),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

interface SettingsFormProps {
  defaultValues?: Partial<SettingsFormValues> | undefined;
  onSubmit: (values: SettingsFormValues) => Promise<void>;
  className?: string;
}

/** Admin general settings form — store info + SEO defaults. */
export function SettingsForm({ defaultValues, onSubmit, className }: SettingsFormProps) {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: { currency: "BDT", freeShippingThreshold: 2000, ...defaultValues },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-6", className)}>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">Store Info</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="storeName" render={({ field }) => (
              <FormItem><FormLabel>Store Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="storeEmail" render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="storePhone" render={({ field }) => (
              <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="freeShippingThreshold" render={({ field }) => (
              <FormItem><FormLabel>Free Shipping Threshold (৳)</FormLabel><FormControl><Input type="number" min={0} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="storeAddress" render={({ field }) => (
              <FormItem className="sm:col-span-2"><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        </div>

        <Separator />

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">SEO Defaults</p>
          <div className="grid gap-4">
            <FormField control={form.control} name="metaTitle" render={({ field }) => (
              <FormItem><FormLabel>Meta Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="metaDescription" render={({ field }) => (
              <FormItem><FormLabel>Meta Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting} className="bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]">
          {form.formState.isSubmitting ? "Saving…" : "Save Settings"}
        </Button>
      </form>
    </Form>
  );
}
