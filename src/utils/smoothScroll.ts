/*
  Smooth scrolling we animate ourselves. Browsers turn `scroll-behavior: smooth` and
  scrollIntoView({ behavior: "smooth" }) into an instant jump when smooth scrolling is
  off for the user (an OS "reduce motion" setting, or a browser flag), so in-page links
  and the hero desk labels use this instead. Honors scroll-margin-top; wheel, touch or
  a key press hands control back to the user.
*/

let frame = 0;
let stop: (() => void) | null = null;

const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);

function targetY(el: Element) {
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return Math.max(0, Math.min(max, el.getBoundingClientRect().top + window.scrollY - margin));
}

export function smoothScrollTo(el: Element) {
  stop?.();
  const from = window.scrollY;
  const dist = Math.abs(targetY(el) - from);
  const dur = Math.min(1100, Math.max(450, 350 + Math.sqrt(dist) * 12)); // ms
  const t0 = performance.now();

  const cancel = () => {
    cancelAnimationFrame(frame);
    for (const e of ["wheel", "touchstart", "keydown"]) window.removeEventListener(e, cancel);
    stop = null;
  };
  for (const e of ["wheel", "touchstart", "keydown"]) window.addEventListener(e, cancel, { passive: true });
  stop = cancel;

  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / dur);
    // re-measure each frame so late layout shifts (images, lazy sections) still land right
    const y = from + (targetY(el) - from) * ease(p);
    window.scrollTo({ top: y, behavior: "instant" });
    if (p < 1) frame = requestAnimationFrame(step);
    else cancel();
  };
  frame = requestAnimationFrame(step);
}

export function scrollToHash(hash: string): boolean {
  const el = hash === "#top" || hash === "#" ? document.documentElement : document.querySelector(hash);
  if (!el) return false;
  if (location.hash !== hash) history.pushState(null, "", hash);
  smoothScrollTo(el);
  return true;
}

/** Route every same-page "#..." link click through smoothScrollTo. Returns a cleanup. */
export function smoothHashLinks() {
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element | null)?.closest?.("a[href^='#']");
    const hash = a?.getAttribute("href");
    if (!hash) return;
    let ok = false;
    try {
      ok = scrollToHash(hash);
    } catch {
      return; // not a valid selector: let the browser handle it
    }
    if (ok) e.preventDefault();
  };
  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}
