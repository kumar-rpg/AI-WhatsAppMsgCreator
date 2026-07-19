"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { STAGES, ALL_STAGES, buildMessage } from "@/lib/messageBuilder";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STAGE_COLORS = {
  Applied: "bg-[#e4e0d6] text-[#5b6472]",
  Screening: "bg-[#e4e0d6] text-[#5b6472]",
  Interview: "bg-[#e4e0d6] text-[#5b6472]",
  Offer: "bg-[#fdf3d9] text-[#8a6d1f]",
  Hired: "bg-[#e4f3e8] text-[#2f7a4f]",
  Rejected: "bg-[#fbeceb] text-[#a3423a]",
};

export default function Dashboard() {
  const router = useRouter();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [copyHint, setCopyHint] = useState("");
  const [form, setForm] = useState({
    name: "",
    position: "",
    track: "Employment",
    stage: "Applied",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function loadCandidates() {
    setLoading(true);
    const res = await fetch("/api/candidates");
    if (res.status === 401) {
      router.push("/login");
      return;
    }
    const data = await res.json();
    setCandidates(data.candidates || []);
    setLoading(false);
  }

  useEffect(() => {
    loadCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.position.trim()) {
      setError("Name and position are required.");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not add candidate.");
      return;
    }
    setForm({ name: "", position: "", track: "Employment", stage: "Applied" });
    loadCandidates();
  }

  async function handleStageChange(id, stage) {
    await fetch(`/api/candidates/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
    loadCandidates();
  }

  async function handleDelete(id) {
    if (!confirm("Remove this candidate?")) return;
    await fetch(`/api/candidates/${id}`, { method: "DELETE" });
    loadCandidates();
  }

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }

  function copyMessage(text) {
    navigator.clipboard.writeText(text).then(() => {
      setCopyHint("Copied to clipboard.");
      setTimeout(() => setCopyHint(""), 2000);
    });
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <header className="bg-gradient-to-br from-[#10233f] to-[#1c3a63] text-white px-6 py-10 text-center relative">
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 text-xs text-[#d8dde6] hover:text-white underline"
        >
          Log out
        </button>
        <p className="text-xs tracking-widest uppercase text-[#22c55e] mb-2">
          HR &amp; Recruitment
        </p>
        <h1 className="text-2xl md:text-3xl font-serif font-bold mb-1">
          Candidate Status Tool
        </h1>
        <p className="text-[#d8dde6] text-sm">
          Cortex Robotics · know exactly where every candidate stands
        </p>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <form
          onSubmit={handleAdd}
          className="bg-white border border-[#e4e0d6] rounded-lg p-6 mb-8"
        >
          <h2 className="text-xs tracking-widest uppercase text-[#10233f] font-bold mb-4">
            Add Candidate
          </h2>
          <div className="grid gap-4 md:grid-cols-2 mb-4">
            <div>
              <label className="block text-sm font-bold text-[#10233f] mb-1">
                Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-[#cfc9ba] rounded-md px-3 py-2 bg-[#f7f5f0] text-[#22262b]"
                placeholder="e.g. Roger"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#10233f] mb-1">
                Position
              </label>
              <input
                value={form.position}
                onChange={(e) =>
                  setForm({ ...form, position: e.target.value })
                }
                className="w-full border border-[#cfc9ba] rounded-md px-3 py-2 bg-[#f7f5f0] text-[#22262b]"
                placeholder="e.g. Field Application Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#10233f] mb-1">
                Track
              </label>
              <select
                value={form.track}
                onChange={(e) => setForm({ ...form, track: e.target.value })}
                className="w-full border border-[#cfc9ba] rounded-md px-3 py-2 bg-[#f7f5f0] text-[#22262b]"
              >
                <option value="Employment">Employment</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#10233f] mb-1">
                Stage
              </label>
              <select
                value={form.stage}
                onChange={(e) => setForm({ ...form, stage: e.target.value })}
                className="w-full border border-[#cfc9ba] rounded-md px-3 py-2 bg-[#f7f5f0] text-[#22262b]"
              >
                {ALL_STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {error && <p className="text-sm text-[#a3423a] mb-3">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#10233f] hover:bg-[#1c3a63] text-white font-bold px-5 py-2.5 rounded-md disabled:opacity-60"
          >
            {submitting ? "Adding..." : "Add Candidate"}
          </button>
        </form>

        <h2 className="text-xs tracking-widest uppercase text-[#10233f] font-bold mb-4">
          Candidates ({candidates.length})
        </h2>

        {loading && <p className="text-[#5b6472] text-sm">Loading...</p>}
        {!loading && candidates.length === 0 && (
          <p className="text-[#5b6472] text-sm">No candidates yet — add one above.</p>
        )}

        <div className="space-y-3">
          {candidates.map((c) => {
            const isOpen = expandedId === c.id;
            const message = buildMessage({
              name: c.name,
              position: c.position,
              track: c.track,
              stage: c.stage,
            });
            return (
              <div
                key={c.id}
                className="bg-white border border-[#e4e0d6] rounded-lg p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-[#10233f]">{c.name}</p>
                    <p className="text-sm text-[#5b6472]">
                      {c.position} · {c.track}
                    </p>
                    <p className="text-xs text-[#8b93a0] mt-0.5">
                      Applied {formatDate(c.created_at)} · Stage updated{" "}
                      {formatDate(c.updated_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${STAGE_COLORS[c.stage]}`}
                    >
                      {c.stage}
                    </span>
                    <select
                      value={c.stage}
                      onChange={(e) => handleStageChange(c.id, e.target.value)}
                      className="text-sm border border-[#cfc9ba] rounded-md px-2 py-1 bg-[#f7f5f0] text-[#22262b]"
                    >
                      {ALL_STAGES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 mt-3">
                  <button
                    onClick={() => setExpandedId(isOpen ? null : c.id)}
                    className="text-sm text-[#10233f] font-bold underline"
                  >
                    {isOpen ? "Hide message" : "View WhatsApp message"}
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-sm text-[#a3423a] underline"
                  >
                    Remove
                  </button>
                </div>

                {isOpen && (
                  <div className="mt-4">
                    {c.stage !== "Rejected" && (
                      <div className="flex justify-between relative mb-4 px-2">
                        <div className="absolute top-4 left-6 right-6 h-0.5 bg-[#e0dccf]" />
                        {STAGES.map((s, i) => {
                          const currentIndex = STAGES.indexOf(c.stage);
                          const done = i < currentIndex;
                          const current = i === currentIndex;
                          return (
                            <div
                              key={s}
                              className="relative z-10 text-center flex-1 text-[10px] text-[#5b6472]"
                            >
                              <div
                                className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center font-bold border-2 border-[#f7f5f0] ${
                                  done
                                    ? "bg-[#2f7a4f] text-white"
                                    : current
                                      ? "bg-[#22c55e] text-white"
                                      : "bg-[#e0dccf] text-white"
                                }`}
                              >
                                {done ? "✓" : i + 1}
                              </div>
                              {s}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div className="bg-[#f7f5f0] border-l-4 border-[#22c55e] rounded-md p-4 text-sm whitespace-pre-wrap">
                      {message}
                    </div>
                    <button
                      onClick={() => copyMessage(message)}
                      className="mt-3 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold px-4 py-2 rounded-md text-sm"
                    >
                      Copy Message
                    </button>
                    {copyHint && (
                      <span className="ml-3 text-xs text-[#5b6472]">
                        {copyHint}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
