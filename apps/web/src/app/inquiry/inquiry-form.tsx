"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";
import {
  getPublicPackage,
  type PublicPackage,
} from "../../lib/packages";
import {
  InquirySubmissionError,
  submitPublicInquiry,
  type InquiryFieldError,
  type PreferredContactMethod,
  type PublicInquirySubmission,
} from "../../lib/inquiries";

interface PreviousSubmission {
  key: string;
  payload: string;
}

function addLocalDate(days: number): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Addis_Ababa",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = new Map(parts.map((part) => [part.type, part.value]));
  const localDate = new Date(
    `${values.get("year")}-${values.get("month")}-${values.get("day")}T00:00:00Z`,
  );
  localDate.setUTCDate(localDate.getUTCDate() + days);
  return localDate.toISOString().slice(0, 10);
}

function fieldText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function fieldErrorFor(
  errors: InquiryFieldError[],
  field: string,
): string | undefined {
  return errors.find((error) => error.field === field)?.issue;
}

function isPreferredContactMethod(
  value: string,
): value is PreferredContactMethod {
  return value === "PHONE" || value === "WHATSAPP" || value === "EMAIL";
}

export default function InquiryForm() {
  const searchParams = useSearchParams();
  const packageSlug = searchParams.get("package");
  const [dismissedPackage, setDismissedPackage] = useState(false);
  const selectedPackageSlug = dismissedPackage ? null : packageSlug;
  const [packageResult, setPackageResult] = useState<
    | { slug: string; status: "ready"; experience: PublicPackage }
    | { slug: string; status: "error" }
    | null
  >(null);
  const packageState = !selectedPackageSlug
    ? "none"
    : packageResult?.slug === selectedPackageSlug
      ? packageResult.status
      : "loading";
  const experience =
    packageResult?.slug === selectedPackageSlug &&
    packageResult.status === "ready"
      ? packageResult.experience
      : null;
  const [fieldErrors, setFieldErrors] = useState<InquiryFieldError[]>([]);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    reference: string;
    createdAt: string;
  } | null>(null);
  const previousSubmission = useRef<PreviousSubmission | null>(null);
  const minimumTravelDate = addLocalDate(1);

  useEffect(() => {
    if (!selectedPackageSlug) {
      return;
    }
    let active = true;
    getPublicPackage(selectedPackageSlug)
      .then((result) => {
        if (active) {
          setPackageResult({
            slug: selectedPackageSlug,
            status: "ready",
            experience: result,
          });
        }
      })
      .catch(() => {
        if (active) {
          setPackageResult({ slug: selectedPackageSlug, status: "error" });
        }
      });
    return () => {
      active = false;
    };
  }, [selectedPackageSlug]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors([]);
    setSubmitError("");

    const formData = new FormData(event.currentTarget);
    const email = fieldText(formData, "email");
    const amount = fieldText(formData, "budget_amount");
    const contactMethod = fieldText(formData, "preferred_contact_method");
    if (!isPreferredContactMethod(contactMethod)) {
      setFieldErrors([
        {
          field: "preferred_contact_method",
          issue: "Choose a valid contact method.",
        },
      ]);
      return;
    }
    if (formData.get("privacy_consent") !== "on") {
      setFieldErrors([
        {
          field: "privacy_consent",
          issue: "Consent is required to submit this inquiry.",
        },
      ]);
      return;
    }
    const input: PublicInquirySubmission = {
      customer_name: fieldText(formData, "customer_name"),
      phone: fieldText(formData, "phone"),
      email: email || null,
      preferred_contact_method: contactMethod,
      package_id: experience?.id ?? null,
      travel_date: fieldText(formData, "travel_date"),
      traveler_count: Number(fieldData(formData, "traveler_count")),
      duration_days: Number(fieldData(formData, "duration_days")),
      arrival_location: fieldText(formData, "arrival_location"),
      budget_amount: amount || null,
      interests: fieldText(formData, "interests") || null,
      hotel_required: fieldText(formData, "hotel_required") === "true",
      transport_required: fieldText(formData, "transport_required") === "true",
      special_requests: fieldText(formData, "special_requests") || null,
      privacy_consent: true,
    };
    const payload = JSON.stringify(input);
    const key =
      previousSubmission.current?.payload === payload
        ? previousSubmission.current.key
        : crypto.randomUUID();
    previousSubmission.current = { key, payload };

    setSubmitting(true);
    try {
      const result = await submitPublicInquiry(input, key);
      setConfirmation({
        reference: result.reference,
        createdAt: result.created_at,
      });
      previousSubmission.current = null;
    } catch (error: unknown) {
      if (error instanceof InquirySubmissionError) {
        setSubmitError(error.message);
        setFieldErrors(error.fieldErrors);
      } else {
        setSubmitError("The inquiry could not be submitted. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function removeExperience() {
    setDismissedPackage(true);
  }

  if (confirmation) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto min-h-[65vh] max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
          <section className="rounded-2xl border border-emerald-200 bg-white p-7 shadow-sm sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#176B57]">
              Inquiry received
            </p>
            <h1 className="mt-3 text-3xl font-bold text-[#17352e]">
              Thank you for contacting AMX
            </h1>
            <p className="mt-4 leading-7 text-slate-700">
              Your request has been recorded. Our team will use the contact
              details you provided to discuss your trip and prepare a quotation.
            </p>
            <p className="mt-6 rounded-xl bg-[#f7f8f6] p-5 text-slate-800">
              Reference:{" "}
              <strong className="font-semibold">{confirmation.reference}</strong>
            </p>
            <p className="mt-3 text-sm text-slate-600">
              Received{" "}
              {new Intl.DateTimeFormat("en", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(confirmation.createdAt))}
            </p>
            <Link
              className="mt-7 inline-flex min-h-11 items-center rounded-lg bg-[#176B57] px-5 font-semibold text-white hover:bg-[#125744] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176B57]"
              href="/experiences"
            >
              Browse experiences
            </Link>
          </section>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-[65vh] max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#176B57]">
            Plan your trip
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#17352e] sm:text-5xl">
            Tell us about your Arba Minch experience
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Share your trip details and our team will contact you to discuss
            availability and prepare a quotation.
          </p>
        </header>

        {packageState === "loading" && (
          <p className="mt-8 text-slate-600" role="status">
            Loading selected experience…
          </p>
        )}
        {packageState === "error" && (
          <div className="mt-8 rounded-xl border border-amber-300 bg-amber-50 p-5 text-amber-950">
            <p role="alert">
              The selected experience is unavailable. You can submit a custom
              trip request without it.
            </p>
            <button
              className="mt-3 font-semibold underline"
              onClick={removeExperience}
              type="button"
            >
              Continue without a selected experience
            </button>
          </div>
        )}
        {experience && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#176B57]/20 bg-white p-5">
            <p className="text-slate-800">
              Requesting: <strong>{experience.name}</strong>
            </p>
            <button
              className="text-sm font-semibold text-[#176B57] underline"
              onClick={removeExperience}
              type="button"
            >
              Remove experience
            </button>
          </div>
        )}

        <form
          className="mt-9 space-y-9 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9"
          onSubmit={(event) => void handleSubmit(event)}
        >
          <fieldset className="grid gap-5 sm:grid-cols-2">
            <legend className="mb-4 text-xl font-semibold text-[#17352e]">
              Contact details
            </legend>
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Full name <span className="sr-only">(required)</span>
              <input
                autoComplete="name"
                className="min-h-12 rounded-lg border border-slate-300 px-3 text-base"
                maxLength={150}
                name="customer_name"
                required
              />
              {fieldErrorFor(fieldErrors, "customer_name") && (
                <span className="text-sm text-red-700">
                  {fieldErrorFor(fieldErrors, "customer_name")}
                </span>
              )}
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Phone number
              <input
                autoComplete="tel"
                className="min-h-12 rounded-lg border border-slate-300 px-3 text-base"
                maxLength={30}
                name="phone"
                required
                type="tel"
              />
              {fieldErrorFor(fieldErrors, "phone") && (
                <span className="text-sm text-red-700">
                  {fieldErrorFor(fieldErrors, "phone")}
                </span>
              )}
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Email address <span className="font-normal">(optional)</span>
              <input
                autoComplete="email"
                className="min-h-12 rounded-lg border border-slate-300 px-3 text-base"
                maxLength={255}
                name="email"
                type="email"
              />
              {fieldErrorFor(fieldErrors, "email") && (
                <span className="text-sm text-red-700">
                  {fieldErrorFor(fieldErrors, "email")}
                </span>
              )}
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Preferred contact method
              <select
                className="min-h-12 rounded-lg border border-slate-300 bg-white px-3 text-base"
                name="preferred_contact_method"
                required
              >
                <option value="PHONE">Phone</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="EMAIL">Email</option>
              </select>
              {fieldErrorFor(fieldErrors, "preferred_contact_method") && (
                <span className="text-sm text-red-700">
                  {fieldErrorFor(fieldErrors, "preferred_contact_method")}
                </span>
              )}
            </label>
          </fieldset>

          <fieldset className="grid gap-5 sm:grid-cols-2">
            <legend className="mb-4 text-xl font-semibold text-[#17352e]">
              Trip details
            </legend>
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Travel date
              <input
                className="min-h-12 rounded-lg border border-slate-300 px-3 text-base"
                min={minimumTravelDate}
                name="travel_date"
                required
                type="date"
              />
              {fieldErrorFor(fieldErrors, "travel_date") && (
                <span className="text-sm text-red-700">
                  {fieldErrorFor(fieldErrors, "travel_date")}
                </span>
              )}
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Number of travelers
              <input
                className="min-h-12 rounded-lg border border-slate-300 px-3 text-base"
                min="1"
                name="traveler_count"
                required
                step="1"
                type="number"
              />
              {fieldErrorFor(fieldErrors, "traveler_count") && (
                <span className="text-sm text-red-700">
                  {fieldErrorFor(fieldErrors, "traveler_count")}
                </span>
              )}
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Number of days
              <input
                className="min-h-12 rounded-lg border border-slate-300 px-3 text-base"
                min="1"
                name="duration_days"
                required
                step="1"
                type="number"
              />
              {fieldErrorFor(fieldErrors, "duration_days") && (
                <span className="text-sm text-red-700">
                  {fieldErrorFor(fieldErrors, "duration_days")}
                </span>
              )}
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Arrival location
              <input
                className="min-h-12 rounded-lg border border-slate-300 px-3 text-base"
                maxLength={255}
                name="arrival_location"
                required
              />
              {fieldErrorFor(fieldErrors, "arrival_location") && (
                <span className="text-sm text-red-700">
                  {fieldErrorFor(fieldErrors, "arrival_location")}
                </span>
              )}
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Budget in ETB <span className="font-normal">(optional)</span>
              <input
                className="min-h-12 rounded-lg border border-slate-300 px-3 text-base"
                inputMode="decimal"
                name="budget_amount"
                pattern="[0-9]+(\.[0-9]{1,2})?"
                placeholder="e.g. 12000.00"
                type="text"
              />
              {fieldErrorFor(fieldErrors, "budget_amount") && (
                <span className="text-sm text-red-700">
                  {fieldErrorFor(fieldErrors, "budget_amount")}
                </span>
              )}
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-800 sm:col-span-2">
              Interests <span className="font-normal">(optional)</span>
              <textarea
                className="min-h-24 rounded-lg border border-slate-300 p-3 text-base"
                maxLength={5000}
                name="interests"
              />
              {fieldErrorFor(fieldErrors, "interests") && (
                <span className="text-sm text-red-700">
                  {fieldErrorFor(fieldErrors, "interests")}
                </span>
              )}
            </label>
          </fieldset>

          <fieldset className="grid gap-5 sm:grid-cols-2">
            <legend className="mb-4 text-xl font-semibold text-[#17352e]">
              Preferences
            </legend>
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Do you need accommodation?
              <select
                className="min-h-12 rounded-lg border border-slate-300 bg-white px-3 text-base"
                name="hotel_required"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-800">
              Do you need transport?
              <select
                className="min-h-12 rounded-lg border border-slate-300 bg-white px-3 text-base"
                name="transport_required"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-800 sm:col-span-2">
              Special requests <span className="font-normal">(optional)</span>
              <textarea
                className="min-h-28 rounded-lg border border-slate-300 p-3 text-base"
                maxLength={10000}
                name="special_requests"
              />
              {fieldErrorFor(fieldErrors, "special_requests") && (
                <span className="text-sm text-red-700">
                  {fieldErrorFor(fieldErrors, "special_requests")}
                </span>
              )}
            </label>
          </fieldset>

          <div className="space-y-2">
            <label className="flex items-start gap-3 text-sm leading-6 text-slate-700">
              <input
                className="mt-1 size-4 accent-[#176B57]"
                name="privacy_consent"
                required
                type="checkbox"
              />
              <span>
                I have read the{" "}
                <Link
                  className="font-semibold text-[#176B57] underline"
                  href="/privacy"
                  target="_blank"
                  rel="noreferrer"
                >
                  Privacy Notice
                </Link>{" "}
                and consent to AMX using the details I submit to respond to this
                inquiry.
              </span>
            </label>
            {fieldErrorFor(fieldErrors, "privacy_consent") && (
              <p className="text-sm text-red-700">
                {fieldErrorFor(fieldErrors, "privacy_consent")}
              </p>
            )}
          </div>

          {submitError && (
            <div
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"
              role="alert"
            >
              {submitError}
            </div>
          )}
          <button
            className="inline-flex min-h-12 items-center rounded-lg bg-[#176B57] px-6 font-semibold text-white hover:bg-[#125744] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176B57] disabled:cursor-wait disabled:opacity-60"
            disabled={submitting || packageState === "loading"}
            type="submit"
          >
            {submitting ? "Sending inquiry…" : "Submit inquiry"}
          </button>
        </form>
      </main>
      <SiteFooter />
    </>
  );
}

function fieldData(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}
