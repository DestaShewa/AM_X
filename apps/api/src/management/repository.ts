import type { Pool, PoolClient } from "pg";
import {
  type PackageMediaReference,
  type PublicPackage,
} from "../packages/repository.js";

export type PackageStatus = "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
export type ProviderStatus = "ACTIVE" | "SUSPENDED" | "INACTIVE";
export type ProviderVerificationStatus = "UNVERIFIED" | "VERIFIED";
export type ProviderAgreementStatus = "PENDING" | "ACTIVE" | "INACTIVE";

export class InvalidProviderAssignmentError extends Error {
  constructor() {
    super("One or more assigned providers do not exist");
    this.name = "InvalidProviderAssignmentError";
  }
}

export interface PackageInput {
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
  provider_ids: string[];
}

export type PackageUpdate = Partial<PackageInput>;

export interface ManagedPackage extends PublicPackage {
  status: PackageStatus;
  provider_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface ProviderInput {
  name: string;
  provider_type: string;
  phone: string;
  email: string | null;
  location: string;
  languages: string[];
  services_offered: string[];
  pricing_notes: string | null;
  availability_notes: string | null;
  license_details: string | null;
  qualification_details: string | null;
  agreement_status: ProviderAgreementStatus;
  commission_terms: string | null;
  notes: string | null;
}

export type ProviderUpdate = Partial<ProviderInput>;

export interface ManagedProvider extends ProviderInput {
  id: string;
  verification_status: ProviderVerificationStatus;
  status: ProviderStatus;
  created_at: string;
  updated_at: string;
}

export interface ManagementRepository {
  listPackages(page: number, pageSize: number): Promise<{
    items: ManagedPackage[];
    totalItems: number;
  }>;
  getPackage(id: string): Promise<ManagedPackage | null>;
  createPackage(input: PackageInput, actorId: string): Promise<ManagedPackage>;
  updatePackage(
    id: string,
    input: PackageUpdate,
    actorId: string,
  ): Promise<ManagedPackage | null>;
  updatePackageStatus(
    id: string,
    status: PackageStatus,
    actorId: string,
  ): Promise<ManagedPackage | null>;
  listProviders(page: number, pageSize: number): Promise<{
    items: ManagedProvider[];
    totalItems: number;
  }>;
  getProvider(id: string): Promise<ManagedProvider | null>;
  createProvider(input: ProviderInput, actorId: string): Promise<ManagedProvider>;
  updateProvider(
    id: string,
    input: ProviderUpdate,
    actorId: string,
  ): Promise<ManagedProvider | null>;
  updateProviderStatus(
    id: string,
    status: ProviderStatus,
    actorId: string,
  ): Promise<ManagedProvider | null>;
  updateProviderVerification(
    id: string,
    status: ProviderVerificationStatus,
    actorId: string,
  ): Promise<ManagedProvider | null>;
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
  status: PackageStatus;
  provider_ids: string[];
  created_at: Date;
  updated_at: Date;
}

interface ProviderRow {
  id: string;
  name: string;
  provider_type: string;
  phone: string;
  email: string | null;
  location: string;
  languages: unknown;
  services_offered: unknown;
  pricing_notes: string | null;
  availability_notes: string | null;
  verification_status: ProviderVerificationStatus;
  license_details: string | null;
  qualification_details: string | null;
  agreement_status: ProviderAgreementStatus;
  commission_terms: string | null;
  notes: string | null;
  status: ProviderStatus;
  created_at: Date;
  updated_at: Date;
}

function stringArray(value: unknown, field: string): string[] {
  if (
    !Array.isArray(value) ||
    value.some((item) => typeof item !== "string" || item.trim() === "")
  ) {
    throw new Error(`Provider/package ${field} must be an array of non-empty strings`);
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
    const mediaUrl = new URL(item.url);
    if (mediaUrl.protocol !== "https:") {
      throw new Error("Package media reference URL must use HTTPS");
    }
    return { url: mediaUrl.toString(), alt_text: item.alt_text };
  });
}

function mapPackage(row: PackageRow): ManagedPackage {
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
    status: row.status,
    provider_ids: row.provider_ids,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  };
}

function mapProvider(row: ProviderRow): ManagedProvider {
  return {
    id: row.id,
    name: row.name,
    provider_type: row.provider_type,
    phone: row.phone,
    email: row.email,
    location: row.location,
    languages: stringArray(row.languages, "languages"),
    services_offered: stringArray(row.services_offered, "services_offered"),
    pricing_notes: row.pricing_notes,
    availability_notes: row.availability_notes,
    verification_status: row.verification_status,
    license_details: row.license_details,
    qualification_details: row.qualification_details,
    agreement_status: row.agreement_status,
    commission_terms: row.commission_terms,
    notes: row.notes,
    status: row.status,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  };
}

const packageFields = `
  p.id, p.name, p.slug, p.description, p.destination, p.duration_days,
  p.highlights, p.itinerary, p.inclusions, p.exclusions,
  p.important_information, p.cancellation_terms, p.base_price, p.currency,
  p.media_references, p.status, p.created_at, p.updated_at,
  ARRAY(
    SELECT pp.provider_id
    FROM package_providers pp
    WHERE pp.package_id = p.id
    ORDER BY pp.provider_id
  ) AS provider_ids`;

const providerFields = `
  id, name, provider_type, phone, email, location, languages, services_offered,
  pricing_notes, availability_notes, verification_status, license_details,
  qualification_details, agreement_status, commission_terms, notes, status,
  created_at, updated_at`;

async function writeAudit(
  client: PoolClient,
  actorId: string,
  action: string,
  entityType: string,
  entityId: string,
  changedFields: string[],
  details: Record<string, string> = {},
): Promise<void> {
  await client.query(
    `INSERT INTO audit_logs
       (user_id, action, entity_type, entity_id, change_summary)
     VALUES ($1, $2, $3, $4, $5::jsonb)`,
    [
      actorId,
      action,
      entityType,
      entityId,
      JSON.stringify({ changed_fields: changedFields, ...details }),
    ],
  );
}

async function packageById(
  client: PoolClient,
  id: string,
): Promise<PackageRow | null> {
  const result = await client.query<PackageRow>(
    `SELECT ${packageFields} FROM packages p WHERE p.id = $1`,
    [id],
  );
  return result.rows[0] ?? null;
}

async function providerById(
  client: PoolClient,
  id: string,
): Promise<ProviderRow | null> {
  const result = await client.query<ProviderRow>(
    `SELECT ${providerFields} FROM providers WHERE id = $1`,
    [id],
  );
  return result.rows[0] ?? null;
}

async function replacePackageProviders(
  client: PoolClient,
  packageId: string,
  providerIds: string[],
): Promise<void> {
  if (providerIds.length > 0) {
    const result = await client.query<{ id: string }>(
      "SELECT id FROM providers WHERE id = ANY($1::uuid[])",
      [providerIds],
    );
    if (result.rows.length !== providerIds.length) {
      throw new InvalidProviderAssignmentError();
    }
  }
  await client.query("DELETE FROM package_providers WHERE package_id = $1", [
    packageId,
  ]);
  if (providerIds.length > 0) {
    await client.query(
      `INSERT INTO package_providers (package_id, provider_id)
       SELECT $1, provider_id
       FROM unnest($2::uuid[]) AS provider_id`,
      [packageId, providerIds],
    );
  }
}

function transaction<T>(
  pool: Pool,
  run: (client: PoolClient) => Promise<T>,
): Promise<T> {
  return (async () => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const result = await run(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  })();
}

export function createManagementRepository(pool: Pool): ManagementRepository {
  return {
    async listPackages(page, pageSize) {
      const offset = (page - 1) * pageSize;
      const [packagesResult, countResult] = await Promise.all([
        pool.query<PackageRow>(
          `SELECT ${packageFields}
           FROM packages p
           ORDER BY p.updated_at DESC, p.id ASC
           LIMIT $1 OFFSET $2`,
          [pageSize, offset],
        ),
        pool.query<{ total_items: number }>(
          "SELECT COUNT(*)::int AS total_items FROM packages",
        ),
      ]);
      const totalItems = countResult.rows[0]?.total_items;
      if (totalItems === undefined) {
        throw new Error("Package count query returned no result");
      }
      return { items: packagesResult.rows.map(mapPackage), totalItems };
    },

    async getPackage(id) {
      const result = await pool.query<PackageRow>(
        `SELECT ${packageFields} FROM packages p WHERE p.id = $1`,
        [id],
      );
      const row = result.rows[0];
      return row ? mapPackage(row) : null;
    },

    async createPackage(input, actorId) {
      return transaction(pool, async (client) => {
        const result = await client.query<{ id: string }>(
          `INSERT INTO packages
             (name, slug, description, destination, duration_days, highlights,
              itinerary, inclusions, exclusions, important_information,
              cancellation_terms, base_price, currency, media_references)
           VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8::jsonb,
                   $9::jsonb, $10, $11, $12, $13, $14::jsonb)
           RETURNING id`,
          [
            input.name,
            input.slug,
            input.description,
            input.destination,
            input.duration_days,
            JSON.stringify(input.highlights),
            JSON.stringify(input.itinerary),
            JSON.stringify(input.inclusions),
            JSON.stringify(input.exclusions),
            input.important_information,
            input.cancellation_terms,
            input.base_price,
            input.currency,
            JSON.stringify(input.media_references),
          ],
        );
        const id = result.rows[0]?.id;
        if (!id) {
          throw new Error("Package creation returned no identifier");
        }
        await replacePackageProviders(client, id, input.provider_ids);
        await writeAudit(
          client,
          actorId,
          "package.created",
          "package",
          id,
          Object.keys(input),
        );
        const row = await packageById(client, id);
        if (!row) {
          throw new Error("Created package could not be retrieved");
        }
        return mapPackage(row);
      });
    },

    async updatePackage(id, input, actorId) {
      return transaction(pool, async (client) => {
        const before = await packageById(client, id);
        if (!before) {
          return null;
        }
        const fields: Record<string, unknown> = { ...input };
        delete fields.provider_ids;
        const columns: Record<string, string> = {
          name: "name",
          slug: "slug",
          description: "description",
          destination: "destination",
          duration_days: "duration_days",
          highlights: "highlights",
          itinerary: "itinerary",
          inclusions: "inclusions",
          exclusions: "exclusions",
          important_information: "important_information",
          cancellation_terms: "cancellation_terms",
          base_price: "base_price",
          currency: "currency",
          media_references: "media_references",
        };
        const entries = Object.entries(fields);
        if (entries.length > 0) {
          const assignments = entries.map(([field], index) => {
            const column = columns[field];
            if (!column) {
              throw new Error(`Unsupported package update field: ${field}`);
            }
            const cast = [
              "highlights",
              "itinerary",
              "inclusions",
              "exclusions",
              "media_references",
            ].includes(field)
              ? "::jsonb"
              : "";
            return `${column} = $${index + 1}${cast}`;
          });
          const values = entries.map(([field, value]) =>
            [
              "highlights",
              "itinerary",
              "inclusions",
              "exclusions",
              "media_references",
            ].includes(field)
              ? JSON.stringify(value)
              : value,
          );
          await client.query(
            `UPDATE packages
             SET ${assignments.join(", ")}, updated_at = NOW()
             WHERE id = $${entries.length + 1}`,
            [...values, id],
          );
        }
        if (input.provider_ids !== undefined) {
          await replacePackageProviders(client, id, input.provider_ids);
        }
        const changedFields = Object.keys(input);
        if (changedFields.length > 0) {
          await writeAudit(
            client,
            actorId,
            "package.updated",
            "package",
            id,
            changedFields,
          );
        }
        const row = await packageById(client, id);
        if (!row) {
          throw new Error("Updated package could not be retrieved");
        }
        return mapPackage(row);
      });
    },

    async updatePackageStatus(id, status, actorId) {
      return transaction(pool, async (client) => {
        const before = await packageById(client, id);
        if (!before) {
          return null;
        }
        if (before.status !== status) {
          await client.query(
            "UPDATE packages SET status = $1, updated_at = NOW() WHERE id = $2",
            [status, id],
          );
          await writeAudit(
            client,
            actorId,
            "package.status.updated",
            "package",
            id,
            ["status"],
            { from_status: before.status, to_status: status },
          );
        }
        const row = await packageById(client, id);
        if (!row) {
          throw new Error("Updated package could not be retrieved");
        }
        return mapPackage(row);
      });
    },

    async listProviders(page, pageSize) {
      const offset = (page - 1) * pageSize;
      const [providersResult, countResult] = await Promise.all([
        pool.query<ProviderRow>(
          `SELECT ${providerFields} FROM providers
           ORDER BY updated_at DESC, id ASC
           LIMIT $1 OFFSET $2`,
          [pageSize, offset],
        ),
        pool.query<{ total_items: number }>(
          "SELECT COUNT(*)::int AS total_items FROM providers",
        ),
      ]);
      const totalItems = countResult.rows[0]?.total_items;
      if (totalItems === undefined) {
        throw new Error("Provider count query returned no result");
      }
      return { items: providersResult.rows.map(mapProvider), totalItems };
    },

    async getProvider(id) {
      const result = await pool.query<ProviderRow>(
        `SELECT ${providerFields} FROM providers WHERE id = $1`,
        [id],
      );
      const row = result.rows[0];
      return row ? mapProvider(row) : null;
    },

    async createProvider(input, actorId) {
      return transaction(pool, async (client) => {
        const result = await client.query<{ id: string }>(
          `INSERT INTO providers
             (name, provider_type, phone, email, location, languages,
              services_offered, pricing_notes, availability_notes,
              license_details, qualification_details, agreement_status,
              commission_terms, notes)
           VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8, $9, $10,
                   $11, $12, $13, $14)
           RETURNING id`,
          [
            input.name,
            input.provider_type,
            input.phone,
            input.email,
            input.location,
            JSON.stringify(input.languages),
            JSON.stringify(input.services_offered),
            input.pricing_notes,
            input.availability_notes,
            input.license_details,
            input.qualification_details,
            input.agreement_status,
            input.commission_terms,
            input.notes,
          ],
        );
        const id = result.rows[0]?.id;
        if (!id) {
          throw new Error("Provider creation returned no identifier");
        }
        await writeAudit(
          client,
          actorId,
          "provider.created",
          "provider",
          id,
          Object.keys(input),
        );
        const row = await providerById(client, id);
        if (!row) {
          throw new Error("Created provider could not be retrieved");
        }
        return mapProvider(row);
      });
    },

    async updateProvider(id, input, actorId) {
      return transaction(pool, async (client) => {
        const before = await providerById(client, id);
        if (!before) {
          return null;
        }
        const columns: Record<string, string> = {
          name: "name",
          provider_type: "provider_type",
          phone: "phone",
          email: "email",
          location: "location",
          languages: "languages",
          services_offered: "services_offered",
          pricing_notes: "pricing_notes",
          availability_notes: "availability_notes",
          license_details: "license_details",
          qualification_details: "qualification_details",
          agreement_status: "agreement_status",
          commission_terms: "commission_terms",
          notes: "notes",
        };
        const entries = Object.entries(input);
        if (entries.length > 0) {
          const assignments = entries.map(([field], index) => {
            const column = columns[field];
            if (!column) {
              throw new Error(`Unsupported provider update field: ${field}`);
            }
            const cast = ["languages", "services_offered"].includes(field)
              ? "::jsonb"
              : "";
            return `${column} = $${index + 1}${cast}`;
          });
          const values = entries.map(([field, value]) =>
            ["languages", "services_offered"].includes(field)
              ? JSON.stringify(value)
              : value,
          );
          await client.query(
            `UPDATE providers
             SET ${assignments.join(", ")}, updated_at = NOW()
             WHERE id = $${entries.length + 1}`,
            [...values, id],
          );
        }
        if (entries.length > 0) {
          await writeAudit(
            client,
            actorId,
            "provider.updated",
            "provider",
            id,
            entries.map(([field]) => field),
          );
        }
        const row = await providerById(client, id);
        if (!row) {
          throw new Error("Updated provider could not be retrieved");
        }
        return mapProvider(row);
      });
    },

    async updateProviderStatus(id, status, actorId) {
      return transaction(pool, async (client) => {
        const before = await providerById(client, id);
        if (!before) {
          return null;
        }
        if (before.status !== status) {
          await client.query(
            "UPDATE providers SET status = $1, updated_at = NOW() WHERE id = $2",
            [status, id],
          );
          await writeAudit(
            client,
            actorId,
            "provider.status.updated",
            "provider",
            id,
            ["status"],
            { from_status: before.status, to_status: status },
          );
        }
        const row = await providerById(client, id);
        if (!row) {
          throw new Error("Updated provider could not be retrieved");
        }
        return mapProvider(row);
      });
    },

    async updateProviderVerification(id, status, actorId) {
      return transaction(pool, async (client) => {
        const before = await providerById(client, id);
        if (!before) {
          return null;
        }
        if (before.verification_status !== status) {
          await client.query(
            `UPDATE providers
             SET verification_status = $1, updated_at = NOW()
             WHERE id = $2`,
            [status, id],
          );
          await writeAudit(
            client,
            actorId,
            "provider.verification.updated",
            "provider",
            id,
            ["verification_status"],
            {
              from_status: before.verification_status,
              to_status: status,
            },
          );
        }
        const row = await providerById(client, id);
        if (!row) {
          throw new Error("Updated provider could not be retrieved");
        }
        return mapProvider(row);
      });
    },
  };
}
