"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Smartphone,
  Laptop,
  Refrigerator,
  AirVent,
  Tv,
  WashingMachine,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const categories = [
  {
    name: "Mobile & Tablet",
    description: "Screen, battery and software repairs",
    icon: Smartphone,
    chips: ["Screen", "Battery", "Software"],
    tint: "from-sky-100 via-blue-50 to-cyan-100 dark:from-sky-950 dark:via-blue-950 dark:to-cyan-950",
    tilt: "-rotate-3",
  },
  {
    name: "Laptop & Computer",
    description: "Hardware and performance solutions",
    icon: Laptop,
    chips: ["Upgrade", "Cleaning", "Windows"],
    tint: "from-indigo-100 via-blue-50 to-sky-100 dark:from-indigo-950 dark:via-blue-950 dark:to-sky-950",
    tilt: "rotate-2",
  },
  {
    name: "AC Repair",
    description: "Installation and cooling services",
    icon: AirVent,
    chips: ["Gas Refill", "Cleaning", "Install"],
    tint: "from-cyan-100 via-sky-50 to-teal-100 dark:from-cyan-950 dark:via-sky-950 dark:to-teal-950",
    tilt: "-rotate-1",
  },
  {
    name: "Refrigerator",
    description: "Cooling and appliance maintenance",
    icon: Refrigerator,
    chips: ["Cooling", "Compressor", "Leak"],
    tint: "from-teal-100 via-cyan-50 to-blue-100 dark:from-teal-950 dark:via-cyan-950 dark:to-blue-950",
    tilt: "rotate-3",
  },
  {
    name: "TV & Display",
    description: "Screen and display repair services",
    icon: Tv,
    chips: ["Display", "Sound", "Smart TV"],
    tint: "from-violet-100 via-indigo-50 to-blue-100 dark:from-violet-950 dark:via-indigo-950 dark:to-blue-950",
    tilt: "-rotate-2",
  },
  {
    name: "Washing Machine",
    description: "Professional appliance repair",
    icon: WashingMachine,
    chips: ["Drum", "Motor", "Drain"],
    tint: "from-blue-100 via-sky-50 to-indigo-100 dark:from-blue-950 dark:via-sky-950 dark:to-indigo-950",
    tilt: "rotate-1",
  },
];

const CHIP_POSITIONS = ["left-3 top-4", "right-3 top-10", "left-5 bottom-4"];

export default function CategorySection() {
  const reduceMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: 0 });

  const [dragging, setDragging] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);

  const slide = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = (card?.offsetWidth ?? 300) + 24;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startLeft: el.scrollLeft,
      moved: 0,
    };
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const el = scrollerRef.current;
    if (!el) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    el.scrollLeft = drag.current.startLeft - dx;
  };

  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);
  };

  // drag korar por accidentally link click hoye jeno na jay
  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (drag.current.moved > 5) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = 0;
    }
  };

  return (
    <section className="relative isolate overflow-hidden bg-muted/40 py-16 sm:py-20 lg:py-24">
      {/* Background graphics */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -bottom-24 -left-32 h-72 w-72 rounded-full bg-brand/20 sm:h-96 sm:w-96" />
        <div className="absolute -right-16 -top-16 h-56 w-56 rotate-12 rounded-[3rem] bg-brand/10 sm:h-80 sm:w-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,var(--border)_1px,transparent_1px)] bg-size-[24px_24px] opacity-50" />
      </div>

      {/* Section Heading */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-4 max-w-2xl px-4 text-center sm:px-6 lg:px-8"
      >
        <span className="text-sm font-bold uppercase tracking-widest text-brand">
          Our Services
        </span>

        <h2 className="mt-3 text-3xl font-extrabold text-foreground sm:text-4xl">
          Explore Services by Category
        </h2>

        <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
          From everyday electronics to essential home appliances, find the
          right repair service for your needs.
        </p>
      </motion.div>

      {/* Slider */}
      <div
        ref={scrollerRef}
        onScroll={updateEdges}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        className={`flex gap-6 overflow-x-auto px-4 py-12 select-none [scrollbar-width:none] sm:px-6 lg:px-[max(2rem,calc((100%_-_80rem)/2_+_2rem))] [&::-webkit-scrollbar]:hidden ${
          dragging
            ? "cursor-grabbing snap-none"
            : "cursor-grab snap-x snap-mandatory scroll-smooth"
        }`}
      >
        {categories.map((category, index) => {
          const Icon = category.icon;

          return (
            <motion.div
              key={category.name}
              data-card
              initial={reduceMotion ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: Math.min(index, 4) * 0.08 }}
              className="flex w-[78vw] max-w-[300px] shrink-0 snap-center sm:w-[300px] lg:w-[320px]"
            >
              <Link
                href="/services"
                draggable={false}
                className="group flex w-full"
              >
                <div
                  className={`flex w-full flex-col rounded-3xl border border-border bg-card p-4 text-card-foreground shadow-xl shadow-black/5 transition duration-300 group-hover:-translate-y-2 group-hover:rotate-0 group-hover:shadow-2xl group-hover:shadow-brand/20 ${category.tilt}`}
                >
                  {/* Card graphic */}
                  <div
                    className={`relative flex h-44 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br ${category.tint}`}
                  >
                    {category.chips.map((chip, i) => (
                      <motion.span
                        key={chip}
                        animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
                        transition={{
                          duration: 3 + i * 0.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.4,
                        }}
                        className={`absolute ${CHIP_POSITIONS[i]} rounded-lg border border-border/60 bg-card/80 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm backdrop-blur`}
                      >
                        {chip}
                      </motion.span>
                    ))}

                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-card/80 text-brand shadow-md backdrop-blur transition duration-300 group-hover:scale-110">
                      <Icon size={32} strokeWidth={1.8} />
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
                    <h3 className="text-lg font-bold text-foreground transition group-hover:text-brand">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {category.description}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand">
                      Explore
                      <ArrowUpRight
                        size={16}
                        className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Slide buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => slide(-1)}
          disabled={!canPrev}
          aria-label="Previous categories"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => slide(1)}
          disabled={!canNext}
          aria-label="Next categories"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* View All */}
      <div className="mt-8 text-center">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-brand-foreground shadow-lg shadow-brand/30 transition hover:bg-brand/90"
        >
          View All Services
        </Link>
      </div>
    </section>
  );
}
