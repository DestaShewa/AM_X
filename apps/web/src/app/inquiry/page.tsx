import { Suspense } from "react";
import InquiryForm from "./inquiry-form";

export default function InquiryPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto min-h-[65vh] max-w-4xl px-5 py-12 text-slate-600 sm:px-8 sm:py-16">
          Loading inquiry form…
        </main>
      }
    >
      <InquiryForm />
    </Suspense>
  );
}
