import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { footerColumns, socials } from "@/lib/footer-nav";
import { NewsletterForm } from "@/components/NewsletterForm";
import { BrandLogoLink } from "@/components/BrandLogoLink";

function useIsDesktopFooter() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return isDesktop;
}

function FooterLinks({ links }: { links: (typeof footerColumns)[number]["links"] }) {
  return (
    <ul className="space-y-0 text-[13px] text-muted-foreground">
      {links.map((l) => (
        <li key={l.label}>
          {l.to ? (
            <Link
              to={l.to}
              title={l.desc}
              aria-label={l.desc ?? l.label}
              className="inline-flex min-h-6 items-center rounded leading-tight transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
            >
              {l.label}
            </Link>
          ) : (
            <Link
              to="/"
              hash={l.hash ?? ""}
              title={l.desc}
              aria-label={l.desc ?? l.label}
              className="inline-flex min-h-6 items-center rounded leading-tight transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
            >
              {l.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

function FooterColumn({
  col,
  isDesktop,
}: {
  col: (typeof footerColumns)[number];
  isDesktop: boolean;
}) {
  const [open, setOpen] = useState(false);
  const panelId = `footer-col-${col.title.replace(/\s+/g, "-").toLowerCase()}`;

  if (isDesktop) {
    return (
      <nav aria-label={col.title}>
        <h3 className="text-sm font-semibold">{col.title}</h3>
        <div className="mt-1">
          <FooterLinks links={col.links} />
        </div>
      </nav>
    );
  }

  return (
    <nav aria-label={col.title} className="border-b border-border/50 last:border-b-0">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-3 py-2 text-left text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="min-w-0 truncate">{col.title}</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
      </h3>
      <div id={panelId} hidden={!open} className="pb-2">
        <FooterLinks links={col.links} />
      </div>
    </nav>
  );
}

export function SiteFooter() {
  const isDesktop = useIsDesktopFooter();
  return (
    <footer className="border-t border-border/50 bg-card/40 backdrop-blur" aria-labelledby="site-footer-heading">
      <span className="block h-1 w-full" style={{ background: "var(--gradient-brand)" }} aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-6 py-5 sm:py-6">
        <h2 id="site-footer-heading" className="sr-only">
          Noqoody payment services — site directory, contact details and newsletter
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h3 className="sr-only">About Noqoody</h3>
            <BrandLogoLink placement="footer" width={160} height={27} lazy />
            <p className="mt-2 text-xs text-muted-foreground">Noqoody Payment Services Co., w.l.l</p>
            <h3 className="sr-only">Follow Noqoody on social media</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border/70 bg-card text-muted-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <s.Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <NewsletterForm />
          </div>

          <div className="grid gap-0 sm:grid-cols-2 sm:gap-4 lg:col-span-5 lg:grid-cols-2">
            {footerColumns.map((col) => (
              <FooterColumn key={col.title} col={col} isDesktop={isDesktop} />
            ))}
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold">Address</h3>
            <address className="mt-1 space-y-1 text-[13px] leading-snug not-italic text-muted-foreground">
              <p className="font-medium text-foreground/80">Qatar Office</p>
              <p>
                <span className="font-medium text-foreground/80">Location:</span> Next to Doha City Center,
                31 Off, 841 Fesh Elshawheen St, 37 Alreem Tower, 7th Floor, Doha, Qatar
              </p>
              <p>
                <span className="font-medium text-foreground/80">Email:</span>{" "}
                <a
                  className="inline-flex min-h-6 items-center rounded hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                  href="mailto:info@Noqoody.com"
                >
                  info@Noqoody.com
                </a>
              </p>
              <p>
                <span className="font-medium text-foreground/80">Phone:</span>{" "}
                <a
                  className="inline-flex min-h-6 items-center rounded hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                  href="tel:+97444973030"
                >
                  +974 4497 3030
                </a>
              </p>
            </address>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl border-t border-border/50 px-6 py-2.5">
        <p className="text-center text-[11px] leading-snug text-muted-foreground">
          Noqoody Payment Services Co., w.l.l is licensed by Qatar Central Bank (QCB) to operate as a
          Payment Services Provider (PSP) in the State of Qatar. © {new Date().getFullYear()}
        </p>
        <p className="mt-1 text-center text-[11px] text-muted-foreground/70">
          <Link
            to="/account/login"
            className="inline-flex min-h-6 items-center rounded px-1 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
          >
            Customer login
          </Link>
          <span aria-hidden="true" className="px-1">·</span>
          <Link
            to="/admin/login"
            className="inline-flex min-h-6 items-center rounded px-1 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
          >
            Staff login
          </Link>
        </p>
      </div>
    </footer>
  );
}
