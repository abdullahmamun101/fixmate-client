import Link from "next/link";
import { Wrench } from "lucide-react";

export default function Footer() {
  return (
    <footer className="overflow-hidden border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-8 lg:px-8">
        {/* Top Row: Left Brand + Tagline | Right 3 Columns */}
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-start">
          {/* Brand & Tagline */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5 lg:max-w-md">
            <Link href="/" className="inline-flex shrink-0 items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-primary-foreground">
                <Wrench size={16} strokeWidth={2.2} />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                FixMate
              </span>
            </Link>

            <span
              aria-hidden
              className="hidden h-7 w-px shrink-0 bg-border sm:block"
            />

            <p className="text-xs leading-5 text-muted-foreground">
              Your trusted platform for reliable home appliance repair and
              maintenance services.
            </p>
          </div>

          {/* Right Link Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:gap-14">
            {/* Quick Links */}
            <div>
              <h3 className="mb-3.5 text-xs font-semibold text-foreground">
                Quick Links
              </h3>
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li>
                  <Link href="/" className="transition hover:text-foreground">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="transition hover:text-foreground"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="transition hover:text-foreground"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sign-in"
                    className="transition hover:text-foreground"
                  >
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="mb-3.5 text-xs font-semibold text-foreground">
                Popular Services
              </h3>
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li>
                  <Link
                    href="/services"
                    className="transition hover:text-foreground"
                  >
                    AC Repair
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="transition hover:text-foreground"
                  >
                    Refrigerator Repair
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="transition hover:text-foreground"
                  >
                    Laptop Repair
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="transition hover:text-foreground"
                  >
                    TV Repair
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="transition hover:text-foreground"
                  >
                    Washing Machine Repair
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="mb-3.5 text-xs font-semibold text-foreground">
                Contact Us
              </h3>
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li>Dhaka, Bangladesh</li>
                <li>support@fixmate.com</li>
                <li>+880 1000-000000</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Middle Divider & Bottom Bar */}
        <div className="mt-12 border-t border-border pt-5">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
            <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-4">
              <p>© {new Date().getFullYear()} FixMate. All rights reserved.</p>
              <span aria-hidden className="hidden sm:inline">
                •
              </span>
              <p>Made for a better home service experience.</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 text-foreground">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Facebook"
              >
                f
              </a>

              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="YouTube"
              >
                ▶
              </a>

              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="X"
              >
                𝕏
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="LinkedIn"
              >
                in
              </a>
            </div>
          </div>
        </div>

        {/* Large Display Brand Wordmark */}
        <div
          aria-hidden
          className="pointer-events-none relative mt-8 select-none overflow-hidden text-center"
        >
          <span className="block bg-gradient-to-b from-foreground/85 via-foreground/45 to-background bg-clip-text text-[5.25rem] font-extrabold leading-[0.82] tracking-tighter text-transparent sm:text-[8.5rem] md:text-[11rem] lg:text-[13.5rem]">
            FixMate
          </span>
        </div>
      </div>
    </footer>
  );
}
