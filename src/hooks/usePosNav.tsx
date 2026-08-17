import { useMemo } from "react";
import { usePosProducts } from "@/hooks/useCatalog";
import type { NavItem } from "@/lib/nav-items";

/**
 * Swaps the POS Products dropdown children for the live product library, so a
 * product added in the admin panel shows up in the header automatically.
 */
export function usePosNavItems(items: NavItem[]): NavItem[] {
  const { data } = usePosProducts(true);
  return useMemo(() => {
    if (!data?.length) return items;
    return items.map((item) =>
      item.label === "POS Products"
        ? {
            ...item,
            children: [
              { label: "POS Menu", href: "/pos-menu", icon: "help" },
              { label: "Why our POS?", href: "/best-pos-provider-in-qatar", icon: "help" },
              ...data.map((p) => ({
                label: p.name,
                href: `/pos-products/${p.slug}`,
                ...(p.hero_image ? { icon: p.hero_image } : {}),
              })),
            ],
          }
        : item,
    );
  }, [items, data]);
}
