"use client";

import SmoothScroll from "./SmoothScroll";
import Navbar from "./Navbar";
import Footer from "./Footer";
import UniversalLoader from "./UniversalLoader";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
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
