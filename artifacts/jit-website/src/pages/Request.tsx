import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSubmitRequest } from "@workspace/api-client-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { productCategoryOptions } from "@/lib/siteContent";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const requestSchema = z.object({
  contactPerson: z.string().min(1, "Name is required"),
  companyName: z.string().min(1, "Company name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone or WhatsApp is required"),
  country: z.string().min(1, "Country is required"),
  productName: z.string().min(1, "Product or service is required"),
  productCategory: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Please describe your requirements"),
  quantity: z.string().min(1, "Quantity is required"),
  preferredDeliveryCountry: z.string().min(1, "Delivery location is required"),
  requiredDeliveryDate: z.string().optional(),
  expectedBudget: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type FormValues = z.infer<typeof requestSchema>;

export default function Request() {
  const [step, setStep] = useState(1);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const submitMutation = useSubmitRequest();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachmentFileName, setAttachmentFileName] = useState<string | null>(null);
  const [attachmentData, setAttachmentData] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      country: "",
      productName: "",
      productCategory: "",
      description: "",
      quantity: "",
      expectedBudget: "",
      preferredDeliveryCountry: "",
      requiredDeliveryDate: "",
      additionalNotes: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setAttachmentFileName(null);
      setAttachmentData(null);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "File too large", description: "Maximum file size is 5 MB.", variant: "destructive" });
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAttachmentFileName(file.name);
      setAttachmentData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (values: FormValues) => {
    submitMutation.mutate(
      {
        data: {
          ...values,
          expectedBudget: values.expectedBudget?.trim() || "Not specified",
          requiredDeliveryDate: values.requiredDeliveryDate?.trim() || null,
          additionalNotes: values.additionalNotes?.trim() || null,
          attachmentFileName: attachmentFileName ?? null,
          attachmentData: attachmentData ?? null,
        },
      },
      {
        onSuccess: (data) => setRequestId(data.requestId),
        onError: (error) => {
          const message =
            error instanceof Error && error.message
              ? error.message
              : "Failed to submit request. Please try again or call us directly.";
          toast({ title: "Error", description: message, variant: "destructive" });
        },
      }
    );
  };

  if (requestId) {
    return (
      <SiteLayout>
        <div className="max-w-md mx-auto px-6 py-24 text-center">
          <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">Quote Request Submitted</h2>
          <p className="text-muted-foreground mb-6">
            Your request ID is <strong>{requestId}</strong>. We will source suppliers and respond shortly.
          </p>
          <Button onClick={() => setLocation("/")} className="w-full bg-primary hover:bg-primary/90">
            Return Home
          </Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHeader
        title="Request a Procurement Quote"
        subtitle="Tell us what you need — product or service, quantity, delivery location, and deadline. Our team will source and compare suppliers for you."
        showQuoteCta={false}
      />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 md:p-8">
          <p className="text-muted-foreground mb-6">Step {step} of 4</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <FormField control={form.control} name="contactPerson" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="companyName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid md:grid-cols-2 gap-4">
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
                  <Button type="button" className="w-full bg-primary hover:bg-primary/90 mt-4" onClick={() => setStep(2)}>
                    Next Step
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <FormField control={form.control} name="productName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product or Service Needed</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="productCategory" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {productCategoryOptions.map((cat) => (
                            <SelectItem key={cat} value={cat.toLowerCase().replace(/\s+/g, "_")}>{cat}</SelectItem>
                          ))}
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="quantity" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl><Input placeholder="e.g. 500 units, 10 sets..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detailed Requirements</FormLabel>
                      <FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" className="w-full" onClick={() => setStep(1)}>Back</Button>
                    <Button type="button" className="w-full bg-primary hover:bg-primary/90" onClick={() => setStep(3)}>Next Step</Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <FormField control={form.control} name="preferredDeliveryCountry" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Location</FormLabel>
                      <FormControl><Input placeholder="City, country, or full address" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="requiredDeliveryDate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deadline (Optional)</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="expectedBudget" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Budget (Optional)</FormLabel>
                      <FormControl><Input placeholder="e.g. USD 10,000" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="additionalNotes" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl><Textarea className="min-h-[80px]" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="space-y-2">
                    <label htmlFor="attachment" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Upload Document (Optional)
                    </label>
                    <Input
                      id="attachment"
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                    />
                    <p className="text-sm text-muted-foreground">Spec sheets, RFQs, or tender documents — max 5 MB.</p>
                    {attachmentFileName && <p className="text-sm text-muted-foreground">Selected: {attachmentFileName}</p>}
                  </div>
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" className="w-full" onClick={() => setStep(2)}>Back</Button>
                    <Button type="button" className="w-full bg-primary hover:bg-primary/90" onClick={() => setStep(4)}>Review</Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="bg-muted/50 p-6 rounded-lg space-y-3 text-sm">
                    <p><span className="text-muted-foreground">Name:</span> {form.getValues("contactPerson")}</p>
                    <p><span className="text-muted-foreground">Company:</span> {form.getValues("companyName")}</p>
                    <p><span className="text-muted-foreground">Product/Service:</span> {form.getValues("productName")}</p>
                    <p><span className="text-muted-foreground">Quantity:</span> {form.getValues("quantity")}</p>
                    <p><span className="text-muted-foreground">Delivery:</span> {form.getValues("preferredDeliveryCountry")}</p>
                    {attachmentFileName && <p><span className="text-muted-foreground">Attachment:</span> {attachmentFileName}</p>}
                  </div>
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" className="w-full" onClick={() => setStep(3)}>Edit</Button>
                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white font-semibold" disabled={submitMutation.isPending}>
                      {submitMutation.isPending ? "Submitting..." : "Submit Procurement Quote Request"}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </div>
      </div>
    </SiteLayout>
  );
}
