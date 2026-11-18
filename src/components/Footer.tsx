import Link from "next/link";
import { Wrench } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div>
          <Link href="/" className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-blue-600 p-2 text-white">
              <Wrench size={22} />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              FixMate
            </span>
          </Link>

          <p className="text-sm leading-6 text-gray-600">
            Your trusted platform for reliable home appliance repair
            and maintenance services.
          </p>

          {/* Social Links */}
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-blue-600 hover:text-white"
              aria-label="Facebook"
            >
              f
            </a>

            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-red-600 hover:text-white"
              aria-label="YouTube"
            >
              ▶
            </a>

            <a
              href="https://x.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-black hover:text-white"
              aria-label="X"
            >
              𝕏
            </a>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-blue-700 hover:text-white"
              aria-label="LinkedIn"
            >
              in
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 font-semibold text-gray-900">
            Quick Links
          </h3>

          <ul className="space-y-3 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li><Link href="/services" className="hover:text-blue-600">Services</Link></li>
            <li><Link href="/about" className="hover:text-blue-600">About Us</Link></li>
            <li><Link href="/sign-in" className="hover:text-blue-600">Sign In</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="mb-4 font-semibold text-gray-900">
            Popular Services
          </h3>

          <ul className="space-y-3 text-sm text-gray-600">
            <li><Link href="/services" className="hover:text-blue-600">AC Repair</Link></li>
            <li><Link href="/services" className="hover:text-blue-600">Refrigerator Repair</Link></li>
            <li><Link href="/services" className="hover:text-blue-600">Laptop Repair</Link></li>
            <li><Link href="/services" className="hover:text-blue-600">TV Repair</Link></li>
            <li><Link href="/services" className="hover:text-blue-600">Washing Machine Repair</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 font-semibold text-gray-900">
            Contact Us
          </h3>

          <ul className="space-y-3 text-sm text-gray-600">
            <li>Dhaka, Bangladesh</li>
            <li>support@fixmate.com</li>
            <li>+880 1000-000000</li>
          </ul>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-sm text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} FixMate. All rights reserved.</p>
          <p>Made for a better home service experience.</p>
        </div>
      </div>
    </footer>
  );
}
