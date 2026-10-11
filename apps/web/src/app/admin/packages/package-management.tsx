"use client";

import { useEffect, useState, type FormEvent } from "react";
import ManagementShell, { useManagementApi } from "../management-shell";

type PackageStatus = "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";

function isPackageStatus(value: string): value is PackageStatus {
  return ["DRAFT", "ACTIVE", "INACTIVE", "ARCHIVED"].some(
    (status) => status === value,
  );
}

interface ManagedPackage {
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
  media_references: { url: string; alt_text: string }[];
  status: PackageStatus;
  provider_ids: string[];
}

interface ProviderOption {
  id: string;
  name: string;
  status: string;
  verification_status: string;
}

interface PackageForm {
  name: string;
  slug: string;
  description: string;
  destination: string;
  duration_days: string;
  highlights: string;
  itinerary: string;
  inclusions: string;
  exclusions: string;
  important_information: string;
  cancellation_terms: string;
  base_price: string;
  currency: string;
  media_references: string;
  provider_ids: string[];
}

const emptyForm: PackageForm = {
  name: "",
  slug: "",
  description: "",
  destination: "Arba Minch",
  duration_days: "1",
  highlights: "",
  itinerary: "",
  inclusions: "",
  exclusions: "",
  important_information: "",
  cancellation_terms: "",
  base_price: "",
  currency: "ETB",
  media_references: "[]",
  provider_ids: [],
};

function lines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function listPage<T>(body: unknown): T[] {
  if (
    typeof body !== "object" ||
    body === null ||
    !("data" in body) ||
    !Array.isArray(body.data)
  ) {
    throw new Error("The management service returned an invalid list.");
  }
  return body.data as T[];
}

function formFromPackage(value: ManagedPackage): PackageForm {
  return {
    name: value.name,
    slug: value.slug,
    description: value.description,
    destination: value.destination,
    duration_days: String(value.duration_days),
    highlights: value.highlights.join("\n"),
    itinerary: value.itinerary.join("\n"),
    inclusions: value.inclusions.join("\n"),
    exclusions: value.exclusions.join("\n"),
    important_information: value.important_information ?? "",
    cancellation_terms: value.cancellation_terms ?? "",
    base_price: value.base_price ?? "",
    currency: value.currency,
    media_references: JSON.stringify(value.media_references, null, 2),
    provider_ids: value.provider_ids,
  };
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  required = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange(value: string): void;
  multiline?: boolean;
  required?: boolean;
  type?: string;
}) {
  const className =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-[#176B57] focus:outline-none focus:ring-2 focus:ring-[#176B57]/20";
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {multiline ? (
        <textarea
          className={className}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          rows={4}
          value={value}
        />
      ) : (
        <input
          className={className}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          type={type}
          value={value}
        />
      )}
    </label>
  );
}

function PackageWorkspace() {
  const { request } = useManagementApi();
  const [packages, setPackages] = useState<ManagedPackage[]>([]);
  const [providers, setProviders] = useState<ProviderOption[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<PackageForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    void Promise.all([
      request<unknown>("/admin/packages?page=1&page_size=100"),
      request<unknown>("/admin/providers?page=1&page_size=100"),
    ])
      .then(([packageBody, providerBody]) => {
        if (active) {
          setPackages(listPage<ManagedPackage>(packageBody));
          setProviders(listPage<ProviderOption>(providerBody));
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to load packages.",
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
  }, [request]);

  function updateField<K extends keyof PackageForm>(
    field: K,
    value: PackageForm[K],
  ): void {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function selectPackage(value: ManagedPackage): void {
    setSelectedId(value.id);
    setForm(formFromPackage(value));
    setErrorMessage("");
    setNotice("");
  }

  function startNew(): void {
    setSelectedId(null);
    setForm(emptyForm);
    setErrorMessage("");
    setNotice("");
  }

  async function save(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setSaving(true);
    setErrorMessage("");
    setNotice("");
    try {
      const mediaReferences: unknown = JSON.parse(form.media_references);
      if (!Array.isArray(mediaReferences)) {
        throw new Error("Media references must be a JSON array.");
      }
      const body = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        destination: form.destination,
        duration_days: Number(form.duration_days),
        highlights: lines(form.highlights),
        itinerary: lines(form.itinerary),
        inclusions: lines(form.inclusions),
        exclusions: lines(form.exclusions),
        important_information: form.important_information.trim() || null,
        cancellation_terms: form.cancellation_terms.trim() || null,
        base_price: form.base_price.trim() || null,
        currency: form.currency,
        media_references: mediaReferences,
        provider_ids: form.provider_ids,
      };
      const result = await request<{ data: ManagedPackage }>(
        selectedId ? `/admin/packages/${selectedId}` : "/admin/packages",
        {
          method: selectedId ? "PATCH" : "POST",
          body: JSON.stringify(body),
        },
      );
      setSelectedId(result.data.id);
      setForm(formFromPackage(result.data));
      setPackages((current) =>
        selectedId
          ? current.map((item) =>
              item.id === result.data.id ? result.data : item,
            )
          : [result.data, ...current],
      );
      setNotice("Package saved.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save this package.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(status: PackageStatus): Promise<void> {
    if (!selectedId) {
      setErrorMessage("Save the package before changing its status.");
      return;
    }
    setErrorMessage("");
    setNotice("");
    try {
      const result = await request<{ data: ManagedPackage }>(
        `/admin/packages/${selectedId}/status`,
        { method: "PATCH", body: JSON.stringify({ status }) },
      );
      setPackages((current) =>
        current.map((item) => (item.id === selectedId ? result.data : item)),
      );
      setNotice(`Package status changed to ${status}.`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to update package status.",
      );
    }
  }

  return (
    <section className="py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#176B57]">
            Catalog
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#17352e]">
            Package management
          </h1>
        </div>
        <button
          className="min-h-11 rounded-lg bg-[#176B57] px-4 font-semibold text-white hover:bg-[#125744]"
          onClick={startNew}
          type="button"
        >
          Create package
        </button>
      </header>
      {errorMessage && (
        <p className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800" role="alert">
          {errorMessage}
        </p>
      )}
      {notice && (
        <p className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800" role="status">
          {notice}
        </p>
      )}
      {loading ? (
        <p className="py-10 text-slate-600" role="status">Loading packages…</p>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(16rem,0.7fr)_minmax(0,1.3fr)]">
          <section aria-label="All packages" className="space-y-3">
            <h2 className="text-lg font-semibold text-[#17352e]">All packages</h2>
            {packages.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-300 p-5 text-slate-600">
                No packages yet. Create a draft to begin.
              </p>
            ) : (
              packages.map((item) => (
                <button
                  aria-pressed={selectedId === item.id}
                  className="block w-full rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-[#176B57] aria-pressed:border-[#176B57] aria-pressed:bg-emerald-50"
                  key={item.id}
                  onClick={() => selectPackage(item)}
                  type="button"
                >
                  <span className="block font-semibold text-slate-900">{item.name}</span>
                  <span className="mt-1 block text-sm text-slate-600">
                    {item.status} · {item.slug}
                  </span>
                </button>
              ))
            )}
          </section>
          <form
            className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
            onSubmit={(event) => void save(event)}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-[#17352e]">
                {selectedId ? "Edit package" : "New package draft"}
              </h2>
              {selectedId && (
                <label className="text-sm font-medium text-slate-700">
                  Status
                  <select
                    className="ml-2 min-h-10 rounded-lg border border-slate-300 px-2"
                    onChange={(event) => {
                      if (isPackageStatus(event.target.value)) {
                        void changeStatus(event.target.value);
                      }
                    }}
                    value={packages.find((item) => item.id === selectedId)?.status ?? "DRAFT"}
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="ACTIVE">Active (public)</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </label>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" onChange={(value) => updateField("name", value)} required value={form.name} />
              <Field label="Slug" onChange={(value) => updateField("slug", value)} required value={form.slug} />
              <Field label="Destination" onChange={(value) => updateField("destination", value)} required value={form.destination} />
              <Field label="Duration (days)" onChange={(value) => updateField("duration_days", value)} required type="number" value={form.duration_days} />
              <Field label="Starting price (leave blank for quote requests)" onChange={(value) => updateField("base_price", value)} value={form.base_price} />
              <Field label="Currency" onChange={(value) => updateField("currency", value.toUpperCase())} required value={form.currency} />
            </div>
            <Field label="Description" multiline onChange={(value) => updateField("description", value)} required value={form.description} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Highlights (one per line)" multiline onChange={(value) => updateField("highlights", value)} value={form.highlights} />
              <Field label="Itinerary (one day or item per line)" multiline onChange={(value) => updateField("itinerary", value)} value={form.itinerary} />
              <Field label="Inclusions (one per line)" multiline onChange={(value) => updateField("inclusions", value)} value={form.inclusions} />
              <Field label="Exclusions (one per line)" multiline onChange={(value) => updateField("exclusions", value)} value={form.exclusions} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Important information" multiline onChange={(value) => updateField("important_information", value)} value={form.important_information} />
              <Field label="Cancellation terms" multiline onChange={(value) => updateField("cancellation_terms", value)} value={form.cancellation_terms} />
            </div>
            <Field label="Media references (JSON array of HTTPS URL and alt_text)" multiline onChange={(value) => updateField("media_references", value)} value={form.media_references} />
            <fieldset className="rounded-xl border border-slate-200 p-4">
              <legend className="px-1 text-sm font-semibold text-slate-700">
                Assigned providers
              </legend>
              {providers.length === 0 ? (
                <p className="text-sm text-slate-600">Create providers before assigning them.</p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {providers.map((provider) => (
                    <label className="flex items-start gap-2 text-sm text-slate-700" key={provider.id}>
                      <input
                        checked={form.provider_ids.includes(provider.id)}
                        className="mt-1 accent-[#176B57]"
                        onChange={(event) => {
                          const selected = new Set(form.provider_ids);
                          if (event.target.checked) selected.add(provider.id);
                          else selected.delete(provider.id);
                          updateField("provider_ids", [...selected]);
                        }}
                        type="checkbox"
                      />
                      <span>
                        {provider.name}
                        <span className="block text-xs text-slate-500">
                          {provider.status} · {provider.verification_status}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </fieldset>
            <button
              className="min-h-11 rounded-lg bg-[#176B57] px-5 font-semibold text-white hover:bg-[#125744] disabled:opacity-60"
              disabled={saving}
              type="submit"
            >
              {saving ? "Saving…" : "Save package"}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}

export default function PackageManagement() {
  return (
    <ManagementShell>
      <PackageWorkspace />
    </ManagementShell>
  );
}
