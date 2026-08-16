import { Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/SiteFooter";
import logo from "@/assets/noqoody-logo.svg";

export function LegalPage({
  title,
  intro,
  sections,
  children,
}: {
  title: string;
  intro: string;
  sections?: { heading: string; body: string }[];
  children?: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4" aria-label="Primary">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link to="/" aria-label="Noqoody home" className="rounded focus-visible:ring-2 focus-visible:ring-ring">
              <img src={logo} alt="Noqoody" className="h-7 w-auto" width={164} height={28} />
            </Link>
            <Link
              to="/"
              preload="intent"
              aria-label="Go to the homepage"
              className="inline-flex min-h-11 shrink-0 items-center rounded-xl border border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring sm:px-4"
            >
              Home
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="mt-4 text-muted-foreground">{intro}</p>
        {sections?.map((s) => (
          <section key={s.heading} className="mt-10">
            <h2 className="text-xl font-semibold">{s.heading}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{s.body}</p>
          </section>
        ))}
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
