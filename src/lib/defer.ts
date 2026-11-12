/**
 * Run `cb` once, after the page has loaded and either the visitor interacts
 * (scroll / pointer / key / touch) or `maxDelay` ms have passed — whichever
 * comes first. Keeps third-party scripts off the critical rendering path.
 */
export function runWhenIdleOrInteracted(cb: () => void, maxDelay = 6000) {
  if (typeof window === "undefined") return;
  let done = false;
  const events = ["scroll", "pointerdown", "keydown", "touchstart", "mousemove"];
  const go = () => {
    if (done) return;
    done = true;
    events.forEach((e) => window.removeEventListener(e, go));
    clearTimeout(timer);
    cb();
  };
  const arm = () => {
    events.forEach((e) =>
      window.addEventListener(e, go, { once: true, passive: true }),
    );
  };
  const timer = setTimeout(go, maxDelay);
  if (document.readyState === "complete") arm();
  else window.addEventListener("load", arm, { once: true });
}
