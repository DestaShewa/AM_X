"use client";

import { useEffect, useState } from "react";
import ExperienceCard from "../../components/experience-card";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import {
  getPublicPackages,
  type PackagePage,
} from "../../lib/packages";

const PAGE_SIZE = 12;

export default function ExperiencesListing() {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<{
    page: number;
    retryCount: number;
    result: PackagePage;
  } | null>(null);
  const [error, setError] = useState<{
    page: number;
    retryCount: number;
    message: string;
  } | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const resultMatches =
    result !== null &&
    result.page === page &&
    result.retryCount === retryCount;
  const errorMatches =
    error !== null && error.page === page && error.retryCount === retryCount;
  const loading = !resultMatches && !errorMatches;
  const errorMessage =
    error?.page === page && error.retryCount === retryCount
      ? error.message
      : "";

  useEffect(() => {
    let active = true;
    getPublicPackages(page, PAGE_SIZE)
      .then((response) => {
        if (active) {
          setResult({ page, retryCount, result: response });
          setError(null);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setError({
            page,
            retryCount,
            message:
              error instanceof Error
                ? error.message
                : "Experiences are temporarily unavailable. Please try again.",
          });
        }
      });
    return () => {
      active = false;
    };
  }, [page, retryCount]);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-[65vh] max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#176B57]">
            Local experiences
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#17352e] sm:text-5xl">
            Explore Arba Minch experiences
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Find an experience that fits your interests. Package prices are
            shown only when their starting basis has been confirmed.
          </p>
        </header>

        {loading ? (
          <p className="mt-10 text-slate-600" role="status">
            Loading experiences…
          </p>
        ) : errorMessage ? (
          <div className="mt-10 rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="text-red-800" role="alert">
              {errorMessage}
            </p>
            <button
              className="mt-4 min-h-11 rounded-lg border border-red-700 px-4 font-semibold text-red-800 hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
              onClick={() => setRetryCount((currentCount) => currentCount + 1)}
              type="button"
            >
              Try again
            </button>
          </div>
        ) : resultMatches && result.result.data.length > 0 ? (
          <>
            <section
              aria-label="Available experiences"
              className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {result.result.data.map((experience) => (
                <ExperienceCard experience={experience} key={experience.id} />
              ))}
            </section>
            {result.result.meta.total_pages > 1 && (
              <nav
                aria-label="Experience pages"
                className="mt-10 flex items-center justify-center gap-4"
              >
                <button
                  className="min-h-11 rounded-lg border border-[#176B57] px-4 font-semibold text-[#176B57] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={page <= 1}
                  onClick={() => setPage((currentPage) => currentPage - 1)}
                  type="button"
                >
                  Previous
                </button>
                <span aria-live="polite" className="text-sm text-slate-700">
                  Page {result.result.meta.page} of {result.result.meta.total_pages}
                </span>
                <button
                  className="min-h-11 rounded-lg border border-[#176B57] px-4 font-semibold text-[#176B57] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={page >= result.result.meta.total_pages}
                  onClick={() => setPage((currentPage) => currentPage + 1)}
                  type="button"
                >
                  Next
                </button>
              </nav>
            )}
          </>
        ) : resultMatches && result.result.data.length === 0 ? (
          <section className="mt-10 rounded-2xl border border-dashed border-[#176B57]/30 bg-white p-8 sm:p-12">
            <h2 className="text-xl font-semibold text-[#17352e]">
              Experiences are being prepared
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              There are no published experiences to show right now. Please
              check back soon.
            </p>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
