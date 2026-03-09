import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import workshopBg from "@/assets/workshop-bg.png";

const contactSchema = z.object({
  fullName: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  organization: z.string().trim().min(1, "Organization name is required").max(200),
  role: z.string().min(1, "Please select your role"),
  interests: z.array(z.string()).min(1, "Select at least one option"),
  timeline: z.string().trim().max(200).optional().or(z.literal("")),
  goals: z.string().trim().min(10, "Please tell us more about your goals (min 10 characters)").max(2000),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const inputClass =
  "h-11 rounded-none border-0 border-b border-foreground/20 bg-transparent px-0 text-[14px] text-foreground placeholder:text-foreground/40 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-foreground/60";

const labelClass = "text-[11px] font-bold uppercase tracking-[0.12em] text-foreground/70";

const ROLE_OPTIONS = [
  "School Principal/Administrator",
  "SLP Manager/Director",
  "Parent Group Leader",
  "Conference Organizer",
  "Other",
];

const INTEREST_OPTIONS = [
  "Speaking Engagement",
  "Custom Workshop",
  "Consultation Services",
  "Not sure yet - let's discuss",
];

const ContactSection = () => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      organization: "",
      role: "",
      interests: [],
      timeline: "",
      goals: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        first_name: data.fullName,
        email: data.email,
        company_name: data.organization,
        role: data.role,
        interested_in: data.interests,
        preferred_timeline: data.timeline || null,
        questions: data.goals,
      });
      if (error) throw error;
      toast({ title: "Inquiry sent!", description: "We'll get back to you within 48 hours." });
      form.reset();
    } catch {
      toast({ title: "Something went wrong", description: "Please try again later.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-[520px]" id="contact">
      <div className="absolute inset-0">
        <img src={workshopBg} alt="" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-[hsl(258_55%_18%/0.82)]" />
      </div>

      <div className="relative z-10 container py-12 md:py-20 px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Right text */}
          <div className="flex flex-col justify-center lg:pt-8 order-1 lg:order-2">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-background/60 mb-4">
              Partner With Us
            </p>
            <h2 className="text-[28px] md:text-[36px] lg:text-[52px] font-bold text-background leading-[1.08] mb-5">
              Bring DLD Resources to Your Organization
            </h2>
            <p className="text-background/70 text-[15px] leading-[1.7] max-w-[480px]">
              Ready to bring DLD support to your community? From one-time workshops to ongoing training, we'll help you find the right approach for your organization. Reach out to explore what's possible.
            </p>
          </div>

          {/* Left – white form card */}
          <div className="bg-background rounded-none p-6 md:p-10 lg:p-12 order-2 lg:order-1 max-w-[640px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Your Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Your Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" className={inputClass} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email + Organization row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" className={inputClass} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="organization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Organization Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Organization name" className={inputClass} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* I am a: dropdown */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>I am a: *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={inputClass + " cursor-pointer"}>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ROLE_OPTIONS.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* I'm interested in: checkboxes */}
                <FormField
                  control={form.control}
                  name="interests"
                  render={() => (
                    <FormItem>
                      <FormLabel className={labelClass}>I'm interested in: *</FormLabel>
                      <div className="space-y-3 pt-1">
                        {INTEREST_OPTIONS.map((option) => (
                          <FormField
                            key={option}
                            control={form.control}
                            name="interests"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      field.onChange(
                                        checked
                                          ? [...current, option]
                                          : current.filter((v) => v !== option)
                                      );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-[13px] font-normal text-foreground cursor-pointer">
                                  {option}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Preferred Timeline */}
                <FormField
                  control={form.control}
                  name="timeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Preferred Date(s) or Timeline</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Spring 2026, March 15th" className={inputClass} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Goals textarea */}
                <FormField
                  control={form.control}
                  name="goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Tell us about your goals and audience *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What are you hoping to achieve? Who is your audience?"
                          className="min-h-[100px] rounded-none border border-foreground/20 bg-transparent px-3 py-2.5 text-[14px] text-foreground placeholder:text-foreground/40 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-foreground/60"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="h-[48px] px-8 rounded-none bg-[hsl(258_55%_25%)] hover:bg-[hsl(258_55%_20%)] text-background text-[12px] font-bold uppercase tracking-[0.14em] transition-all duration-300"
                  >
                    {submitting ? "Sending..." : "Send Inquiry"}
                  </Button>
                  <p className="text-[12px] text-foreground/50">
                    We'll respond within 48 hours to schedule a discovery call.
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
