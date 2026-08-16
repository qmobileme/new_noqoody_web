/** Helpers for navigating to "/path#section" links without a full page reload. */

export function pathOf(href: string) {
  return href.split("#")[0] || "/";
}

export function hashOf(href: string) {
  const i = href.indexOf("#");
  return i === -1 ? "" : href.slice(i + 1);
}

/** Smoothly scroll to an element id, honouring prefers-reduced-motion. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  return true;
}

/**
 * Click handler for in-page anchor links: when the link targets the current
 * route, scroll to the section instead of reloading. Always runs `onDone`
 * so the menu that owns the link can close itself.
 */
export function handleHashNavClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  currentPath: string,
  onDone?: () => void,
) {
  onDone?.();
  const hash = hashOf(href);
  if (!hash || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  if (pathOf(href) !== currentPath) return;
  e.preventDefault();
  if (scrollToId(hash)) {
    window.history.replaceState(null, "", `${currentPath}#${hash}`);
  }
}
