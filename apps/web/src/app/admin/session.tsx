"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";

interface StaffUser {
  fullName: string;
  email: string;
  role: string;
}

export default function AdminSession() {
  const router = useRouter();
  const [user, setUser] = useState<StaffUser | null>(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadSession(): Promise<void> {
      try {
        const sessionResponse = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: "include",
        });
        if (sessionResponse.status === 401) {
          router.replace("/login");
          return;
        }
        if (!sessionResponse.ok) {
          throw new Error("Unable to verify the administrator session.");
        }
        const sessionBody: unknown = await sessionResponse.json();
        if (
          !sessionBody ||
          typeof sessionBody !== "object" ||
          !("user" in sessionBody) ||
          !sessionBody.user ||
          typeof sessionBody.user !== "object" ||
          !("fullName" in sessionBody.user) ||
          typeof sessionBody.user.fullName !== "string" ||
          !("email" in sessionBody.user) ||
          typeof sessionBody.user.email !== "string" ||
          !("role" in sessionBody.user) ||
          typeof sessionBody.user.role !== "string"
        ) {
          throw new Error("The session service returned an invalid response.");
        }
        const csrfResponse = await fetch(`${API_BASE_URL}/auth/csrf-token`, {
          credentials: "include",
        });
        if (!csrfResponse.ok) {
          throw new Error("Unable to prepare a secure sign-out request.");
        }
        const csrfBody: unknown = await csrfResponse.json();
        if (
          !csrfBody ||
          typeof csrfBody !== "object" ||
          !("csrf_token" in csrfBody) ||
          typeof csrfBody.csrf_token !== "string"
        ) {
          throw new Error("The session service returned an invalid response.");
        }
        if (active) {
          setUser({
            fullName: sessionBody.user.fullName,
            email: sessionBody.user.email,
            role: sessionBody.user.role,
          });
          setCsrfToken(csrfBody.csrf_token);
        }
      } catch (error) {
        if (active) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to verify the administrator session.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    void loadSession();
    return () => {
      active = false;
    };
  }, [router]);

  async function signOut(): Promise<void> {
    setSigningOut(true);
    setErrorMessage("");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "X-CSRF-Token": csrfToken },
      });
      if (!response.ok) {
        throw new Error("Unable to sign out. Please try again.");
      }
      router.replace("/login");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to sign out.",
      );
      setSigningOut(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-2xl rounded-3xl border border-[#176B57]/15 bg-white p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#176B57]">
          AMX operations
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#17352e]">
          Administrator session
        </h1>
        {loading ? (
          <p className="mt-6 text-slate-600" role="status">
            Checking your session…
          </p>
        ) : user ? (
          <div className="mt-6">
            <p className="text-slate-700">
              Signed in as <strong>{user.fullName}</strong> ({user.email})
            </p>
            <p className="mt-2 text-sm text-slate-600">Role: {user.role}</p>
            <button
              className="mt-8 rounded-lg bg-[#176B57] px-5 py-3 font-semibold text-white transition hover:bg-[#125744] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={signingOut}
              onClick={() => void signOut()}
              type="button"
            >
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        ) : (
          <p className="mt-6 text-slate-600" role="status">
            Your administrator session could not be loaded.
          </p>
        )}
        {errorMessage && (
          <p className="mt-4 text-sm text-red-700" role="alert">
            {errorMessage}
          </p>
        )}
      </section>
    </main>
  );
}
