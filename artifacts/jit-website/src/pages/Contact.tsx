import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSubmitContact } from "@workspace/api-client-react";
import SiteLayout from "@/components/SiteLayout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { PHONE, PHONE_HREF } from "@/lib/siteContent";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const { toast } = useToast();
  const contactMutation = useSubmitContact();

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  const onSubmit = (values: z.infer<typeof contactSchema>) => {
    contactMutation.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast({ title: "Message Sent", description: "We'll get back to you within one business day." });
          form.reset();
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
        },
      }
    );
  };

  return (
    <SiteLayout>
      <PageHeader
        title="Contact Us"
        subtitle="Questions about procurement, sourcing, or supplier partnerships? Our team is ready to help."
      />

      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-10">
          <div className="space-y-5">
            {[
              { label: "Phone", value: PHONE, href: PHONE_HREF },
              { label: "General Inquiries", value: "info@justintimeconsultancy.com", href: "mailto:info@justintimeconsultancy.com" },
              { label: "Support", value: "support@justintimeconsultancy.com", href: "mailto:support@justintimeconsultancy.com" },
              { label: "Business Hours", value: "Mon – Fri: 8:00 AM – 6:00 PM (GMT)" },
            ].map(({ label, value, href }) => (
              <div key={label} className="p-5 rounded-xl bg-card border border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
                {href ? (
                  <a href={href} className="text-sm font-medium hover:text-accent transition-colors">{value}</a>
                ) : (
                  <p className="text-sm font-medium">{value}</p>
                )}
              </div>
            ))}
          </div>
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl><Input type="email" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone / WhatsApp (Optional)</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="subject" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl><Textarea className="min-h-[140px]" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6" disabled={contactMutation.isPending}>
                      {contactMutation.isPending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
