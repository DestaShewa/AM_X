export interface PackageMediaReference {
  url: string;
  alt_text: string;
}

export interface PublicPackage {
  id: string;
  name: string;
  slug: string;
  description: string;
  destination: string;
  duration_days: number;
  highlights: string[];
  itinerary: string[];
  inclusions: string[];
  exclusions: string[];
  important_information: string | null;
  cancellation_terms: string | null;
  base_price: string | null;
  currency: string;
  media_references: PackageMediaReference[];
}

export interface PackagePage {
  data: PublicPackage[];
  meta: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
}

export class PackageNotFoundError extends Error {
  constructor() {
    super("This experience is not available.");
    this.name = "PackageNotFoundError";
  }
}

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1"
).replace(/\/+$/, "");

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string" && item.trim() !== "")
  );
}

function isMediaReferences(value: unknown): value is PackageMediaReference[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.url === "string" &&
        typeof item.alt_text === "string" &&
        item.alt_text.trim() !== "",
    )
  );
}

function isPublicPackage(value: unknown): value is PublicPackage {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.slug === "string" &&
    typeof value.description === "string" &&
    typeof value.destination === "string" &&
    typeof value.duration_days === "number" &&
    Number.isInteger(value.duration_days) &&
    isStringArray(value.highlights) &&
    isStringArray(value.itinerary) &&
    isStringArray(value.inclusions) &&
    isStringArray(value.exclusions) &&
    (typeof value.important_information === "string" ||
      value.important_information === null) &&
    (typeof value.cancellation_terms === "string" ||
      value.cancellation_terms === null) &&
    (typeof value.base_price === "string" || value.base_price === null) &&
    typeof value.currency === "string" &&
    isMediaReferences(value.media_references)
  );
}

function publicApiError(): Error {
  return new Error("Experiences are temporarily unavailable. Please try again.");
}

export async function getPublicPackages(
  page: number,
  pageSize: number,
): Promise<PackagePage> {
  let response: Response;
  try {
    response = await fetch(
      `${API_BASE_URL}/packages?page=${page}&page_size=${pageSize}`,
      { cache: "no-store" },
    );
  } catch {
    throw publicApiError();
  }
  if (!response.ok) {
    throw publicApiError();
  }

  const body: unknown = await response.json().catch(() => null);
  if (
    !isRecord(body) ||
    !Array.isArray(body.data) ||
    !body.data.every(isPublicPackage) ||
    !isRecord(body.meta) ||
    typeof body.meta.page !== "number" ||
    typeof body.meta.page_size !== "number" ||
    typeof body.meta.total_items !== "number" ||
    typeof body.meta.total_pages !== "number"
  ) {
    throw publicApiError();
  }

  return {
    data: body.data,
    meta: {
      page: body.meta.page,
      page_size: body.meta.page_size,
      total_items: body.meta.total_items,
      total_pages: body.meta.total_pages,
    },
  };
}

export async function getPublicPackage(slug: string): Promise<PublicPackage> {
  let response: Response;
  try {
    response = await fetch(
      `${API_BASE_URL}/packages/${encodeURIComponent(slug)}`,
      { cache: "no-store" },
    );
  } catch {
    throw publicApiError();
  }
  if (response.status === 404) {
    throw new PackageNotFoundError();
  }
  if (!response.ok) {
    throw publicApiError();
  }

  const body: unknown = await response.json().catch(() => null);
  if (!isRecord(body) || !isPublicPackage(body.data)) {
    throw publicApiError();
  }
  return body.data;
}
