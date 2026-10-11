import { Suspense } from "react";
import ExperienceDetails from "./details";

export default function ExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto min-h-[65vh] max-w-5xl px-5 py-10 text-slate-600 sm:px-8 sm:py-14">
          Loading experience…
        </main>
      }
    >
      <ResolvedExperiencePage params={params} />
    </Suspense>
  );
}

async function ResolvedExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ExperienceDetails slug={slug} />;
}
