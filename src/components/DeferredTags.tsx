"use client";

import { useEffect } from "react";
import { runWhenIdleOrInteracted } from "@/lib/defer";

const GTM_ID = "GTM-M225DLQQ";
const GA_ID = "G-TL8FJW1FTY";

/** Loads Google Tag Manager + GA4 after load / first interaction. */
export default function DeferredTags() {
  useEffect(() => {
    runWhenIdleOrInteracted(() => {
      const w = window as any;
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      const gtm = document.createElement("script");
      gtm.async = true;
      gtm.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
      document.head.appendChild(gtm);

      function gtag(..._args: unknown[]) {
        w.dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", GA_ID);
      const ga = document.createElement("script");
      ga.async = true;
      ga.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(ga);

      // AdSense (auto ads) — staggered after GTM/GA so the three third-party
      // scripts don't all hit the main thread in the same moment.
      setTimeout(() => {
        const ads = document.createElement("script");
        ads.async = true;
        ads.crossOrigin = "anonymous";
        ads.src =
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3704963890684560";
        document.head.appendChild(ads);
      }, 2500);
    });
  }, []);
  return null;
}
