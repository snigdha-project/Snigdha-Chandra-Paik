"use client";

import { usePathname } from "next/navigation";
import SmoothScroll from "./SmoothScroll";
import Navbar from "./Navbar";
import Footer from "./Footer";
import UniversalLoader from "./UniversalLoader";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // Admin pages render bare — no Navbar/Footer/SmoothScroll/Loader.
    return <>{children}</>;
  }

  return (
    <>
      <UniversalLoader />
      <SmoothScroll>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
