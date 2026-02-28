import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactSection = () => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: data.name,
        email: data.email,
        message: data.message,
      });
      if (error) throw error;
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      form.reset();
    } catch {
      toast({ title: "Something went wrong", description: "Please try again later.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-18 md:py-22 bg-foreground text-background" id="contact">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left - image area */}
          <div className="rounded-2xl overflow-hidden h-[260px] lg:h-[380px] bg-muted/10 shadow-[0_8px_32px_-8px_hsl(0_0%_0%/0.3)]">
            <img
              src="/placeholder.svg"
              alt="DLD resources and community"
              className="w-full h-full object-cover opacity-80"
              loading="lazy"
            />
          </div>

          {/* Right - text + form */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/40 mb-2.5">
              For Organizations
            </p>
            <h2 className="text-[26px] md:text-[32px] font-bold text-background mb-3 leading-[1.1]">
              Bring DLD Resources to Your Organization
            </h2>
            <p className="text-background/50 text-[15px] mb-7 leading-[1.7] max-w-md">
              Whether you're a school, clinic, or organization — we'd love to partner with you to bring DLD awareness and resources to your community.
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-background/60 text-[12px] font-medium">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" className="h-10 rounded-lg bg-background/8 border-background/15 text-background placeholder:text-background/30 focus-visible:ring-background/30 text-[14px]" {...field} />
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
                      <FormLabel className="text-background/60 text-[12px] font-medium">Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" className="h-10 rounded-lg bg-background/8 border-background/15 text-background placeholder:text-background/30 focus-visible:ring-background/30 text-[14px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-background/60 text-[12px] font-medium">Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="How can we help?" className="min-h-[80px] rounded-lg bg-background/8 border-background/15 text-background placeholder:text-background/30 focus-visible:ring-background/30 text-[14px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-[48px] px-8 rounded-lg text-[12px] font-bold uppercase tracking-[0.14em] shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-elevated)] hover:brightness-95 transition-all duration-300"
                >
                  {submitting ? "Sending..." : "Apply Now"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
