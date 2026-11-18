
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LayoutDashboard,
  Wrench,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";

import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const role = (
    session?.user as { role?: string } | undefined
  )?.role;

  const dashboardLink =
    role === "admin"
      ? "/dashboard/admin"
      : role === "technician"
        ? "/dashboard/technician"
        : "/dashboard/customer";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about" },
  ];

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href);

  const closeMenus = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const handleLogout = async () => {
    await authClient.signOut();
    closeMenus();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md">
      <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenus}
          className="flex shrink-0 items-center gap-2"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Wrench size={22} />
          </span>

          <span className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
            FixMate<span className="text-blue-600">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition ${isActive(link.href)
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-600"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Account */}
        <div className="hidden items-center gap-4 md:flex">

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700 transition hover:bg-gray-100"
          >
            {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {session ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                className="flex max-w-56 items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 transition hover:border-blue-400 hover:bg-blue-50"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <User size={19} />
                </span>

                <span className="max-w-28 truncate text-sm font-semibold text-gray-800">
                  {session.user.name || "My Account"}
                </span>

                <ChevronDown size={16} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-60 rounded-xl border border-gray-100 bg-white p-3 shadow-xl">
                  <div className="mb-2 border-b border-gray-100 px-3 pb-3">
                    <p className="truncate text-sm font-bold text-gray-900">
                      {session.user.name || "User"}
                    </p>
                    <p className="mt-1 text-xs capitalize text-blue-600">
                      {role || "Customer"}
                    </p>
                  </div>

                  <Link
                    href={dashboardLink}
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <LayoutDashboard size={17} />
                    Dashboard
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <User size={17} />
                    My Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-semibold text-gray-700 hover:text-blue-600"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition hover:bg-gray-100 md:hidden"
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 pb-5 pt-3 shadow-lg md:hidden">

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="mb-3 flex w-full items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className={`block rounded-lg px-4 py-3 text-sm font-semibold transition ${isActive(link.href)
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="mt-4 border-t border-gray-100 pt-4">
            {session ? (
              <>
                <div className="mb-3 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <User size={20} />
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-gray-900">
                      {session.user.name || "User"}
                    </p>
                    <p className="text-xs capitalize text-blue-600">
                      {role || "Customer"}
                    </p>
                  </div>
                </div>

                <Link
                  href={dashboardLink}
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <Link
                  href="/dashboard/profile"
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50"
                >
                  <User size={18} />
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/sign-in"
                  onClick={closeMenus}
                  className="rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  onClick={closeMenus}
                  className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
