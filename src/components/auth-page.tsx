"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Mode = "signin" | "signup";

type Props = {
  initialMode: Mode;
};

export function AuthPage({ initialMode }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = name.trim();
    if (!trimmed) {
      setError("Enter your name");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmed,
          imageUrl: imageUrl.trim() ? imageUrl.trim() : undefined,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as null | {
          error?: string;
        };
        throw new Error(data?.error ?? "Auth failed");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto grid min-h-screen max-w-5xl grid-cols-1 items-stretch gap-6 px-6 py-10 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl bg-emerald-600 p-8 text-white">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              Shipper • Chat
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              Ship faster with a focused inbox.
            </h1>
            <p className="mt-3 max-w-md text-sm text-white/85">
              Direct messages, real-time presence, and searchable history — all stored in Postgres.
            </p>

            <div className="mt-8 space-y-3 text-sm text-white/90">
              <div className="flex gap-3">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-white" />
                <div>
                  <div className="font-medium">Real-time presence</div>
                  <div className="text-white/80">See who’s online before you ping.</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-white" />
                <div>
                  <div className="font-medium">Message history saved</div>
                  <div className="text-white/80">Every session persists and reloads instantly.</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-white" />
                <div>
                  <div className="font-medium">Start in seconds</div>
                  <div className="text-white/80">No password needed for this MVP.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-white/15" />
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10" />
        </div>

        <div className="flex items-center">
          <div className="w-full rounded-3xl border border-zinc-200 bg-white p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-zinc-500">Welcome</div>
                <div className="mt-1 text-xl font-semibold">
                  {mode === "signup" ? "Create your account" : "Sign in"}
                </div>
              </div>
              <div className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 p-1">
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={
                    "rounded-full px-3 py-1 text-xs font-medium " +
                    (mode === "signup" ? "bg-white text-zinc-900" : "text-zinc-500")
                  }
                >
                  Sign up
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className={
                    "rounded-full px-3 py-1 text-xs font-medium " +
                    (mode === "signin" ? "bg-white text-zinc-900" : "text-zinc-500")
                  }
                >
                  Log in
                </button>
              </div>
            </div>

            <p className="mt-2 text-sm text-zinc-500">
              {mode === "signup"
                ? "Pick a display name to start chatting."
                : "Enter your name to continue."}
            </p>

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="text-sm font-medium">Display name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                  placeholder="e.g. Alex"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Avatar URL <span className="text-zinc-400">(optional)</span>
                </label>
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                  placeholder="https://..."
                />
              </div>

              {error ? <div className="text-sm text-red-600">{error}</div> : null}

              <button
                disabled={loading}
                className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading
                  ? "Continuing…"
                  : mode === "signup"
                    ? "Create account"
                    : "Continue"}
              </button>
            </form>

            <div className="mt-5 text-xs text-zinc-400">
              JWT cookie auth (MVP). Google OAuth can be added later.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
