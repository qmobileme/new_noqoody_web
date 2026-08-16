import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useServerFn } from "@tanstack/react-start";
import { submitLead } from "@/lib/leads.functions";
import { newsletterSchema } from "@/lib/leads.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function NewsletterBanner() {
  const { t } = useLanguage();
  const send = useServerFn(submitLead);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = newsletterSchema.safeParse({ formType: "newsletter", email });
    if (!parsed.success) {
      setError(t("Enter a valid email address", "أدخل بريداً إلكترونياً صحيحاً"));
      return;
    }

    setPending(true);
    try {
      const result = await send({ data: parsed.data });
      if (result.ok) {
        setSubmitted(true);
        setEmail("");
      } else {
        setError(t("We couldn't subscribe you. Please try again.", "تعذر الاشتراك. حاول مرة أخرى."));
      }
    } catch {
      setError(t("We couldn't subscribe you. Please try again.", "تعذر الاشتراك. حاول مرة أخرى."));
    } finally {
      setPending(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-12"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-10 md:px-12 md:py-14">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-secondary/20 blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-accent/20 blur-2xl" />

          <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="flex-1 text-center md:text-start">
              <div className="inline-flex items-center gap-2 mb-3">
                <Mail className="h-5 w-5 text-accent" />
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">
                  {t("Newsletter", "النشرة البريدية")}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-heading font-bold text-primary-foreground mb-2">
                {t("Stay updated with the latest insights", "ابقَ على اطلاع بأحدث المقالات")}
              </h3>
              <p className="text-primary-foreground/70 text-sm">
                {t(
                  "Get the latest articles on fintech, digital payments, and e-commerce delivered to your inbox.",
                  "احصل على أحدث المقالات حول التكنولوجيا المالية والمدفوعات الرقمية والتجارة الإلكترونية."
                )}
              </p>
            </div>

            <div className="w-full md:w-auto md:min-w-[340px]">
              {submitted ? (
                <div className="flex items-center gap-2 justify-center text-accent font-semibold" role="status">
                  <CheckCircle className="h-5 w-5" />
                  {t("Thanks for subscribing!", "شكراً لاشتراكك!")}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-2" noValidate>
                  <div className="flex gap-2">
                  <Input
                    type="email"
                    required
                    aria-label={t("Email address", "البريد الإلكتروني")}
                    placeholder={t("Enter your email", "أدخل بريدك الإلكتروني")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={pending}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold whitespace-nowrap"
                  >
                    {pending && <Loader2 className="h-4 w-4 me-1 animate-spin" />}
                    {t("Subscribe", "اشترك")}
                  </Button>
                  </div>
                  {error && (
                    <p className="text-xs text-primary-foreground/90 bg-destructive/30 rounded-md px-2 py-1">{error}</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
