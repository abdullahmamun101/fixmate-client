"use client";

import { toast } from "sonner";
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

function UserAvatar({
  image,
  className,
}: {
  image?: string | null;
  className: string;
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand/15 text-brand ${className}`}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="h-full w-full object-cover" />
      ) : (
        <User size={18} />
      )}
    </span>
  );
}

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const role = (session?.user as { role?: string } | undefined)?.role;

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
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const closeMenus = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Signed out successfully");
      closeMenus();
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Sign out failed. Please try again.");
    }
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-6">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-border bg-background/70 px-3 py-2 shadow-lg shadow-black/5 backdrop-blur-xl sm:px-5">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenus}
          className="flex shrink-0 items-center gap-2"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-brand-foreground">
            <Wrench size={20} />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            FixMate<span className="text-brand">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${isActive(link.href)
                  ? "bg-brand/15 text-brand"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Account */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-accent"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {session ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                className="flex max-w-56 items-center gap-2 rounded-full border border-border py-1.5 pl-1.5 pr-3 transition hover:bg-accent"
              >
                <UserAvatar image={session.user.image} className="h-8 w-8" />
                <span className="max-w-28 truncate text-sm font-semibold text-foreground">
                  {session.user.name || "My Account"}
                </span>
                <ChevronDown size={16} className="text-muted-foreground" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-border bg-popover p-2 text-popover-foreground shadow-xl">
                  <div className="mb-2 border-b border-border px-3 pb-3 pt-2">
                    <p className="truncate text-sm font-bold">
                      {session.user.name || "User"}
                    </p>
                    <span className="mt-1.5 inline-block rounded-full bg-brand/15 px-2.5 py-0.5 text-xs font-semibold capitalize text-brand">
                      {role || "Customer"}
                    </span>
                  </div>

                  <Link
                    href={dashboardLink}
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-accent"
                  >
                    <LayoutDashboard size={17} />
                    Dashboard
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-accent"
                  >
                    <User size={17} />
                    My Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-destructive hover:bg-destructive/10"
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
                className="rounded-full border border-foreground/40 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-accent"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground shadow-sm transition hover:bg-brand/90"
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
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-accent md:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="mx-auto mt-2 max-w-7xl rounded-3xl border border-border bg-background/95 p-4 shadow-xl backdrop-blur-xl md:hidden">
          <button
            onClick={toggleTheme}
            className="mb-3 flex w-full items-center gap-2 rounded-full border border-border px-4 py-3 text-sm font-semibold text-foreground"
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
                className={`block rounded-full px-4 py-3 text-sm font-semibold transition ${isActive(link.href)
                    ? "bg-brand/15 text-brand"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="mt-4 border-t border-border pt-4">
            {session ? (
              <>
                <div className="mb-3 flex items-center gap-3 rounded-2xl bg-muted p-3">
                  <UserAvatar image={session.user.image} className="h-10 w-10" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">
                      {session.user.name || "User"}
                    </p>
                    <p className="text-xs font-semibold capitalize text-brand">
                      {role || "Customer"}
                    </p>
                  </div>
                </div>

                <Link
                  href={dashboardLink}
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-foreground hover:bg-accent"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <Link
                  href="/dashboard/profile"
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-foreground hover:bg-accent"
                >
                  <User size={18} />
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-destructive hover:bg-destructive/10"
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
                  className="rounded-full border border-foreground/40 px-4 py-3 text-center text-sm font-bold text-foreground hover:bg-accent"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  onClick={closeMenus}
                  className="rounded-full bg-brand px-4 py-3 text-center text-sm font-bold text-brand-foreground hover:bg-brand/90"
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
