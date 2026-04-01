"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { SECS, type Entry } from "@/lib/data";
import { createEntryId } from "@/lib/helpers";
import ScaleQ from "./ScaleQ";
import ChoiceQ from "./ChoiceQ";

type Props = {
  onSubmit: (entry: Entry) => Promise<void>;
  onPctChange: (pct: number) => void;
};

export default function FormScreen({ onSubmit, onPctChange }: Props) {
  const [cur, setCur] = useState(0);
  const [ans, setAns] = useState<Record<string, unknown>>({});
  const [dir, setDir] = useState(1);
  const [animKey, setAnimKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const setQ = useCallback((id: string, val: unknown) => setAns((a) => ({ ...a, [id]: val })), []);
  const hasAnswer = useCallback((id: string) => {
    const value = ans[id];

    if (typeof value === "string") {
      return value.trim().length > 0;
    }

    return value !== undefined && value !== null;
  }, [ans]);

  const totalReq = useMemo(() => SECS.flatMap((s) => s.qs).filter((q) => q.t !== "tx").length, []);
  const doneReq = useMemo(
    () => SECS.flatMap((s) => s.qs).filter((q) => q.t !== "tx" && hasAnswer(q.id)).length,
    [hasAnswer]
  );
  const pct = Math.round((doneReq / totalReq) * 100);

  useEffect(() => { onPctChange(pct); }, [pct, onPctChange]);

  function isSectionDone(i: number) {
    return SECS[i].qs.filter((q) => q.t !== "tx").every((q) => hasAnswer(q.id));
  }

  function nav(d: number) {
    setDir(d);
    setAnimKey((k) => k + 1);
    setCur((c) => c + d);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToSection(i: number) {
    setDir(i > cur ? 1 : -1);
    setAnimKey((k) => k + 1);
    setCur(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    const entry = { id: createEntryId(), ts: new Date().toLocaleString("pt-BR"), ...ans } as Entry;
    await onSubmit(entry);
    setAns({});
    setCur(0);
    setAnimKey((k) => k + 1);
    setSubmitting(false);
  }

  const s = SECS[cur];
  const isLast = cur === SECS.length - 1;
  const animClass = dir > 0 ? "slide-r" : "slide-l";
  const canContinue = isSectionDone(cur);
  const canSubmit = doneReq === totalReq;

  return (
    <div style={{ paddingBottom: 120 }}>
      <div className="sec-dots">
        {SECS.map((_, i) => (
          <div
            key={i}
            className={`dot${i === cur ? " cur" : ""}${isSectionDone(i) && i !== cur ? " done" : ""}`}
            onClick={() => goToSection(i)}
          />
        ))}
        <span style={{ fontSize:11, fontWeight:600, color:"var(--ink3)", marginLeft:"auto", fontFamily:"var(--font2)" }}>
          {pct}%
        </span>
      </div>

      <div style={{ maxWidth:600, margin:"0 auto", padding:"0 24px", overflow:"hidden" }}>
        <div key={animKey} className={`sec-block ${animClass}`}>
          <div className="sec-eye">{s.eye}</div>
          <div className="sec-head">{s.head}</div>
          {s.qs.map((q) => {
            if (q.t === "in") return (
              <div key={q.id} className="qw">
                <div className="ql">{q.lbl}</div>
                <input className="q-in" type="text" placeholder={q.ph || ""} value={(ans[q.id] as string) || ""} onChange={(e) => setQ(q.id, e.target.value)} />
              </div>
            );
            if (q.t === "tx") return (
              <div key={q.id} className="qw">
                <div className="ql">{q.lbl}</div>
                <textarea className="q-ta" placeholder={q.ph || ""} value={(ans[q.id] as string) || ""} onChange={(e) => setQ(q.id, e.target.value)} />
              </div>
            );
            if (q.t === "ch") return <ChoiceQ key={q.id} q={q} value={ans[q.id] as string | undefined} onChange={(v) => setQ(q.id, v)} />;
            if (q.t === "sc") return <ScaleQ key={q.id} q={q} value={ans[q.id] as number | undefined} onChange={(v) => setQ(q.id, v)} />;
            return null;
          })}
        </div>
      </div>

      <div className="form-foot">
        <div className="form-foot-inner">
          {cur > 0 && (
            <button className="btn btn-back shrink-0" onClick={() => nav(-1)}>
              ←
            </button>
          )}
          <button
            className={`btn ${isLast ? "btn-send" : "btn-next"}${submitting ? " btn-sending" : ""} ${cur === 0 ? "w-full" : "flex-1"}`}
            onClick={isLast ? handleSubmit : () => nav(1)}
            disabled={submitting || (!isLast && !canContinue) || (isLast && !canSubmit)}
          >
            {submitting ? (<><span className="spinner" />Enviando…</>) : isLast ? "Enviar respostas ✓" : "Continuar →"}
          </button>
        </div>
      </div>
    </div>
  );
}
