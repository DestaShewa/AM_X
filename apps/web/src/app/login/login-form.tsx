"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";

interface ApiError {
  error?: { message?: string };
}

export default function LoginForm() {
  const router = useRouter();
  const [csrfToken, setCsrfToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE_URL}/auth/csrf-token`, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to start a secure sign-in session.");
        }
        const body: unknown = await response.json();
        if (
          !body ||
          typeof body !== "object" ||
          !("csrf_token" in body) ||
          typeof body.csrf_token !== "string"
        ) {
          throw new Error("The sign-in service returned an invalid response.");
        }
        if (active) {
          setCsrfToken(body.csrf_token);
          setErrorMessage("");
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to start a secure sign-in session.",
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

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ email, password }),
      });
      const body: unknown = await response.json();
      if (!response.ok) {
        const apiError = body as ApiError;
        throw new Error(apiError.error?.message ?? "Sign-in failed.");
      }
      router.push("/admin");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to sign in.",
      );
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-md rounded-3xl border border-[#176B57]/15 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#176B57]">
          AMX staff
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#17352e]">
          Sign in
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Use your administrator account to access AMX operations.
        </p>

        <form className="mt-8 space-y-5" onSubmit={submit}>
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              autoComplete="username"
              className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none focus:border-[#176B57] focus:ring-2 focus:ring-[#176B57]/20"
              disabled={loading || submitting}
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              autoComplete="current-password"
              className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none focus:border-[#176B57] focus:ring-2 focus:ring-[#176B57]/20"
              disabled={loading || submitting}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          {errorMessage && (
            <p className="text-sm text-red-700" role="alert">
              {errorMessage}
            </p>
          )}
          <button
            className="w-full rounded-lg bg-[#176B57] px-4 py-3 font-semibold text-white transition hover:bg-[#125744] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading || submitting || !csrfToken}
            type="submit"
          >
            {loading ? "Preparing sign-in…" : submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
