import { footerNavItems, socialMediaLinks } from "@/config/navigation";
import { Link } from "react-router";
import Logo from "./Logo";
import { Facebook, Twitter, Instagram, Linkedin, Github, Mail } from "lucide-react";
import type { ComponentType } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type NavItem = { href: string; label: string };

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  github: Github,
};

function SocialLinks() {
  return (
    <ul className="mt-2 flex flex-wrap gap-3">
      {socialMediaLinks.map((s) => {
        const Icon = ICONS[s.icon] ?? Github;
        return (
          <li key={s.name}>
            <Link
              to={s.href}
              rel="noreferrer"
              target="_blank"
              aria-label={s.name}
              className="inline-flex size-10 items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            >
              <Icon className="size-5" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Section({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div>
      <p className="mb-4 font-semibold text-gray-900 dark:text-white">{title}</p>
      <ul className="space-y-3 text-sm">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              to={item.href}
              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}



function CTA() {
  const newsletterSchema = z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),
  });
  type NewsletterValues = z.infer<typeof newsletterSchema>;

  const form = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (values: NewsletterValues) => {
    try {
      await new Promise((r) => setTimeout(r, 600));
      toast.success(`Subscribed ${values.email}! You'll hear from us soon.`);
      form.reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 dark:from-white dark:via-white dark:to-gray-100 p-6 sm:p-8">
      <div className="relative z-10 grid gap-4 md:grid-cols-5 md:items-center">
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-white dark:text-gray-900">Stay in the loop</h3>
          <p className="mt-1 text-sm text-gray-300 dark:text-gray-600">Get delivery tips, product updates, and exclusive offers—no spam.</p>
        </div>
        <Form {...form}>
          <form className="md:col-span-3" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Input
                        id="newsletter-email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="Enter your email"
                        {...field}
                        className="w-full border-white/20 bg-white/10 text-white placeholder:text-gray-300 focus-visible:ring-white/40 dark:border-gray-300 dark:bg-white dark:text-gray-900 dark:placeholder:text-gray-500 dark:focus-visible:ring-gray-400"
                      />
                      <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Subscribing..." : "Subscribe"}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-300 dark:text-red-500" />
                </FormItem>
              )}
            />
            <p className="mt-2 text-[11px] text-gray-300 dark:text-gray-500">By subscribing, you agree to our Privacy Policy.</p>
          </form>
        </Form>
      </div>
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl dark:bg-gray-300/40" />
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-950/40 backdrop-blur">
      <div className="container mx-auto max-w-screen-xl px-4">
        {/* Top: Brand + CTA */}
        <div className="py-10 md:py-14">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-center">
            <div className="space-y-4">
              <Logo />
              <p className="max-w-md text-sm text-gray-600 dark:text-gray-400">
                Fast, reliable, and secure parcel delivery. Track parcels in real-time and ship worldwide without hassle.
              </p>
              <SocialLinks />
            </div>

            <div className="md:col-span-2">
              <CTA />
            </div>
          </div>
        </div>

        {/* Middle: Link Sections */}
        <div className="py-8 border-t border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            <Section title="Services" items={footerNavItems.services} />
            <Section title="Company" items={footerNavItems.company} />
            <Section title="Support" items={footerNavItems.support} />
            <Section title="Legal" items={footerNavItems.legal} />
          </div>
        </div>

        {/* Bottom: Copyright + Legal Links */}
        <div className="py-6 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} courierLab. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
            {footerNavItems.legal.slice(0, 3).map((item) => (
              <Link key={item.href} to={item.href} className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
