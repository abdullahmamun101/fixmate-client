
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
    return <div className="p-8">Loading dashboard...</div>;
  }

  if (!session) {
    return (
      <div className="p-8 text-center">
        Please sign in to access your dashboard.
        <Link href="/sign-in" className="ml-2 text-blue-600 underline">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <aside className="w-full border-r border-gray-200 bg-white md:min-h-screen md:w-64">
        <div className="border-b p-5">
          <Link href="/" className="text-xl font-bold text-blue-700">
            FixMate
          </Link>
          <p className="mt-1 text-xs capitalize text-gray-500">
            {role || "customer"} Dashboard
          </p>
        </div>

        <nav className="space-y-1 p-4">
          {links.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}

          <Link
            href="/dashboard/profile"
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
              pathname === "/dashboard/profile"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <User size={18} />
            My Profile
          </Link>

          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </nav>
      </aside>

      <section className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b bg-white px-6 py-4">
          <h2 className="font-semibold text-gray-800">Dashboard</h2>
          <span className="text-sm text-gray-500">
            {session.user.name || session.user.email}
          </span>
        </header>

        {children}
      </section>
    </div>
  );
}
