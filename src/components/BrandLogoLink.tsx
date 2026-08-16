import { Link, useRouterState } from "@tanstack/react-router";
import { trackLogoClick } from "@/lib/analytics";
import logoAsset from "@/assets/noqoody-logo-glass.png.asset.json";

type Props = {
  className?: string;
  imgClassName?: string;
  width?: number;
  height?: number;
  placement?: string;
  lazy?: boolean;
};

/**
 * Accessible, prefetching brand logo link back to the homepage.
 * - Tab/Enter reachable with a visible focus ring
 * - Prefetches "/" on hover or focus (preload="intent")
 * - Hover lift is disabled for prefers-reduced-motion users
 */
export function BrandLogoLink({
  className = "",
  imgClassName = "h-7 w-auto",
  width = 164,
  height = 28,
  placement = "header",
  lazy = false,
}: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Link
      to="/"
      preload="intent"
      aria-label="Noqoody — go to the homepage"
      title="Noqoody homepage"
      onClick={() => trackLogoClick(pathname, "/", placement)}
      className={`inline-flex rounded-md outline-none transition-transform duration-200 hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:scale-100 ${className}`}
    >
      <img
        src={logoAsset.url}
        alt="Noqoody"
        className={imgClassName}
        width={width}
        height={height}
        loading={lazy ? "lazy" : undefined}
      />
    </Link>
  );
}
