
import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock, Wrench } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-100 blur-[100px]" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-cyan-50 blur-[100px]" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700 sm:text-sm">
            <Wrench size={16} />
            Your Trusted Repair Partner
          </div>

          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Expert Repairs.
            <span className="mt-2 block text-blue-600">
              Right at Your Door.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            Connect with skilled technicians for reliable home appliance
            and electronic repairs. Book your service easily and get
            your devices working again.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white transition hover:bg-blue-700"
            >
              Explore Services
              <ArrowRight size={19} />
            </Link>

            <Link
              href="/sign-up"
              className="rounded-xl border border-slate-300 px-7 py-4 text-center font-bold text-slate-800 transition hover:border-blue-400 hover:bg-blue-50"
            >
              Join FixMate
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-4 text-sm text-slate-600">
            <span className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-blue-600" />
              Trusted Technicians
            </span>
            <span className="flex items-center gap-2">
              <Clock size={18} className="text-blue-600" />
              Easy Booking
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute inset-0 rounded-[2rem] bg-blue-100 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">FixMate Service</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Repair Made Simple
                </h2>
              </div>
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                Easy & Reliable
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "📱", name: "Mobile Repair" },
                { icon: "💻", name: "Laptop Repair" },
                { icon: "❄️", name: "AC Repair" },
                { icon: "🧊", name: "Appliance Repair" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <span className="text-3xl">{item.icon}</span>
                  <p className="mt-3 text-sm font-semibold text-slate-800">
                    {item.name}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-blue-600 p-5">
              <p className="text-sm text-blue-100">Need a repair?</p>
              <p className="mt-1 text-lg font-bold text-white">
                Find the right technician.
              </p>
              <Link
                href="/services"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white hover:underline"
              >
                Browse services <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

