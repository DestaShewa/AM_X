import Link from "next/link";
import ExperienceHighlights from "./home/experience-highlights";
import SiteFooter from "../components/site-footer";
import SiteHeader from "../components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-[#f7f8f6]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#176B57]">
              AMX · Arba Minch Experiences
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight text-[#17352e] sm:text-6xl">
              Discover Arba Minch with local experiences
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Explore available experiences and learn what each includes.
              When a starting price has not been confirmed, request a quote.
            </p>
            <Link
              className="mt-8 inline-flex min-h-12 items-center rounded-lg bg-[#176B57] px-6 py-3 font-semibold text-white hover:bg-[#125744] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176B57]"
              href="/experiences"
            >
              Explore experiences
            </Link>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#176B57]">
                Browse
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#17352e]">
                Available experiences
              </h2>
            </div>
            <Link
              className="rounded text-sm font-semibold text-[#176B57] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176B57]"
              href="/experiences"
            >
              View all experiences
            </Link>
          </div>
          <ExperienceHighlights />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
