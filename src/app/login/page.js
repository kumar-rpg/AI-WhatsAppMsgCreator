"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f5f0] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white border border-[#e4e0d6] rounded-lg p-8 shadow-sm"
      >
        <div className="text-center mb-6">
          <p className="text-xs tracking-widest uppercase text-[#22c55e] font-semibold mb-1">
            Cortex Robotics · HR
          </p>
          <h1 className="text-xl font-bold text-[#10233f]">Team Access</h1>
        </div>

        <label className="block text-sm font-bold text-[#10233f] mb-2">
          Team password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-[#cfc9ba] rounded-md px-3 py-2 mb-4 bg-[#f7f5f0] text-[#22262b] placeholder:text-[#8b93a0] focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
          placeholder="Enter password"
          autoFocus
        />

        {error && (
          <p className="text-sm text-[#a3423a] mb-4">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#10233f] hover:bg-[#1c3a63] text-white font-bold py-2.5 rounded-md transition-colors disabled:opacity-60"
        >
          {loading ? "Checking..." : "Enter"}
        </button>
      </form>
    </div>
  );
}
