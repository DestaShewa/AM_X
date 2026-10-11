"use client";

import { useEffect, useState } from "react";
import ExperienceCard from "../../components/experience-card";
import {
  getPublicPackages,
  type PublicPackage,
} from "../../lib/packages";

export default function ExperienceHighlights() {
  const [packages, setPackages] = useState<PublicPackage[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getPublicPackages(1, 3)
      .then((result) => {
        if (active) {
          setPackages(result.data);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Experiences are temporarily unavailable.",
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <p className="mt-8 text-slate-600" role="status">
        Loading experiences…
      </p>
    );
  }

  if (errorMessage) {
    return (
      <p className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-red-800" role="alert">
        {errorMessage}
      </p>
    );
  }

  if (packages.length === 0) {
    return (
      <p className="mt-8 rounded-xl border border-dashed border-[#176B57]/30 bg-white p-6 text-slate-700">
        Experiences are being prepared. Please check back soon.
      </p>
    );
  }

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((experience) => (
        <ExperienceCard experience={experience} key={experience.id} />
      ))}
    </div>
  );
}
