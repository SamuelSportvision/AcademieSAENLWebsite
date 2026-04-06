"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createBrowserClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createBrowserClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/admin/schedule");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-5 pt-[68px]">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Image
            src="/logo-dark.png"
            alt="SAE Academy"
            width={64}
            height={64}
            className="w-16 h-16 object-contain rounded-full mb-4"
          />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C9A84C]">
            Admin Panel
          </p>
          <p className="text-gray-600 text-xs mt-1 uppercase tracking-wider">
            SAE Academy
          </p>
        </div>

        {/* Form card */}
        <div className="bg-[#1a1a1a] border border-white/10 rounded p-8">
          <h1 className="text-white font-black text-xl uppercase tracking-wide mb-6">
            Sign In
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#111] border border-white/10 rounded px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#C9A84C] transition-colors"
                placeholder="admin@example.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#111] border border-white/10 rounded px-4 py-2.5 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#C9A84C] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-[#C8102E] text-xs font-semibold">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-[#C9A84C] text-black font-black text-sm uppercase tracking-widest py-3 rounded hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-700 text-xs mt-6">
          Admin access only. Contact{" "}
          <a
            href="mailto:info@academiesae.com"
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            info@academiesae.com
          </a>{" "}
          for help.
        </p>
      </div>
    </div>
  );
}
