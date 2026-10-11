import Link from "next/link";
import SiteFooter from "../../components/site-footer";
import SiteHeader from "../../components/site-header";

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-[65vh] max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#176B57]">
          Privacy
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#17352e] sm:text-5xl">
          Privacy Notice
        </h1>
        <div className="mt-8 space-y-6 leading-7 text-slate-700">
          <p>
            When you submit an experience inquiry, AMX collects the contact and
            trip details you provide, including your name, phone number, any
            optional email address, and your trip preferences.
          </p>
          <p>
            AMX uses these details to receive and respond to your inquiry,
            discuss availability, and prepare a quotation. Please do not include
            sensitive personal information in the optional requests fields.
          </p>
          <p>
            By selecting the consent box on the inquiry form, you agree to this
            use of the information you submit. The inquiry records the time of
            your consent and the version of this notice shown when you submitted.
          </p>
          <p>
            For questions about an inquiry, contact AMX and provide the inquiry
            reference shown after submission.
          </p>
          <p className="text-sm text-slate-500">
            Notice version: 2026-10-11-v1
          </p>
        </div>
        <Link
          className="mt-8 inline-flex min-h-11 items-center rounded-lg border border-[#176B57] px-5 font-semibold text-[#176B57] hover:bg-[#176B57]/5"
          href="/inquiry"
        >
          Return to inquiry form
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
