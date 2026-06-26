"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXTwitter,
  faLinkedinIn,
  faFacebookF,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Link2, Check, Share2 } from "lucide-react";

type Props = {
  /** Absolute URL of the post (e.g. https://site.com/blogs/my-slug). */
  url: string;
  /** Post title, used as share text. */
  title: string;
};

export default function BlogShare({ url, title }: Props) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const channels: {
    name: string;
    href: string;
    icon: IconDefinition;
  }[] = [
    {
      name: "Share on X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: faXTwitter,
    },
    {
      name: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: faLinkedinIn,
    },
    {
      name: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: faFacebookF,
    },
    {
      name: "Share on WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: faWhatsapp,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context / permissions) — fail silently.
    }
  };

  const handleNativeShare = async () => {
    // Web Share API — mobile-first. Falls back to nothing if unsupported.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User dismissed the share sheet — no action needed.
      }
    }
  };

  const tileBase =
    "flex h-11 w-11 items-center justify-center border-2 border-[#141B1A] bg-white text-[#141B1A] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#141B1A] hover:text-[#E8E4D9] hover:shadow-[3px_3px_0px_#C56E3D]";

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-y-2 border-[#141B1A]/10 py-5">
      <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#C56E3D]">
        <Share2 size={14} />
        Share
      </span>

      <div className="flex flex-wrap items-center gap-2">
        {channels.map((c) => (
          <a
            key={c.name}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={c.name}
            title={c.name}
            className={tileBase}
          >
            <FontAwesomeIcon icon={c.icon} className="text-base" />
          </a>
        ))}

        {/* Native share — only meaningful on devices that support it */}
        <button
          type="button"
          onClick={handleNativeShare}
          aria-label="Share via device"
          title="Share via device"
          className={`${tileBase} sm:hidden`}
        >
          <Share2 size={16} />
        </button>

        {/* Copy link */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Link copied" : "Copy link"}
          title={copied ? "Link copied" : "Copy link"}
          className={`${tileBase} ${copied ? "bg-[#141B1A] text-[#E8E4D9]" : ""}`}
        >
          {copied ? <Check size={16} /> : <Link2 size={16} />}
        </button>
      </div>
    </div>
  );
}
