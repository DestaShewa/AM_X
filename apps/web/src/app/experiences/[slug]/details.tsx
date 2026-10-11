"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import SiteFooter from "../../../components/site-footer";
import SiteHeader from "../../../components/site-header";
import {
  getPublicPackage,
  PackageNotFoundError,
  type PublicPackage,
} from "../../../lib/packages";

export default function ExperienceDetailsPage({ slug }: { slug: string }) {
  const [result, setResult] = useState<
    | { slug: string; experience: PublicPackage }
    | { slug: string; message: string; notFound: boolean }
    | null
  >(null);
  const loading = result?.slug !== slug;
  const experience =
    result?.slug === slug && "experience" in result ? result.experience : null;
  const notFound =
    result?.slug === slug && "notFound" in result && result.notFound;
  const errorMessage =
    result?.slug === slug && "message" in result ? result.message : "";

  useEffect(() => {
    let active = true;
    getPublicPackage(slug)
      .then((result) => {
        if (active) {
          setResult({ slug, experience: result });
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setResult({
            slug,
            message:
              error instanceof Error
                ? error.message
                : "This experience is temporarily unavailable.",
            notFound: error instanceof PackageNotFoundError,
          });
        }
      });
    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-[65vh] max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
          <Link className="underline-offset-4 hover:underline" href="/">
            Home
          </Link>
          <span aria-hidden="true" className="mx-2">
            /
          </span>
          <Link
            className="underline-offset-4 hover:underline"
            href="/experiences"
          >
            Experiences
          </Link>
          <span aria-hidden="true" className="mx-2">
            /
          </span>
          <span aria-current="page">
            {experience?.name ?? "Experience details"}
          </span>
        </nav>

        {loading ? (
          <p className="mt-10 text-slate-600" role="status">
            Loading experience…
          </p>
        ) : notFound ? (
          <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-8">
            <h1 className="text-2xl font-bold text-[#17352e]">
              Experience not found
            </h1>
            <p className="mt-3 text-slate-600">
              This experience may no longer be available.
            </p>
            <Link
              className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-[#176B57] px-5 py-2.5 font-semibold text-white hover:bg-[#125744]"
              href="/experiences"
            >
              Browse experiences
            </Link>
          </section>
        ) : errorMessage ? (
          <p className="mt-10 rounded-xl border border-red-200 bg-red-50 p-5 text-red-800" role="alert">
            {errorMessage}
          </p>
        ) : experience ? (
          <article className="mt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#176B57]">
              {experience.destination}
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#17352e] sm:text-5xl">
              {experience.name}
            </h1>
            {experience.media_references.map((media) => (
              <Image
                alt={media.alt_text}
                className="mt-8 max-h-[32rem] w-full rounded-2xl object-cover"
                height={900}
                key={media.url}
                src={media.url}
                unoptimized
                width={1600}
              />
            ))}
            <div className="mt-8 grid gap-6 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2 sm:p-8">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Duration
                </h2>
                <p className="mt-2 text-lg font-medium text-[#17352e]">
                  {experience.duration_days}{" "}
                  {experience.duration_days === 1 ? "day" : "days"}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Price
                </h2>
                <p className="mt-2 text-lg font-medium text-[#17352e]">
                  {experience.base_price
                    ? `${experience.currency} ${experience.base_price}`
                    : "Request a quote"}
                </p>
              </div>
            </div>
            <Link
              className="mt-6 inline-flex min-h-12 items-center rounded-lg bg-[#176B57] px-6 font-semibold text-white hover:bg-[#125744] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176B57]"
              href={`/inquiry?package=${encodeURIComponent(experience.slug)}`}
            >
              Request this experience
            </Link>

            <section className="mt-10">
              <h2 className="text-2xl font-semibold text-[#17352e]">
                About this experience
              </h2>
              <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-700">
                {experience.description}
              </p>
            </section>

            {experience.highlights.length > 0 && (
              <section className="mt-10">
                <h2 className="text-2xl font-semibold text-[#17352e]">
                  Highlights
                </h2>
                <ul className="mt-4 list-inside list-disc space-y-2 text-slate-700">
                  {experience.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </section>
            )}

            {experience.itinerary.length > 0 && (
              <section className="mt-10">
                <h2 className="text-2xl font-semibold text-[#17352e]">
                  Itinerary
                </h2>
                <ol className="mt-4 list-inside list-decimal space-y-3 text-slate-700">
                  {experience.itinerary.map((item, index) => (
                    <li key={`${index}-${item}`}>{item}</li>
                  ))}
                </ol>
              </section>
            )}

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {experience.inclusions.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-[#17352e]">
                    What’s included
                  </h2>
                  <ul className="mt-4 list-inside list-disc space-y-2 text-slate-700">
                    {experience.inclusions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}
              {experience.exclusions.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-[#17352e]">
                    What’s not included
                  </h2>
                  <ul className="mt-4 list-inside list-disc space-y-2 text-slate-700">
                    {experience.exclusions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {experience.important_information && (
              <section className="mt-10">
                <h2 className="text-xl font-semibold text-[#17352e]">
                  Important information
                </h2>
                <p className="mt-3 whitespace-pre-line leading-7 text-slate-700">
                  {experience.important_information}
                </p>
              </section>
            )}
            {experience.cancellation_terms && (
              <section className="mt-10">
                <h2 className="text-xl font-semibold text-[#17352e]">
                  Cancellation terms
                </h2>
                <p className="mt-3 whitespace-pre-line leading-7 text-slate-700">
                  {experience.cancellation_terms}
                </p>
              </section>
            )}
          </article>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
