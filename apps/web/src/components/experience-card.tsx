import Image from "next/image";
import Link from "next/link";
import type { PublicPackage } from "../lib/packages";

export default function ExperienceCard({
  experience,
}: {
  experience: PublicPackage;
}) {
  const media = experience.media_references[0];

  return (
    <article className="overflow-hidden rounded-2xl border border-[#176B57]/15 bg-white shadow-sm">
      {media ? (
        <Image
          alt={media.alt_text}
          className="aspect-[16/9] w-full object-cover"
          height={450}
          src={media.url}
          unoptimized
          width={800}
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex aspect-[16/9] items-end bg-gradient-to-br from-[#176B57] to-[#8eaa79] p-6"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.15em] text-white/90">
            {experience.destination}
          </span>
        </div>
      )}
      <div className="p-6">
        <p className="text-sm font-medium text-[#176B57]">
          {experience.destination}
        </p>
        <h2 className="mt-2 text-xl font-semibold text-[#17352e]">
          {experience.name}
        </h2>
        <p className="mt-3 line-clamp-3 leading-6 text-slate-600">
          {experience.description}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-700">
          <span>
            {experience.duration_days}{" "}
            {experience.duration_days === 1 ? "day" : "days"}
          </span>
          <span>
            {experience.base_price
              ? `From ${experience.currency} ${experience.base_price}`
              : "Request a quote"}
          </span>
        </div>
        {experience.highlights.length > 0 && (
          <p className="mt-3 text-sm text-slate-600">
            {experience.highlights.slice(0, 2).join(" · ")}
          </p>
        )}
        <Link
          className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-[#176B57] px-5 py-2.5 font-semibold text-white transition hover:bg-[#125744] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176B57]"
          href={`/experiences/${encodeURIComponent(experience.slug)}`}
        >
          View experience
        </Link>
      </div>
    </article>
  );
}
