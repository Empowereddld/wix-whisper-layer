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
import workshopBg from "@/assets/workshop-bg.webp";

const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().max(100).optional().or(z.literal("")),
  companyName: z.string().trim().min(1, "Company name is required").max(200),
  email: z.string().trim().email("Please enter a valid email").max(255),
  position: z.string().trim().max(200).optional().or(z.literal("")),
  questions: z.string().trim().min(10, "Please provide more detail (min 10 characters)").max(2000),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const inputClass =
  "h-11 rounded-none border-0 border-b border-foreground/20 bg-transparent px-0 text-[14px] text-foreground placeholder:text-foreground/40 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-foreground/60";

const labelClass = "text-[11px] font-bold uppercase tracking-[0.12em] text-foreground/70";

const ContactSection = () => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      companyName: "",
      email: "",
      position: "",
      questions: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        first_name: data.firstName,
        last_name: data.lastName || null,
        company_name: data.companyName,
        email: data.email,
        position: data.position || null,
        questions: data.questions,
      });
      if (error) throw error;

      // Fire-and-forget confirmation email
      supabase.functions.invoke("send-email", {
        body: {
          to: data.email,
          subject: "We received your message — Empowered DLD",
          html: `<p>Hi ${data.firstName},</p>
                 <p>Thanks for reaching out to Empowered DLD! We've received your message and a member of our team will get back to you within <strong>48 hours</strong>.</p>
                 <p><strong>What you sent us:</strong></p>
                 <blockquote style="border-left:3px solid #5B2D8E;padding:8px 16px;color:#555;background:#F8F5FC;">${data.questions.replace(/</g, "&lt;")}</blockquote>
                 <p>In the meantime, feel free to explore our <a href="https://empowereddld.com/resources" style="color:#5B2D8E;">Resource Hub</a>.</p>`,
        },
      }).catch((e) => console.warn("Confirmation email failed:", e));

      // Internal notification
      supabase.functions.invoke("send-email", {
        body: {
          to: "hello@empowereddld.com",
          subject: `New contact form: ${data.firstName} ${data.lastName || ""} (${data.companyName})`,
          reply_to: data.email,
          html: `<p><strong>From:</strong> ${data.firstName} ${data.lastName || ""} &lt;${data.email}&gt;</p>
                 <p><strong>Company:</strong> ${data.companyName}</p>
                 <p><strong>Position:</strong> ${data.position || "—"}</p>
                 <p><strong>Message:</strong></p>
                 <p>${data.questions.replace(/</g, "&lt;").replace(/\n/g, "<br>")}</p>`,
        },
      }).catch((e) => console.warn("Internal notification failed:", e));

      toast({ title: "Thank you for reaching out! 🙌", description: "We'll review your message and get back to you within 48 hours." });
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
              Get In Touch
            </p>
            <h2 className="text-[28px] md:text-[36px] lg:text-[52px] font-bold text-background leading-[1.08] mb-5">
              Let's Start a Conversation
            </h2>
            <p className="text-background/70 text-[15px] leading-[1.7] max-w-[480px]">
              Have a question or want to learn more about how we can help? Drop us a message and we'll get back to you shortly.
            </p>
          </div>

          {/* Left – white form card */}
          <div className="bg-background rounded-none p-6 md:p-10 lg:p-12 order-2 lg:order-1 max-w-[640px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* First Name + Last Name row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" className={inputClass} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" className={inputClass} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Company Name */}
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Company Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your company or organization" className={inputClass} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email + Position row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" className={inputClass} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClass}>Position</FormLabel>
                        <FormControl>
                          <Input placeholder="Your role or title" className={inputClass} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Questions textarea */}
                <FormField
                  control={form.control}
                  name="questions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Questions *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="How can we help you?"
                          className="min-h-[100px] rounded-none border border-foreground/20 bg-transparent px-3 py-2.5 text-[14px] text-foreground placeholder:text-foreground/40 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-foreground/60"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-[48px] px-8 rounded-none bg-[hsl(258_55%_25%)] hover:bg-[hsl(258_55%_20%)] text-background text-[12px] font-bold uppercase tracking-[0.14em] transition-all duration-300"
                >
                  {submitting ? "Sending..." : "Send Message"}
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
