"use client";

import Link from "next/link";
import {
  PlusCircle,
  Wrench,
  ClipboardList,
  ArrowRight,
  Sparkles,
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
      badge: "Create",
    },
    {
      title: "My Services",
      description: "View and manage your listed services.",
      href: "/dashboard/technician/my-services",
      icon: Wrench,
      badge: "Catalog",
    },
    {
      title: "Booking Requests",
      description: "View and manage customer booking requests.",
      href: "/dashboard/technician/requests",
      icon: ClipboardList,
      badge: "Orders",
    },
  ];

  const technicianName = session?.user.name || "Technician";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Top Header & Featured Overview */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="flex flex-col justify-center rounded-[26px] border border-border bg-card p-6 shadow-xs lg:col-span-5">
            <span className="inline-flex w-fit items-center rounded-full border border-border bg-background px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand">
              Technician Workspace
            </span>
            <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Welcome, {technicianName}!
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Manage your services and customer booking requests from here.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[26px] border border-brand/30 bg-brand p-6 text-brand-foreground shadow-md lg:col-span-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-brand-foreground/15 blur-2xl"
            />
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-foreground/80">
                  Service Hub
                </p>
                <h2 className="mt-1 text-xl font-extrabold tracking-tight">
                  Ready for Repair Requests
                </h2>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-foreground/30 bg-brand-foreground/15 px-3.5 py-1 text-xs font-bold">
                <Sparkles size={14} />
                {cards.length} Core Modules
              </span>
            </div>

            <div className="relative z-10 mt-5 grid grid-cols-3 gap-3 rounded-2xl border border-brand-foreground/20 bg-brand-foreground/10 p-3.5 backdrop-blur-xs">
              <div>
                <p className="text-[11px] text-brand-foreground/75">Services</p>
                <p className="mt-0.5 text-sm font-extrabold">Publish & Edit</p>
              </div>
              <div>
                <p className="text-[11px] text-brand-foreground/75">Requests</p>
                <p className="mt-0.5 text-sm font-extrabold">Track Jobs</p>
              </div>
              <div>
                <p className="text-[11px] text-brand-foreground/75">Status</p>
                <p className="mt-0.5 text-sm font-extrabold">Active Pro</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards Grid */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                href={card.href}
                className="group flex flex-col justify-between rounded-[24px] border border-border bg-card p-6 shadow-xs transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-md"
              >
                <div>
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted text-brand transition group-hover:bg-brand group-hover:text-brand-foreground">
                      <Icon size={22} />
                    </div>

                    <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
                      {card.badge}
                    </span>
                  </div>

                  <h2 className="text-lg font-extrabold tracking-tight text-foreground transition group-hover:text-brand">
                    {card.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-4 text-sm font-bold text-brand">
                  <span>Open</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
