
"use client";

import Link from "next/link";
import {
  PlusCircle,
  Wrench,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function TechnicianDashboard() {
  const { data: session } = authClient.useSession();

  const cards = [
    {
      title: "Add New Service",
      description: "Create and submit a new repair service.",
      href: "/dashboard/technician/add-service",
      icon: PlusCircle,
    },
    {
      title: "My Services",
      description: "View and manage your listed services.",
      href: "/dashboard/technician/my-services",
      icon: Wrench,
    },
    {
      title: "Booking Requests",
      description: "View and manage customer booking requests.",
      href: "/dashboard/technician/requests",
      icon: ClipboardList,
    },
  ];

  return (
    <div className="p-5 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {session?.user.name || "Technician"}!
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your services and customer booking requests from here.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-xl border border-gray-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-md"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <Icon size={24} />
              </div>

              <h2 className="text-lg font-semibold text-gray-900">
                {card.title}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {card.description}
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-blue-700">
                Open <ArrowRight size={16} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
