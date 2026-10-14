"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1"
).replace(/\/+$/, "");

interface ManagementContextValue {
  request<T>(path: string, init?: RequestInit): Promise<T>;
}

const ManagementContext = createContext<ManagementContextValue | null>(null);

export function useManagementApi(): ManagementContextValue {
  const context = useContext(ManagementContext);
  if (!context) {
    throw new Error("Management pages require the administrator shell");
  }
  return context;
}

export default function ManagementShell({
  children,
}: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  const [csrfToken, setCsrfToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    async function verifyAdministrator(): Promise<void> {
      try {
        const sessionResponse = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: "include",
        });
        if (sessionResponse.status === 401) {
          router.replace("/login");
          return;
        }
        if (!sessionResponse.ok) {
          throw new Error("Unable to verify your administrator session.");
        }
        const sessionBody: unknown = await sessionResponse.json();
        if (
          typeof sessionBody !== "object" ||
          sessionBody === null ||
          !("user" in sessionBody) ||
          typeof sessionBody.user !== "object" ||
          sessionBody.user === null ||
          !("role" in sessionBody.user) ||
          sessionBody.user.role !== "Administrator"
        ) {
          throw new Error("Administrator access is required.");
        }

        const csrfResponse = await fetch(`${API_BASE_URL}/auth/csrf-token`, {
          credentials: "include",
        });
        if (!csrfResponse.ok) {
          throw new Error("Unable to prepare secure management requests.");
        }
        const csrfBody: unknown = await csrfResponse.json();
        if (
          typeof csrfBody !== "object" ||
          csrfBody === null ||
          !("csrf_token" in csrfBody) ||
          typeof csrfBody.csrf_token !== "string"
        ) {
          throw new Error("The session service returned an invalid response.");
        }
        if (active) {
          setCsrfToken(csrfBody.csrf_token);
          setReady(true);
        }
      } catch (error) {
        if (active) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to verify your administrator session.",
          );
        }
      }
    }
    void verifyAdministrator();
    return () => {
      active = false;
    };
  }, [router]);

  const request = useCallback(
    async <T,>(path: string, init: RequestInit = {}): Promise<T> => {
      const method = init.method ?? "GET";
      const headers = new Headers(init.headers);
      if (init.body !== undefined) {
        headers.set("Content-Type", "application/json");
      }
      if (method !== "GET" && method !== "HEAD") {
        headers.set("X-CSRF-Token", csrfToken);
      }
      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers,
        credentials: "include",
      });
      const body: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const message =
          typeof body === "object" &&
          body !== null &&
          "error" in body &&
          typeof body.error === "object" &&
          body.error !== null &&
          "message" in body.error &&
          typeof body.error.message === "string"
            ? body.error.message
            : "The management request failed.";
        throw new Error(message);
      }
      return body as T;
    },
    [csrfToken],
  );

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-10 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <Link className="font-semibold text-[#176B57]" href="/admin">
            AMX operations
          </Link>
          <nav aria-label="Administration" className="mt-3 flex gap-4 text-sm">
            <Link className="text-slate-700 hover:text-[#176B57]" href="/admin/packages">
              Packages
            </Link>
            <Link className="text-slate-700 hover:text-[#176B57]" href="/admin/providers">
              Providers
            </Link>
            <Link className="text-slate-700 hover:text-[#176B57]" href="/admin/inquiries">
              Inquiries
            </Link>
            <Link className="text-slate-700 hover:text-[#176B57]" href="/admin/follow-ups">
              Follow-ups
            </Link>
          </nav>
        </div>
      </header>
      {!ready && !errorMessage ? (
        <p className="py-12 text-slate-600" role="status">
          Checking administrator access…
        </p>
      ) : errorMessage ? (
        <p className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800" role="alert">
          {errorMessage}
        </p>
      ) : (
        <ManagementContext.Provider value={{ request }}>
          {children}
        </ManagementContext.Provider>
      )}
    </main>
  );
}
