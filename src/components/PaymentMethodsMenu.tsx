import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Check, ChevronDown } from "lucide-react";
import {
  paymentMethods,
  readStoredPaymentMethod,
  solutionsLinks,
  storePaymentMethod,
  type PaymentMethodId,
} from "@/lib/payment-methods";
import { trackPaymentMethodSelect } from "@/lib/analytics";

type Props = { placement?: string };

export function PaymentMethodsMenu({ placement = "header" }: Props) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<PaymentMethodId | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const buttonId = useId();

  // Restore the last choice after hydration (localStorage is client-only).
  useEffect(() => {
    setSelected(readStoredPaymentMethod());
  }, []);

  const closeMenu = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  }, []);

  const openMenu = useCallback(
    (index?: number) => {
      const selectedIndex = paymentMethods.findIndex((m) => m.id === selected);
      setActiveIndex(index ?? (selectedIndex >= 0 ? selectedIndex : 0));
      setOpen(true);
    },
    [selected],
  );

  // Move DOM focus with the active item while the menu is open.
  useEffect(() => {
    if (open) itemRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  // Close on outside pointer down.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const select = (id: PaymentMethodId) => {
    const method = paymentMethods.find((m) => m.id === id)!;
    setSelected(id);
    storePaymentMethod(id);
    trackPaymentMethodSelect({
      method_id: method.id,
      method_name: method.label,
      placement,
      destination: method.hash ? `${method.to}#${method.hash}` : method.to,
      source_route: pathname,
    });
    closeMenu();

    if (method.to === pathname && method.hash) {
      document
        .getElementById(method.hash)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `${method.to}#${method.hash}`);
    } else if (method.hash) {
      navigate({ to: method.to, hash: method.hash });
    } else {
      navigate({ to: method.to });
    }
  };

  const onButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openMenu();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openMenu(paymentMethods.length - 1);
    }
  };

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % paymentMethods.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + paymentMethods.length) % paymentMethods.length);
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(paymentMethods.length - 1);
        break;
      case "Escape":
        e.preventDefault();
        closeMenu();
        break;
      case "Tab":
        closeMenu(false);
        break;
      default:
        break;
    }
  };

  const selectedMethod = paymentMethods.find((m) => m.id === selected) ?? null;

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={() => openMenu()}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={onButtonKeyDown}
        className="flex items-center gap-1 whitespace-nowrap py-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-expanded:text-foreground"
      >
        Payment Methods
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-labelledby={buttonId}
          aria-orientation="vertical"
          onKeyDown={onMenuKeyDown}
          className="absolute left-0 top-full z-50 w-72 rounded-[var(--radius-2xl)] border border-border bg-card/95 p-2 shadow-[var(--shadow-lift)] backdrop-blur-xl"
        >
          {paymentMethods.map((method, index) => {
            const Icon = method.icon;
            const isSelected = method.id === selected;
            return (
              <button
                key={method.id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                tabIndex={index === activeIndex ? 0 : -1}
                onClick={() => select(method.id)}
                onMouseEnter={() => setActiveIndex(index)}
                className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-muted focus:bg-muted focus:outline-none"
              >
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background/70"
                  aria-hidden="true"
                >
                  <Icon className="h-4.5 w-4.5 text-primary" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-foreground">{method.label}</span>
                  <span className="block text-xs text-muted-foreground">{method.description}</span>
                </span>
                {isSelected && <Check className="mt-1 h-4 w-4 text-primary" aria-hidden="true" />}
              </button>
            );
          })}

          <div className="my-1 border-t border-border" role="separator" />
          <p className="px-3 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Solutions
          </p>
          {solutionsLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.to}
                type="button"
                role="menuitem"
                tabIndex={-1}
                onClick={() => {
                  closeMenu();
                  navigate({ to: link.to });
                }}
                className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-muted focus:bg-muted focus:outline-none"
              >
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background/70"
                  aria-hidden="true"
                >
                  <Icon className="h-4.5 w-4.5 text-primary" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-foreground">{link.label}</span>
                  <span className="block text-xs text-muted-foreground">{link.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      <span className="sr-only" aria-live="polite">
        {selectedMethod ? `${selectedMethod.label} selected` : ""}
      </span>
    </div>
  );
}
