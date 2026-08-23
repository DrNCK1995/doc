import Link from "next/link";
import Image from "next/image";
import {
  DOCTOR_NAME,
  DOCTOR_PHOTO_ALT,
  DOCTOR_PHOTO_SRC,
  INSTAGRAM_URL,
  YOUTUBE_URL,
} from "@/lib/constants";
import { BRAND_NAME, BRAND_TAGLINE, PRIMARY_NAV } from "@/lib/site-nav";

const footerLinks = [
  ...PRIMARY_NAV,
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 bg-card/60">
      <div className="container-page section-pad !py-12 sm:!py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={DOCTOR_PHOTO_SRC}
                  alt={DOCTOR_PHOTO_ALT}
                  fill
                  sizes="48px"
                  className="object-cover object-top"
                />
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-primary">
                  {BRAND_NAME}
                </p>
                <p className="text-xs text-muted-foreground">{DOCTOR_NAME}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              {BRAND_TAGLINE}
            </p>
            <div className="mt-4 flex gap-4 text-sm font-medium text-primary">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Instagram
              </a>
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                YouTube
              </a>
            </div>
          </div>

          <nav
            className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3"
            aria-label="Footer"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {BRAND_NAME}. Educational tools support —
          not a substitute for in-person medical care.
        </p>
      </div>
    </footer>
  );
}
