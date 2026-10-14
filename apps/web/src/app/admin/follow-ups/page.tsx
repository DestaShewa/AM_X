"use client";

import { useEffect, useState, type FormEvent } from "react";
import ManagementShell, { useManagementApi } from "../management-shell";

type TargetType = "CUSTOMER" | "INQUIRY";
type Status = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
type DueFilter = "" | "OVERDUE" | "UPCOMING";

interface TargetOption {
  id: string;
  label: string;
  target_type: TargetType;
}

interface AssigneeOption {
  id: string;
  full_name: string;
}

interface HistoryEntry {
  action: string;
  user_id: string | null;
  change_summary: Record<string, unknown> | null;
  created_at: string;
}

interface FollowUp {
  id: string;
  target_type: TargetType;
  target_id: string;
  target_label: string;
  customer_name: string;
  assigned_user_id: string | null;
  assigned_user_name: string | null;
  description: string;
  due_at: string;
  status: Status;
  completed_at: string | null;
  outcome_notes: string | null;
  created_at: string;
  updated_at: string;
  history: HistoryEntry[];
}

interface PageResponse<T> {
  data: T[];
  meta: { page: number; page_size: number; total_items: number; total_pages: number };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsePage<T>(
  value: unknown,
  parseItem: (item: unknown) => T | null,
): PageResponse<T> {
  if (
    !isRecord(value) ||
    !Array.isArray(value.data) ||
    !isRecord(value.meta) ||
    typeof value.meta.page !== "number" ||
    typeof value.meta.page_size !== "number" ||
    typeof value.meta.total_items !== "number" ||
    typeof value.meta.total_pages !== "number"
  ) {
    throw new Error("The follow-up service returned an invalid list.");
  }
  const data: T[] = [];
  for (const rawItem of value.data) {
    const item = parseItem(rawItem);
    if (item === null) throw new Error("The follow-up service returned an invalid list item.");
    data.push(item);
  }
  return {
    data,
    meta: {
      page: value.meta.page,
      page_size: value.meta.page_size,
      total_items: value.meta.total_items,
      total_pages: value.meta.total_pages,
    },
  };
}

function parseTarget(value: unknown): TargetOption | null {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.label !== "string" ||
    (value.target_type !== "CUSTOMER" && value.target_type !== "INQUIRY")
  ) {
    return null;
  }
  return { id: value.id, label: value.label, target_type: value.target_type };
}

function parseAssignee(value: unknown): AssigneeOption | null {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.full_name !== "string"
  ) {
    return null;
  }
  return { id: value.id, full_name: value.full_name };
}

function isStatus(value: unknown): value is Status {
  return (
    value === "PENDING" ||
    value === "IN_PROGRESS" ||
    value === "COMPLETED" ||
    value === "CANCELLED"
  );
}

function parseFollowUp(value: unknown): FollowUp | null {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    (value.target_type !== "CUSTOMER" && value.target_type !== "INQUIRY") ||
    typeof value.target_id !== "string" ||
    typeof value.target_label !== "string" ||
    typeof value.customer_name !== "string" ||
    (value.assigned_user_id !== null && typeof value.assigned_user_id !== "string") ||
    (value.assigned_user_name !== null && typeof value.assigned_user_name !== "string") ||
    typeof value.description !== "string" ||
    typeof value.due_at !== "string" ||
    !isStatus(value.status) ||
    (value.completed_at !== null && typeof value.completed_at !== "string") ||
    (value.outcome_notes !== null && typeof value.outcome_notes !== "string") ||
    typeof value.created_at !== "string" ||
    typeof value.updated_at !== "string" ||
    !Array.isArray(value.history)
  ) {
    return null;
  }
  const history: HistoryEntry[] = [];
  for (const rawEntry of value.history) {
    if (
      !isRecord(rawEntry) ||
      typeof rawEntry.action !== "string" ||
      (rawEntry.user_id !== null && typeof rawEntry.user_id !== "string") ||
      (rawEntry.change_summary !== null && !isRecord(rawEntry.change_summary)) ||
      typeof rawEntry.created_at !== "string"
    ) {
      return null;
    }
    history.push({
      action: rawEntry.action,
      user_id: rawEntry.user_id,
      change_summary: rawEntry.change_summary,
      created_at: rawEntry.created_at,
    });
  }
  return {
    id: value.id,
    target_type: value.target_type,
    target_id: value.target_id,
    target_label: value.target_label,
    customer_name: value.customer_name,
    assigned_user_id: value.assigned_user_id,
    assigned_user_name: value.assigned_user_name,
    description: value.description,
    due_at: value.due_at,
    status: value.status,
    completed_at: value.completed_at,
    outcome_notes: value.outcome_notes,
    created_at: value.created_at,
    updated_at: value.updated_at,
    history,
  };
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function localDateTime(value: string): string {
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}

function tomorrowDateTime(): string {
  const date = new Date(Date.now() + 24 * 60 * 60_000);
  return localDateTime(date.toISOString());
}

function FollowUpWorkspace() {
  const { request } = useManagementApi();
  const [items, setItems] = useState<FollowUp[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<FollowUp | null>(null);
  const [assignees, setAssignees] = useState<AssigneeOption[]>([]);
  const [targetOptions, setTargetOptions] = useState<TargetOption[]>([]);
  const [targetType, setTargetType] = useState<TargetType>("CUSTOMER");
  const [targetSearch, setTargetSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dueFilter, setDueFilter] = useState<DueFilter>("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [newDescription, setNewDescription] = useState("");
  const [newDueAt, setNewDueAt] = useState(tomorrowDateTime);
  const [newAssignedUserId, setNewAssignedUserId] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueAt, setEditDueAt] = useState("");
  const [editAssignedUserId, setEditAssignedUserId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [outcomeNotes, setOutcomeNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let active = true;
    void request<unknown>("/admin/follow-ups/assignees")
      .then((body) => {
        if (!isRecord(body) || !Array.isArray(body.data)) {
          throw new Error("The follow-up service returned invalid assignees.");
        }
        const result: AssigneeOption[] = [];
        for (const value of body.data) {
          const assignee = parseAssignee(value);
          if (!assignee) throw new Error("The follow-up service returned invalid assignees.");
          result.push(assignee);
        }
        if (active) setAssignees(result);
      })
      .catch((error: unknown) => {
        if (active) setErrorMessage(error instanceof Error ? error.message : "Unable to load staff.");
      });
    return () => {
      active = false;
    };
  }, [request]);

  useEffect(() => {
    let active = true;
    const parameters = new URLSearchParams({
      type: targetType,
      page: "1",
      page_size: "50",
    });
    if (targetSearch.trim()) parameters.set("search", targetSearch.trim());
    void request<unknown>(`/admin/follow-ups/targets?${parameters}`)
      .then((body) => {
        const result = parsePage(body, parseTarget);
        if (active) setTargetOptions(result.data);
      })
      .catch((error: unknown) => {
        if (active) setErrorMessage(error instanceof Error ? error.message : "Unable to load targets.");
      });
    return () => {
      active = false;
    };
  }, [request, targetSearch, targetType]);

  useEffect(() => {
    let active = true;
    const parameters = new URLSearchParams({
      page: String(page),
      page_size: "20",
    });
    if (statusFilter) parameters.set("status", statusFilter);
    if (dueFilter) parameters.set("due", dueFilter);
    if (search) parameters.set("search", search);
    void request<unknown>(`/admin/follow-ups?${parameters}`)
      .then((body) => {
        const result = parsePage(body, parseFollowUp);
        if (!active) return;
        setItems(result.data);
        setTotalPages(result.meta.total_pages);
        setTotalItems(result.meta.total_items);
      })
      .catch((error: unknown) => {
        if (active) setErrorMessage(error instanceof Error ? error.message : "Unable to load follow-ups.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [request, page, statusFilter, dueFilter, search, refresh]);

  useEffect(() => {
    if (!selectedId) return;
    let active = true;
    void request<unknown>(`/admin/follow-ups/${selectedId}`)
      .then((body) => {
        const parsed = isRecord(body) ? parseFollowUp(body.data) : null;
        if (!parsed) throw new Error("The follow-up service returned an invalid detail.");
        if (active) {
          setDetail(parsed);
          setEditDescription(parsed.description);
          setEditDueAt(localDateTime(parsed.due_at));
          setEditAssignedUserId(parsed.assigned_user_id ?? "");
          setOutcomeNotes(parsed.outcome_notes ?? "");
        }
      })
      .catch((error: unknown) => {
        if (active) setErrorMessage(error instanceof Error ? error.message : "Unable to load follow-up.");
      });
    return () => {
      active = false;
    };
  }, [request, selectedId, refresh]);

  async function createFollowUp(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setErrorMessage("");
    setNotice("");
    setSaving(true);
    try {
      const response = await request<{ data: FollowUp }>("/admin/follow-ups", {
        method: "POST",
        body: JSON.stringify({
          target_type: targetType,
          target_id: targetId,
          description: newDescription,
          due_at: new Date(newDueAt).toISOString(),
          assigned_user_id: newAssignedUserId || null,
        }),
      });
      setNotice("Follow-up created.");
      setSelectedId(response.data.id);
      setNewDescription("");
      setRefresh((current) => current + 1);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to create follow-up.");
    } finally {
      setSaving(false);
    }
  }

  async function saveChanges(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!detail) return;
    setErrorMessage("");
    setNotice("");
    setSaving(true);
    try {
      await request(`/admin/follow-ups/${detail.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          description: editDescription,
          due_at: new Date(editDueAt).toISOString(),
          assigned_user_id: editAssignedUserId || null,
        }),
      });
      setNotice("Follow-up updated.");
      setRefresh((current) => current + 1);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update follow-up.");
    } finally {
      setSaving(false);
    }
  }

  async function transition(
    action: "start" | "complete" | "cancel",
  ): Promise<void> {
    if (!detail) return;
    setErrorMessage("");
    setNotice("");
    setSaving(true);
    try {
      await request(`/admin/follow-ups/${detail.id}/${action}`, {
        method: "POST",
        ...(action === "complete"
          ? { body: JSON.stringify({ outcome_notes: outcomeNotes || null }) }
          : {}),
      });
      setNotice(
        action === "start"
          ? "Follow-up started."
          : action === "complete"
            ? "Follow-up completed."
            : "Follow-up cancelled.",
      );
      setRefresh((current) => current + 1);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update follow-up status.");
    } finally {
      setSaving(false);
    }
  }

  function applySearch(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  const isOpen = detail?.status === "PENDING" || detail?.status === "IN_PROGRESS";
  return (
    <section className="py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#176B57]">
            Administrator workspace
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#17352e]">
            Follow-ups
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Create and track customer or inquiry follow-up tasks.
          </p>
        </div>
        <p className="text-sm text-slate-600">{totalItems} follow-ups</p>
      </div>

      {errorMessage && (
        <p className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
          {errorMessage}
        </p>
      )}
      {notice && (
        <p className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800" role="status">
          {notice}
        </p>
      )}

      <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)]">
        <div className="space-y-5">
          <form className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4" onSubmit={applySearch}>
            <label className="min-w-48 flex-1 text-sm font-medium text-slate-700">
              Search
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                onChange={(event) => setSearchInput(event.target.value)}
                value={searchInput}
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Status
              <select className="mt-1 block rounded-lg border border-slate-300 px-3 py-2" onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} value={statusFilter}>
                <option value="">All statuses</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </label>
            <label className="text-sm font-medium text-slate-700">
              Due
              <select className="mt-1 block rounded-lg border border-slate-300 px-3 py-2" onChange={(event) => { setDueFilter(event.target.value as DueFilter); setPage(1); }} value={dueFilter}>
                <option value="">Any due date</option>
                <option value="OVERDUE">Overdue</option>
                <option value="UPCOMING">Not overdue</option>
              </select>
            </label>
            <button className="rounded-lg bg-[#176B57] px-4 py-2 font-semibold text-white hover:bg-[#125744]" type="submit">
              Search
            </button>
          </form>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {loading ? (
              <p className="p-6 text-slate-600" role="status">Loading follow-ups…</p>
            ) : items.length === 0 ? (
              <p className="p-6 text-slate-600">No follow-ups match these filters.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      aria-current={selectedId === item.id ? "true" : undefined}
                      className={`w-full px-5 py-4 text-left transition hover:bg-emerald-50 ${selectedId === item.id ? "bg-emerald-50" : ""}`}
                      onClick={() => setSelectedId(item.id)}
                      type="button"
                    >
                      <span className="flex flex-wrap items-center justify-between gap-2">
                        <strong className="text-[#17352e]">{item.target_label}</strong>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {item.status.replace("_", " ")}
                        </span>
                      </span>
                      <span className="mt-1 block text-sm text-slate-700">{item.description}</span>
                      <span className="mt-2 block text-xs text-slate-500">
                        Due {formatDate(item.due_at)} · {item.assigned_user_name ?? "Unassigned"}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-sm">
              <span className="text-slate-600">Page {page} of {Math.max(totalPages, 1)}</span>
              <div className="flex gap-2">
                <button className="rounded border border-slate-300 px-3 py-1 disabled:opacity-50" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} type="button">Previous</button>
                <button className="rounded border border-slate-300 px-3 py-1 disabled:opacity-50" disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)} type="button">Next</button>
              </div>
            </div>
          </div>

          {detail && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#176B57]">{detail.target_type}</p>
                  <h2 className="mt-1 text-xl font-semibold text-[#17352e]">{detail.target_label}</h2>
                </div>
                <button className="text-sm text-slate-500 hover:text-slate-900" onClick={() => { setSelectedId(null); setDetail(null); }} type="button">Close</button>
              </div>
              <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={(event) => void saveChanges(event)}>
                <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                  Description
                  <textarea className="mt-1 min-h-20 w-full rounded-lg border border-slate-300 px-3 py-2" disabled={!isOpen} maxLength={1000} onChange={(event) => setEditDescription(event.target.value)} required value={editDescription} />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Due date and time
                  <input className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2" disabled={!isOpen} onChange={(event) => setEditDueAt(event.target.value)} required type="datetime-local" value={editDueAt} />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  Assigned staff
                  <select className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2" disabled={!isOpen} onChange={(event) => setEditAssignedUserId(event.target.value)} value={editAssignedUserId}>
                    <option value="">Unassigned</option>
                    {assignees.map((person) => <option key={person.id} value={person.id}>{person.full_name}</option>)}
                  </select>
                </label>
                {isOpen && (
                  <div className="flex flex-wrap gap-2 sm:col-span-2">
                    <button className="rounded-lg bg-[#176B57] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" disabled={saving} type="submit">Save changes</button>
                    {detail.status === "PENDING" && (
                      <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-50" disabled={saving} onClick={() => void transition("start")} type="button">Start</button>
                    )}
                    {detail.status === "IN_PROGRESS" && (
                      <>
                        <button className="rounded-lg border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-800 disabled:opacity-50" disabled={saving} onClick={() => void transition("complete")} type="button">Complete</button>
                        <label className="sr-only" htmlFor="outcome-notes">Completion outcome notes</label>
                        <input className="min-w-48 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" id="outcome-notes" maxLength={4000} onChange={(event) => setOutcomeNotes(event.target.value)} placeholder="Outcome notes (optional)" value={outcomeNotes} />
                      </>
                    )}
                    {detail.status === "PENDING" && (
                      <button className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-800 disabled:opacity-50" disabled={saving} onClick={() => void transition("cancel")} type="button">Cancel</button>
                    )}
                  </div>
                )}
              </form>
              {detail.outcome_notes && (
                <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-700"><strong>Outcome:</strong> {detail.outcome_notes}</p>
              )}
              <div className="mt-6 border-t border-slate-200 pt-4">
                <h3 className="font-semibold text-slate-800">History</h3>
                {detail.history.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-500">No history recorded.</p>
                ) : (
                  <ol className="mt-3 space-y-2">
                    {detail.history.map((entry, index) => (
                      <li className="text-sm text-slate-600" key={`${entry.created_at}-${index}`}>
                        <strong className="text-slate-800">{entry.action.replaceAll(".", " ")}</strong> · {formatDate(entry.created_at)}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </section>
          )}
        </div>

        <form className="h-fit rounded-2xl border border-slate-200 bg-white p-5" onSubmit={(event) => void createFollowUp(event)}>
          <h2 className="text-xl font-semibold text-[#17352e]">New follow-up</h2>
          <div className="mt-4 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Target type
              <select className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2" onChange={(event) => { setTargetType(event.target.value as TargetType); setTargetId(""); }} value={targetType}>
                <option value="CUSTOMER">Customer</option>
                <option value="INQUIRY">Inquiry</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Find {targetType.toLowerCase()}
              <input className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2" onChange={(event) => { setTargetSearch(event.target.value); setTargetId(""); }} placeholder="Search by name or inquiry reference" value={targetSearch} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Target
              <select className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2" onChange={(event) => setTargetId(event.target.value)} required value={targetId}>
                <option value="">Select a {targetType.toLowerCase()}</option>
                {targetOptions.map((target) => <option key={target.id} value={target.id}>{target.label}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Description
              <textarea className="mt-1 min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2" maxLength={1000} onChange={(event) => setNewDescription(event.target.value)} required value={newDescription} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Due date and time
              <input className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2" onChange={(event) => setNewDueAt(event.target.value)} required type="datetime-local" value={newDueAt} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Assigned staff
              <select className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2" onChange={(event) => setNewAssignedUserId(event.target.value)} value={newAssignedUserId}>
                <option value="">Unassigned</option>
                {assignees.map((person) => <option key={person.id} value={person.id}>{person.full_name}</option>)}
              </select>
            </label>
            <button className="w-full rounded-lg bg-[#176B57] px-4 py-3 font-semibold text-white hover:bg-[#125744] disabled:cursor-not-allowed disabled:opacity-50" disabled={saving || !targetId} type="submit">
              {saving ? "Saving…" : "Create follow-up"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default function AdminFollowUpsPage() {
  return (
    <ManagementShell>
      <FollowUpWorkspace />
    </ManagementShell>
  );
}
