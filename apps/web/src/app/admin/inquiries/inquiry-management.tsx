"use client";

import { useEffect, useState, type FormEvent } from "react";
import ManagementShell, { useManagementApi } from "../management-shell";

const STATUSES = [
  "NEW",
  "CONTACTED",
  "PROVIDER_CHECKING",
  "QUOTATION_SENT",
  "AWAITING_CONFIRMATION",
  "CONVERTED",
  "DECLINED",
  "CANCELLED",
  "CLOSED",
] as const;
type InquiryStatus = (typeof STATUSES)[number];

const TRANSITIONS: Record<InquiryStatus, InquiryStatus[]> = {
  NEW: ["CONTACTED", "CANCELLED"],
  CONTACTED: ["PROVIDER_CHECKING", "CANCELLED", "CLOSED"],
  PROVIDER_CHECKING: ["QUOTATION_SENT", "CONTACTED", "CANCELLED"],
  QUOTATION_SENT: ["AWAITING_CONFIRMATION", "CANCELLED"],
  AWAITING_CONFIRMATION: ["DECLINED", "CANCELLED"],
  CONVERTED: ["CLOSED"],
  DECLINED: ["CLOSED"],
  CANCELLED: ["CLOSED"],
  CLOSED: [],
};

interface InquiryListItem {
  id: string;
  reference: string;
  status: InquiryStatus;
  customer_name: string;
  phone: string;
  travel_date: string;
  arrival_location: string;
  created_at: string;
  updated_at: string;
}

interface InquiryHistoryEntry {
  action: string;
  user_id: string | null;
  change_summary: Record<string, unknown> | null;
  created_at: string;
}

interface InquiryDetail extends InquiryListItem {
  email: string | null;
  preferred_contact_method: "PHONE" | "WHATSAPP" | "EMAIL";
  package_id: string | null;
  traveler_count: number;
  duration_days: number;
  budget_amount: string | null;
  budget_currency: string;
  interests: string | null;
  hotel_required: boolean;
  transport_required: boolean;
  special_requests: string | null;
  assigned_user_id: string | null;
  internal_notes: string | null;
  history: InquiryHistoryEntry[];
}

interface PageResult {
  items: InquiryListItem[];
  page: number;
  totalPages: number;
  totalItems: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStatus(value: unknown): value is InquiryStatus {
  return typeof value === "string" && STATUSES.some((status) => status === value);
}

function isPreferredContactMethod(
  value: unknown,
): value is InquiryDetail["preferred_contact_method"] {
  return value === "PHONE" || value === "WHATSAPP" || value === "EMAIL";
}

function parseListItem(value: unknown): InquiryListItem | null {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.reference !== "string" ||
    !isStatus(value.status) ||
    typeof value.customer_name !== "string" ||
    typeof value.phone !== "string" ||
    typeof value.travel_date !== "string" ||
    typeof value.arrival_location !== "string" ||
    typeof value.created_at !== "string" ||
    typeof value.updated_at !== "string"
  ) {
    return null;
  }
  return {
    id: value.id,
    reference: value.reference,
    status: value.status,
    customer_name: value.customer_name,
    phone: value.phone,
    travel_date: value.travel_date,
    arrival_location: value.arrival_location,
    created_at: value.created_at,
    updated_at: value.updated_at,
  };
}

function parseHistoryEntry(value: unknown): InquiryHistoryEntry | null {
  if (
    !isRecord(value) ||
    typeof value.action !== "string" ||
    (value.user_id !== null && typeof value.user_id !== "string") ||
    (value.change_summary !== null && !isRecord(value.change_summary)) ||
    typeof value.created_at !== "string"
  ) {
    return null;
  }
  return {
    action: value.action,
    user_id: value.user_id,
    change_summary: value.change_summary,
    created_at: value.created_at,
  };
}

function parseDetail(value: unknown): InquiryDetail {
  const item = parseListItem(value);
  if (
    !item ||
    !isRecord(value) ||
    (value.email !== null && typeof value.email !== "string") ||
    !isPreferredContactMethod(value.preferred_contact_method) ||
    (value.package_id !== null && typeof value.package_id !== "string") ||
    typeof value.traveler_count !== "number" ||
    typeof value.duration_days !== "number" ||
    (value.budget_amount !== null && typeof value.budget_amount !== "string") ||
    typeof value.budget_currency !== "string" ||
    (value.interests !== null && typeof value.interests !== "string") ||
    typeof value.hotel_required !== "boolean" ||
    typeof value.transport_required !== "boolean" ||
    (value.special_requests !== null && typeof value.special_requests !== "string") ||
    (value.assigned_user_id !== null && typeof value.assigned_user_id !== "string") ||
    (value.internal_notes !== null && typeof value.internal_notes !== "string") ||
    !Array.isArray(value.history)
  ) {
    throw new Error("The inquiry service returned an invalid detail record.");
  }
  const history: InquiryHistoryEntry[] = [];
  for (const entry of value.history) {
    const parsed = parseHistoryEntry(entry);
    if (!parsed) {
      throw new Error("The inquiry service returned invalid history.");
    }
    history.push(parsed);
  }
  return {
    ...item,
    email: value.email,
    preferred_contact_method: value.preferred_contact_method,
    package_id: value.package_id,
    traveler_count: value.traveler_count,
    duration_days: value.duration_days,
    budget_amount: value.budget_amount,
    budget_currency: value.budget_currency,
    interests: value.interests,
    hotel_required: value.hotel_required,
    transport_required: value.transport_required,
    special_requests: value.special_requests,
    assigned_user_id: value.assigned_user_id,
    internal_notes: value.internal_notes,
    history,
  };
}

function parsePage(value: unknown): PageResult {
  if (
    !isRecord(value) ||
    !Array.isArray(value.data) ||
    !isRecord(value.meta) ||
    typeof value.meta.page !== "number" ||
    typeof value.meta.total_pages !== "number" ||
    typeof value.meta.total_items !== "number"
  ) {
    throw new Error("The inquiry service returned an invalid list.");
  }
  const items: InquiryListItem[] = [];
  for (const rawItem of value.data) {
    const item = parseListItem(rawItem);
    if (!item) {
      throw new Error("The inquiry service returned an invalid list item.");
    }
    items.push(item);
  }
  return {
    items,
    page: value.meta.page,
    totalPages: value.meta.total_pages,
    totalItems: value.meta.total_items,
  };
}

function label(value: string): string {
  return value
    .replaceAll("_", " ")
    .replaceAll(".", " ")
    .toLowerCase()
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

function InquiryWorkspace() {
  const { request } = useManagementApi();
  const [items, setItems] = useState<InquiryListItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<InquiryDetail | null>(null);
  const [status, setStatus] = useState<InquiryStatus | "">("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [detailRefresh, setDetailRefresh] = useState(0);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let active = true;
    const parameters = new URLSearchParams({
      page: String(page),
      page_size: "20",
    });
    if (filterStatus) parameters.set("status", filterStatus);
    if (search) parameters.set("search", search);
    void request<unknown>(`/admin/inquiries?${parameters}`)
      .then((body) => {
        if (!active) return;
        const result = parsePage(body);
        setItems(result.items);
        setTotalPages(result.totalPages);
        setTotalItems(result.totalItems);
      })
      .catch((error: unknown) => {
        if (active) {
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to load inquiries.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [filterStatus, page, refresh, request, search]);

  useEffect(() => {
    if (!selectedId) return;
    let active = true;
    void request<unknown>(`/admin/inquiries/${selectedId}`)
      .then((body) => {
        if (!isRecord(body) || !("data" in body)) {
          throw new Error("The inquiry service returned an invalid detail.");
        }
        const result = parseDetail(body.data);
        if (active) {
          setDetail(result);
          setStatus(result.status);
          setNotes(result.internal_notes ?? "");
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to load this inquiry.",
          );
        }
      })
      .finally(() => {
        if (active) setDetailLoading(false);
      });
    return () => {
      active = false;
    };
  }, [detailRefresh, request, selectedId]);

  function applyFilters(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
    setLoading(true);
    setErrorMessage("");
    setRefresh((current) => current + 1);
  }

  async function saveChanges(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!detail) return;
    const body: { status?: InquiryStatus; internal_notes?: string | null } = {};
    if (status && status !== detail.status) body.status = status;
    if (notes !== (detail.internal_notes ?? "")) {
      body.internal_notes = notes.trim() || null;
    }
    if (Object.keys(body).length === 0) {
      setNotice("There are no changes to save.");
      return;
    }

    setSaving(true);
    setErrorMessage("");
    setNotice("");
    try {
      const response = await request<unknown>(`/admin/inquiries/${detail.id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      if (!isRecord(response) || !("data" in response)) {
        throw new Error("The inquiry service returned an invalid update.");
      }
      const updated = parseDetail(response.data);
      setDetail(updated);
      setStatus(updated.status);
      setNotes(updated.internal_notes ?? "");
      setNotice("Inquiry changes saved.");
      setRefresh((current) => current + 1);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save this inquiry.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="py-8">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#176B57]">
        Customer operations
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#17352e]">
        Inquiries
      </h1>
      <p className="mt-2 text-slate-600">
        Review customer requests, update their workflow, and keep internal notes.
      </p>

      <form
        className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_14rem_auto]"
        onSubmit={applyFilters}
      >
        <label className="text-sm font-medium text-slate-700">
          Search inquiries
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            maxLength={100}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Reference, customer, phone, or email"
            type="search"
            value={searchInput}
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Filter by status
          <select
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            onChange={(event) => {
              setFilterStatus(event.target.value);
              setPage(1);
              setLoading(true);
              setErrorMessage("");
              setRefresh((current) => current + 1);
            }}
            value={filterStatus}
          >
            <option value="">All statuses</option>
            {STATUSES.map((value) => (
              <option key={value} value={value}>{label(value)}</option>
            ))}
          </select>
        </label>
        <button
          className="self-end rounded-lg bg-[#176B57] px-5 py-2.5 font-semibold text-white hover:bg-[#125744]"
          type="submit"
        >
          Search
        </button>
      </form>

      {errorMessage && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800" role="alert">
          {errorMessage}
        </p>
      )}
      {notice && <p className="mt-4 text-sm text-green-800" role="status">{notice}</p>}

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)]">
        <section aria-label="Inquiry results" className="rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h2 className="font-semibold text-slate-900">Customer requests</h2>
            <span className="text-sm text-slate-500">{totalItems} total</span>
          </div>
          {loading ? (
            <p className="p-5 text-slate-600" role="status">Loading inquiries…</p>
          ) : items.length === 0 ? (
            <p className="p-5 text-slate-600">No inquiries match these filters.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    aria-current={selectedId === item.id ? "true" : undefined}
                    className="w-full px-4 py-4 text-left hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#176B57]"
                    onClick={() => {
                      if (selectedId !== item.id) {
                        setDetail(null);
                        setDetailLoading(true);
                        setSelectedId(item.id);
                      } else {
                        setDetailLoading(true);
                        setDetailRefresh((current) => current + 1);
                      }
                      setNotice("");
                      setErrorMessage("");
                    }}
                    type="button"
                  >
                    <span className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="text-slate-900">{item.customer_name}</strong>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-900">
                        {label(item.status)}
                      </span>
                    </span>
                    <span className="mt-1 block text-sm text-slate-600">
                      {item.reference} · {item.phone}
                    </span>
                    <span className="mt-1 block text-sm text-slate-500">
                      {item.travel_date} · {item.arrival_location}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
            <button
              className="rounded border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50"
              disabled={page <= 1 || loading}
              onClick={() => {
                setLoading(true);
                setPage((current) => current - 1);
              }}
              type="button"
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">
              Page {page}{totalPages > 0 ? ` of ${totalPages}` : ""}
            </span>
            <button
              className="rounded border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50"
              disabled={page >= totalPages || loading}
              onClick={() => {
                setLoading(true);
                setPage((current) => current + 1);
              }}
              type="button"
            >
              Next
            </button>
          </div>
        </section>

        <section aria-label="Inquiry details" className="rounded-2xl border border-slate-200 bg-white p-5">
          {detailLoading ? (
            <p className="text-slate-600" role="status">Loading inquiry details…</p>
          ) : !detail ? (
            <p className="text-slate-600">Select an inquiry to review its customer and travel details.</p>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{detail.customer_name}</h2>
                  <p className="mt-1 text-sm text-slate-600">{detail.reference}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-900">
                  {label(detail.status)}
                </span>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div><dt className="text-slate-500">Phone</dt><dd className="font-medium text-slate-900">{detail.phone}</dd></div>
                <div><dt className="text-slate-500">Email</dt><dd className="font-medium text-slate-900">{detail.email ?? "Not provided"}</dd></div>
                <div><dt className="text-slate-500">Preferred contact</dt><dd className="font-medium text-slate-900">{label(detail.preferred_contact_method)}</dd></div>
                <div><dt className="text-slate-500">Travel date</dt><dd className="font-medium text-slate-900">{detail.travel_date}</dd></div>
                <div><dt className="text-slate-500">Travelers</dt><dd className="font-medium text-slate-900">{detail.traveler_count}</dd></div>
                <div><dt className="text-slate-500">Duration</dt><dd className="font-medium text-slate-900">{detail.duration_days} days</dd></div>
                <div><dt className="text-slate-500">Arrival location</dt><dd className="font-medium text-slate-900">{detail.arrival_location}</dd></div>
                <div><dt className="text-slate-500">Budget</dt><dd className="font-medium text-slate-900">{detail.budget_amount ? `${detail.budget_amount} ${detail.budget_currency}` : "Not provided"}</dd></div>
                <div><dt className="text-slate-500">Hotel needed</dt><dd className="font-medium text-slate-900">{detail.hotel_required ? "Yes" : "No"}</dd></div>
                <div><dt className="text-slate-500">Transport needed</dt><dd className="font-medium text-slate-900">{detail.transport_required ? "Yes" : "No"}</dd></div>
              </dl>
              {detail.interests && <p className="mt-4 text-sm"><strong>Interests:</strong> {detail.interests}</p>}
              {detail.special_requests && <p className="mt-3 whitespace-pre-wrap text-sm"><strong>Special requests:</strong> {detail.special_requests}</p>}

              <form className="mt-6 border-t border-slate-200 pt-5" onSubmit={(event) => void saveChanges(event)}>
                <label className="block text-sm font-medium text-slate-700">
                  Inquiry status
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    onChange={(event) => {
                      if (isStatus(event.target.value)) setStatus(event.target.value);
                    }}
                    value={status}
                  >
                    <option value={detail.status}>{label(detail.status)} (current)</option>
                    {TRANSITIONS[detail.status].map((next) => (
                      <option key={next} value={next}>{label(next)}</option>
                    ))}
                  </select>
                </label>
                <label className="mt-4 block text-sm font-medium text-slate-700">
                  Internal notes
                  <textarea
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    maxLength={10_000}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={4}
                    value={notes}
                  />
                </label>
                <button
                  className="mt-4 rounded-lg bg-[#176B57] px-4 py-2 font-semibold text-white hover:bg-[#125744] disabled:opacity-50"
                  disabled={saving}
                  type="submit"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </form>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <h3 className="font-semibold text-slate-900">Inquiry history</h3>
                {detail.history.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-600">No recorded history.</p>
                ) : (
                  <ol className="mt-3 space-y-3">
                    {detail.history.map((entry, index) => {
                      const changedFields = entry.change_summary?.changed_fields;
                      const summary = Array.isArray(changedFields)
                        ? changedFields.filter((field): field is string => typeof field === "string").join(", ")
                        : "";
                      const changeLabel = entry.action === "inquiry.submitted"
                        ? "Recorded"
                        : "Updated";
                      return (
                        <li className="border-l-2 border-emerald-200 pl-3 text-sm" key={`${entry.action}-${entry.created_at}-${index}`}>
                          <p className="font-medium text-slate-800">{label(entry.action)}</p>
                          {summary && <p className="mt-0.5 text-slate-600">{changeLabel}: {summary}</p>}
                          <time className="mt-0.5 block text-xs text-slate-500" dateTime={entry.created_at}>
                            {new Date(entry.created_at).toLocaleString("en-GB", {
                              dateStyle: "medium",
                              timeStyle: "short",
                              timeZone: "Africa/Addis_Ababa",
                            })}
                          </time>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </section>
  );
}

export default function InquiryManagement() {
  return (
    <ManagementShell>
      <InquiryWorkspace />
    </ManagementShell>
  );
}
