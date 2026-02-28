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
    <section className="py-20 md:py-28 bg-foreground text-background" id="contact">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left - image area */}
          <div className="rounded-2xl overflow-hidden h-[280px] lg:h-[400px] bg-muted/10">
            <img
              src="/placeholder.svg"
              alt="DLD resources and community"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Right - text + form */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground/60 mb-3">
              For Organizations
            </p>
            <h2 className="text-[28px] md:text-[34px] font-semibold text-background mb-4 leading-tight">
              Bring DLD Resources to Your Organization
            </h2>
            <p className="text-background/60 text-base mb-8 leading-[1.7]">
              Have a question or want to learn more? We'd love to hear from you.
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-background/80">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" className="h-11 rounded-lg bg-background/10 border-background/20 text-background placeholder:text-background/40 focus-visible:ring-background/40" {...field} />
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
                      <FormLabel className="text-background/80">Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" className="h-11 rounded-lg bg-background/10 border-background/20 text-background placeholder:text-background/40 focus-visible:ring-background/40" {...field} />
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
                      <FormLabel className="text-background/80">Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="How can we help?" className="min-h-[100px] rounded-lg bg-background/10 border-background/20 text-background placeholder:text-background/40 focus-visible:ring-background/40" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={submitting}
                  variant="destructive"
                  className="h-11 px-8 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:brightness-95 transition-all"
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
