import type { Metadata } from "next";
import NotFoundContent from "@/components/NotFoundContent";

export const metadata: Metadata = {
  title: "404 — Lost in the garden | Snigdha Chandra Paik",
  description:
    "This page isn't part of the garden. Head back to the homepage or browse the projects.",
};

export default function NotFound() {
  return <NotFoundContent />;
}
