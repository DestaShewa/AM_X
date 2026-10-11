import type { Pool } from "pg";

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

export interface PublicPackagePage {
  items: PublicPackage[];
  totalItems: number;
}

export interface PublicPackageRepository {
  listActive(page: number, pageSize: number): Promise<PublicPackagePage>;
  findActiveBySlug(slug: string): Promise<PublicPackage | null>;
}

interface PackageRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  destination: string;
  duration_days: number;
  highlights: unknown;
  itinerary: unknown;
  inclusions: unknown;
  exclusions: unknown;
  important_information: string | null;
  cancellation_terms: string | null;
  base_price: string | null;
  currency: string;
  media_references: unknown;
}

function stringArray(value: unknown, field: string): string[] {
  if (
    !Array.isArray(value) ||
    value.some((item) => typeof item !== "string" || item.trim() === "")
  ) {
    throw new Error(`Package ${field} must be an array of non-empty strings`);
  }
  return value;
}

function mediaArray(value: unknown): PackageMediaReference[] {
  if (!Array.isArray(value)) {
    throw new Error("Package media_references must be an array");
  }
  return value.map((item) => {
    if (
      !item ||
      typeof item !== "object" ||
      !("url" in item) ||
      typeof item.url !== "string" ||
      !("alt_text" in item) ||
      typeof item.alt_text !== "string" ||
      item.alt_text.trim() === ""
    ) {
      throw new Error("Package media references must include URL and alt text");
    }
    let mediaUrl: URL;
    try {
      mediaUrl = new URL(item.url);
    } catch {
      throw new Error("Package media reference URL must be an absolute HTTPS URL");
    }
    if (mediaUrl.protocol !== "https:") {
      throw new Error("Package media reference URL must use HTTPS");
    }
    return { url: mediaUrl.toString(), alt_text: item.alt_text };
  });
}

function mapPackage(row: PackageRow): PublicPackage {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    destination: row.destination,
    duration_days: row.duration_days,
    highlights: stringArray(row.highlights, "highlights"),
    itinerary: stringArray(row.itinerary, "itinerary"),
    inclusions: stringArray(row.inclusions, "inclusions"),
    exclusions: stringArray(row.exclusions, "exclusions"),
    important_information: row.important_information,
    cancellation_terms: row.cancellation_terms,
    base_price: row.base_price,
    currency: row.currency.trim(),
    media_references: mediaArray(row.media_references),
  };
}

const publicFields = `
  id, name, slug, description, destination, duration_days,
  highlights, itinerary, inclusions, exclusions,
  important_information, cancellation_terms, base_price, currency, media_references`;

export function createPublicPackageRepository(
  pool: Pool,
): PublicPackageRepository {
  return {
    async listActive(page, pageSize) {
      const offset = (page - 1) * pageSize;
      const [packagesResult, countResult] = await Promise.all([
        pool.query<PackageRow>(
          `SELECT ${publicFields}
           FROM packages
           WHERE status = 'ACTIVE'
           ORDER BY name ASC, slug ASC
           LIMIT $1 OFFSET $2`,
          [pageSize, offset],
        ),
        pool.query<{ total_items: number }>(
          "SELECT COUNT(*)::int AS total_items FROM packages WHERE status = 'ACTIVE'",
        ),
      ]);
      const totalItems = countResult.rows[0]?.total_items;
      if (totalItems === undefined) {
        throw new Error("Package count query returned no result");
      }
      return {
        items: packagesResult.rows.map(mapPackage),
        totalItems,
      };
    },

    async findActiveBySlug(slug) {
      const result = await pool.query<PackageRow>(
        `SELECT ${publicFields}
         FROM packages
         WHERE slug = $1 AND status = 'ACTIVE'`,
        [slug],
      );
      const row = result.rows[0];
      return row ? mapPackage(row) : null;
    },
  };
}
