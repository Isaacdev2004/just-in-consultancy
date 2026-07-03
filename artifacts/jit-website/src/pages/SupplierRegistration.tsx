import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import SiteLayout from "@/components/SiteLayout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { submitSupplierRegistration } from "@/lib/api";

const schema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  country: z.string().min(1, "Country is required"),
  productCategories: z.string().min(5, "List your product categories"),
  pricingInfo: z.string().optional(),
  certifications: z.string().optional(),
  companyDescription: z.string().min(10, "Please describe your company"),
});

export default function SupplierRegistration() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      country: "",
      productCategories: "",
      pricingInfo: "",
      certifications: "",
      companyDescription: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setLoading(true);
    try {
      await submitSupplierRegistration(values);
      setSubmitted(true);
      toast({ title: "Application Submitted", description: "Our team will review your supplier profile." });
    } catch {
      toast({ title: "Error", description: "Failed to submit. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <SiteLayout>
        <div className="max-w-md mx-auto px-6 py-24 text-center">
          <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">Thank You</h2>
          <p className="text-muted-foreground">
            Your supplier application has been received. Our procurement team will contact you after review.
          </p>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHeader
        title="Become a Supplier Partner"
        subtitle="Register your company to join our verified supplier network. Submit your product categories, pricing, and certifications for review."
        showQuoteCta={false}
      />

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <FormField control={form.control} name="companyName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="contactPerson" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone / WhatsApp</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="country" render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="productCategories" render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Categories</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g. Industrial equipment, safety gear, office supplies..." className="min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="pricingInfo" render={({ field }) => (
                <FormItem>
                  <FormLabel>Pricing Information (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Price ranges, MOQ, payment terms..." className="min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="certifications" render={({ field }) => (
                <FormItem>
                  <FormLabel>Certifications (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="ISO, FDA, CE, trade licenses..." className="min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="companyDescription" render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us about your company, capacity, and export experience..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6" disabled={loading}>
                {loading ? "Submitting..." : "Submit Supplier Application"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </SiteLayout>
  );
}
