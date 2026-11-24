"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Users,
  Wrench,
  ClipboardList,
  CreditCard,
  FileText,
  PlusCircle,
  ListChecks,
  CalendarDays,
  Home,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const role = (session?.user as { role?: string } | undefined)?.role;

  const customerLinks = [
    { name: "Dashboard", href: "/dashboard/customer", icon: LayoutDashboard },
    { name: "My Bookings", href: "/dashboard/customer/bookings", icon: ClipboardList },
    { name: "My Payments", href: "/dashboard/customer/payments", icon: CreditCard },
  ];

  const technicianLinks = [
    { name: "Dashboard", href: "/dashboard/technician", icon: LayoutDashboard },
    { name: "Add Service", href: "/dashboard/technician/add-service", icon: PlusCircle },
    { name: "My Services", href: "/dashboard/technician/my-services", icon: Wrench },
    { name: "Requests", href: "/dashboard/technician/requests", icon: ListChecks },
  ];

  const adminLinks = [
    { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { name: "Manage Services", href: "/dashboard/admin/services", icon: Wrench },
    { name: "Manage Bookings", href: "/dashboard/admin/bookings", icon: CalendarDays },
    { name: "Transactions", href: "/dashboard/admin/transactions", icon: FileText },
  ];

  const links =
    role === "admin"
      ? adminLinks
      : role === "technician"
        ? technicianLinks
        : customerLinks;

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-8 text-foreground">
        <div className="rounded-2xl border border-border bg-card px-6 py-4 text-sm font-medium text-muted-foreground shadow-xs">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-8 text-center text-foreground">
        <div className="max-w-md rounded-[24px] border border-border bg-card p-8 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Please sign in to access your dashboard.
          </p>
          <Link
            href="/sign-in"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground transition hover:bg-brand/90"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const userInitial = (
    session.user.name?.[0] ||
    session.user.email?.[0] ||
    "U"
  ).toUpperCase();

  return (
    <div className="min-h-screen bg-muted/40 text-foreground md:flex">
      {/* Sidebar */}
      <aside className="w-full border-b border-border bg-card md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between border-b border-border px-5 py-5 md:block">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xl font-extrabold tracking-tight text-foreground"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-2xs">
                <Wrench size={16} />
              </span>
              <span>FixMate</span>
            </Link>
            <p className="mt-1.5 inline-flex items-center rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-brand">
              {role || "customer"} Dashboard
            </p>
          </div>
        </div>

        <nav className="space-y-1.5 p-3.5">
          {links.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-brand text-brand-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}

          <div className="my-2 border-t border-border/80 pt-2">
            <Link
              href="/dashboard/profile"
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                pathname === "/dashboard/profile"
                  ? "bg-brand text-brand-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <User size={18} />
              My Profile
            </Link>

            <Link
              href="/"
              className="mt-1 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <Home size={18} />
              Back to Home
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <section className="min-w-0 flex-1 bg-background">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-card/90 px-6 py-4 backdrop-blur-md">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Workspace
            </p>
            <h2 className="text-lg font-extrabold tracking-tight text-foreground">
              Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-border bg-background py-1 pl-3.5 pr-1.5 shadow-2xs">
            <span className="max-w-[180px] truncate text-xs font-semibold text-foreground sm:max-w-xs">
              {session.user.name || session.user.email}
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-brand-foreground">
              {userInitial}
            </span>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </section>
    </div>
  );
}
