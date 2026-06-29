import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSubmitRequest } from "@workspace/api-client-react";
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

const requestSchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  contactPerson: z.string().min(1, "Contact Person is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  country: z.string().min(1, "Country is required"),
  productName: z.string().min(1, "Product Name is required"),
  productCategory: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description is required"),
  quantity: z.string().min(1, "Quantity is required"),
  expectedBudget: z.string().min(1, "Budget is required"),
  preferredDeliveryCountry: z.string().min(1, "Delivery Country is required"),
  requiredDeliveryDate: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export default function Request() {
  const [step, setStep] = useState(1);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const submitMutation = useSubmitRequest();

  const form = useForm<z.infer<typeof requestSchema>>({
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

  const onSubmit = (values: z.infer<typeof requestSchema>) => {
    submitMutation.mutate(
      { data: values },
      {
        onSuccess: (data) => {
          setRequestId(data.requestId);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to submit request. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (requestId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center border border-border">
          <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">
            Request Submitted
          </h2>
          <p className="text-muted-foreground mb-6">
            Your request ID is <strong>{requestId}</strong>. We'll be in touch
            shortly.
          </p>
          <Button
            onClick={() => setLocation("/")}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-8"
        >
          &larr; Back to Home
        </Button>

        <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">
              Procurement Request
            </h1>
            <p className="text-muted-foreground mt-2">
              Step {step} of 4
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactPerson"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Person</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    className="w-full bg-primary hover:bg-primary/90 mt-6"
                    onClick={() => setStep(2)}
                  >
                    Next Step
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <FormField
                    control={form.control}
                    name="productName"
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
                    name="productCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="manufacturing">
                              Manufacturing
                            </SelectItem>
                            <SelectItem value="technology">
                              Technology
                            </SelectItem>
                            <SelectItem value="healthcare">
                              Healthcare
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity Required</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>Detailed Description</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-[100px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-4 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => setStep(3)}
                    >
                      Next Step
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <FormField
                    control={form.control}
                    name="expectedBudget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Budget</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preferredDeliveryCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Delivery Country</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="requiredDeliveryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Delivery Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-[100px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-4 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setStep(2)}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => setStep(4)}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="bg-muted/50 p-6 rounded-lg space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-4 border-b border-border pb-4">
                      <div>
                        <span className="text-muted-foreground block">Company</span>
                        <span className="font-medium">{form.getValues("companyName")}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Contact</span>
                        <span className="font-medium">{form.getValues("contactPerson")}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-b border-border pb-4">
                      <div>
                        <span className="text-muted-foreground block">Product</span>
                        <span className="font-medium">{form.getValues("productName")}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Quantity</span>
                        <span className="font-medium">{form.getValues("quantity")}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Description</span>
                      <span className="font-medium text-foreground">{form.getValues("description")}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setStep(3)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="submit"
                      className="w-full bg-accent hover:bg-accent/90 text-white"
                      disabled={submitMutation.isPending}
                    >
                      {submitMutation.isPending ? "Submitting..." : "Submit Request"}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
