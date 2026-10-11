"use client";

import { useEffect, useState, type FormEvent } from "react";
import ManagementShell, { useManagementApi } from "../management-shell";

type ProviderStatus = "ACTIVE" | "SUSPENDED" | "INACTIVE";
type VerificationStatus = "UNVERIFIED" | "VERIFIED";
type AgreementStatus = "PENDING" | "ACTIVE" | "INACTIVE";

function isProviderStatus(value: string): value is ProviderStatus {
  return ["ACTIVE", "SUSPENDED", "INACTIVE"].some(
    (status) => status === value,
  );
}

function isVerificationStatus(value: string): value is VerificationStatus {
  return ["UNVERIFIED", "VERIFIED"].some((status) => status === value);
}

function isAgreementStatus(value: string): value is AgreementStatus {
  return ["PENDING", "ACTIVE", "INACTIVE"].some(
    (status) => status === value,
  );
}

interface ManagedProvider {
  id: string;
  name: string;
  provider_type: string;
  phone: string;
  email: string | null;
  location: string;
  languages: string[];
  services_offered: string[];
  pricing_notes: string | null;
  availability_notes: string | null;
  verification_status: VerificationStatus;
  license_details: string | null;
  qualification_details: string | null;
  agreement_status: AgreementStatus;
  commission_terms: string | null;
  notes: string | null;
  status: ProviderStatus;
}

interface ProviderForm {
  name: string;
  provider_type: string;
  phone: string;
  email: string;
  location: string;
  languages: string;
  services_offered: string;
  pricing_notes: string;
  availability_notes: string;
  license_details: string;
  qualification_details: string;
  agreement_status: AgreementStatus;
  commission_terms: string;
  notes: string;
}

const emptyForm: ProviderForm = {
  name: "",
  provider_type: "",
  phone: "",
  email: "",
  location: "",
  languages: "",
  services_offered: "",
  pricing_notes: "",
  availability_notes: "",
  license_details: "",
  qualification_details: "",
  agreement_status: "PENDING",
  commission_terms: "",
  notes: "",
};

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

function lines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function formFromProvider(provider: ManagedProvider): ProviderForm {
  return {
    name: provider.name,
    provider_type: provider.provider_type,
    phone: provider.phone,
    email: provider.email ?? "",
    location: provider.location,
    languages: provider.languages.join("\n"),
    services_offered: provider.services_offered.join("\n"),
    pricing_notes: provider.pricing_notes ?? "",
    availability_notes: provider.availability_notes ?? "",
    license_details: provider.license_details ?? "",
    qualification_details: provider.qualification_details ?? "",
    agreement_status: provider.agreement_status,
    commission_terms: provider.commission_terms ?? "",
    notes: provider.notes ?? "",
  };
}

function ProviderWorkspace() {
  const { request } = useManagementApi();
  const [providers, setProviders] = useState<ManagedProvider[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<ProviderForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    void request<unknown>("/admin/providers?page=1&page_size=100")
      .then((body) => {
        if (active) {
          setProviders(listPage<ManagedProvider>(body));
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to load providers.",
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

  function updateField<K extends keyof ProviderForm>(
    field: K,
    value: ProviderForm[K],
  ): void {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function startNew(): void {
    setSelectedId(null);
    setForm(emptyForm);
    setErrorMessage("");
    setNotice("");
  }

  function selectProvider(provider: ManagedProvider): void {
    setSelectedId(provider.id);
    setForm(formFromProvider(provider));
    setErrorMessage("");
    setNotice("");
  }

  async function save(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setSaving(true);
    setErrorMessage("");
    setNotice("");
    const body = {
      name: form.name,
      provider_type: form.provider_type,
      phone: form.phone,
      email: form.email.trim() || null,
      location: form.location,
      languages: lines(form.languages),
      services_offered: lines(form.services_offered),
      pricing_notes: form.pricing_notes.trim() || null,
      availability_notes: form.availability_notes.trim() || null,
      license_details: form.license_details.trim() || null,
      qualification_details: form.qualification_details.trim() || null,
      agreement_status: form.agreement_status,
      commission_terms: form.commission_terms.trim() || null,
      notes: form.notes.trim() || null,
    };
    try {
      const result = await request<{ data: ManagedProvider }>(
        selectedId ? `/admin/providers/${selectedId}` : "/admin/providers",
        {
          method: selectedId ? "PATCH" : "POST",
          body: JSON.stringify(body),
        },
      );
      setSelectedId(result.data.id);
      setForm(formFromProvider(result.data));
      setProviders((current) =>
        selectedId
          ? current.map((provider) =>
              provider.id === result.data.id ? result.data : provider,
            )
          : [result.data, ...current],
      );
      setNotice("Provider record saved.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save this provider.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function setProviderStatus(status: ProviderStatus): Promise<void> {
    if (!selectedId) {
      setErrorMessage("Save the provider before changing its status.");
      return;
    }
    setErrorMessage("");
    setNotice("");
    try {
      const result = await request<{ data: ManagedProvider }>(
        `/admin/providers/${selectedId}/status`,
        { method: "PATCH", body: JSON.stringify({ status }) },
      );
      setProviders((current) =>
        current.map((provider) =>
          provider.id === selectedId ? result.data : provider,
        ),
      );
      setNotice(`Provider status changed to ${status}.`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to update provider status.",
      );
    }
  }

  async function setVerificationStatus(
    status: VerificationStatus,
  ): Promise<void> {
    if (!selectedId) {
      setErrorMessage("Save the provider before changing verification.");
      return;
    }
    setErrorMessage("");
    setNotice("");
    try {
      const result = await request<{ data: ManagedProvider }>(
        `/admin/providers/${selectedId}/verification`,
        { method: "PATCH", body: JSON.stringify({ status }) },
      );
      setProviders((current) =>
        current.map((provider) =>
          provider.id === selectedId ? result.data : provider,
        ),
      );
      setNotice(`Verification status changed to ${status}.`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update provider verification.",
      );
    }
  }

  const selected = providers.find((provider) => provider.id === selectedId);
  const textField = (
    label: string,
    field: keyof Omit<ProviderForm, "agreement_status">,
    multiline = false,
    required = false,
  ) => (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {multiline ? (
        <textarea
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#176B57] focus:outline-none focus:ring-2 focus:ring-[#176B57]/20"
          onChange={(event) => updateField(field, event.target.value)}
          required={required}
          rows={3}
          value={form[field]}
        />
      ) : (
        <input
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#176B57] focus:outline-none focus:ring-2 focus:ring-[#176B57]/20"
          onChange={(event) => updateField(field, event.target.value)}
          required={required}
          type={field === "email" ? "email" : "text"}
          value={form[field]}
        />
      )}
    </label>
  );

  return (
    <section className="py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#176B57]">
            Operations
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#17352e]">
            Provider management
          </h1>
        </div>
        <button
          className="min-h-11 rounded-lg bg-[#176B57] px-4 font-semibold text-white hover:bg-[#125744]"
          onClick={startNew}
          type="button"
        >
          Add provider
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
        <p className="py-10 text-slate-600" role="status">Loading providers…</p>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(16rem,0.7fr)_minmax(0,1.3fr)]">
          <section aria-label="All providers" className="space-y-3">
            <h2 className="text-lg font-semibold text-[#17352e]">All providers</h2>
            {providers.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-300 p-5 text-slate-600">
                No provider records yet.
              </p>
            ) : (
              providers.map((provider) => (
                <button
                  aria-pressed={selectedId === provider.id}
                  className="block w-full rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-[#176B57] aria-pressed:border-[#176B57] aria-pressed:bg-emerald-50"
                  key={provider.id}
                  onClick={() => selectProvider(provider)}
                  type="button"
                >
                  <span className="block font-semibold text-slate-900">{provider.name}</span>
                  <span className="mt-1 block text-sm text-slate-600">
                    {provider.status} · {provider.verification_status}
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
                {selectedId ? "Edit provider" : "New provider"}
              </h2>
              {selected && (
                <div className="flex flex-wrap gap-2">
                  <select
                    aria-label="Provider lifecycle status"
                    className="min-h-10 rounded-lg border border-slate-300 px-2 text-sm"
                    onChange={(event) => {
                      if (isProviderStatus(event.target.value)) {
                        void setProviderStatus(event.target.value);
                      }
                    }}
                    value={selected.status}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                  <select
                    aria-label="Provider verification status"
                    className="min-h-10 rounded-lg border border-slate-300 px-2 text-sm"
                    onChange={(event) => {
                      if (isVerificationStatus(event.target.value)) {
                        void setVerificationStatus(event.target.value);
                      }
                    }}
                    value={selected.verification_status}
                  >
                    <option value="UNVERIFIED">Unverified</option>
                    <option value="VERIFIED">Verified</option>
                  </select>
                </div>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {textField("Name", "name", false, true)}
              {textField("Provider type", "provider_type", false, true)}
              {textField("Phone", "phone", false, true)}
              {textField("Email", "email")}
              {textField("Location", "location", false, true)}
              {textField("Languages (one per line)", "languages", true)}
              {textField("Services offered (one per line)", "services_offered", true)}
              {textField("Pricing notes", "pricing_notes", true)}
              {textField("Availability notes", "availability_notes", true)}
              {textField("License details", "license_details", true)}
              {textField("Qualification details", "qualification_details", true)}
              {textField("Commission terms", "commission_terms", true)}
              {textField("Internal notes", "notes", true)}
              <label className="block text-sm font-medium text-slate-700">
                Agreement status
                <select
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  onChange={(event) => {
                    if (isAgreementStatus(event.target.value)) {
                      updateField("agreement_status", event.target.value);
                    }
                  }}
                  value={form.agreement_status}
                >
                  <option value="PENDING">Pending</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </label>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Contact, pricing, agreement, and internal-note fields are private
              staff information and are not returned by public APIs.
            </p>
            <button
              className="min-h-11 rounded-lg bg-[#176B57] px-5 font-semibold text-white hover:bg-[#125744] disabled:opacity-60"
              disabled={saving}
              type="submit"
            >
              {saving ? "Saving…" : "Save provider"}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}

export default function ProviderManagement() {
  return (
    <ManagementShell>
      <ProviderWorkspace />
    </ManagementShell>
  );
}
