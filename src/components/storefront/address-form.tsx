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
import { cn } from "@/lib/utils";

export const addressSchema = z.object({
  name: z.string().min(2, "Full name required"),
  phone: z.string().min(11, "Enter a valid phone number"),
  addressLine1: z.string().min(5, "Address required"),
  addressLine2: z.string().optional(),
  district: z.string().min(2, "District required"),
  city: z.string().min(2, "City required"),
  postalCode: z.string().min(4, "Postal code required"),
  note: z.string().optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  defaultValues?: Partial<AddressFormValues>;
  onSubmit: (values: AddressFormValues) => void | Promise<void>;
  submitLabel?: string;
  className?: string;
}

/** Shipping address collection form used during checkout. */
export function AddressForm({
  defaultValues,
  onSubmit,
  submitLabel = "Continue",
  className,
}: AddressFormProps) {
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4", className)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl><Input placeholder="Rahim Uddin" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl><Input placeholder="01XXXXXXXXX" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="addressLine1" render={({ field }) => (
          <FormItem>
            <FormLabel>Address Line 1</FormLabel>
            <FormControl><Input placeholder="House / Road / Area" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="addressLine2" render={({ field }) => (
          <FormItem>
            <FormLabel>Address Line 2 <span className="text-[var(--color-text-muted)] font-normal">(optional)</span></FormLabel>
            <FormControl><Input placeholder="Apartment, suite, etc." {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField control={form.control} name="district" render={({ field }) => (
            <FormItem>
              <FormLabel>District</FormLabel>
              <FormControl><Input placeholder="Dhaka" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="city" render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl><Input placeholder="Mirpur" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="postalCode" render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl><Input placeholder="1216" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="note" render={({ field }) => (
          <FormItem>
            <FormLabel>Order Note <span className="text-[var(--color-text-muted)] font-normal">(optional)</span></FormLabel>
            <FormControl><Textarea placeholder="Any special instructions…" rows={2} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)]"
        >
          {form.formState.isSubmitting ? "Saving…" : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
