"use client";

import { noteColorClass, noteHex, noteBg, noteBorder } from "@/lib/helpers";
import type { Question } from "@/lib/data";

type Props = { q: Question; value: number | undefined; onChange: (n: number) => void };

const labels: Record<string, string> = {
  red: "Muito ruim", orange: "Ruim", yellow: "Regular", green: "Bom", teal: "Excelente",
};

export default function ScaleQ({ q, value, onChange }: Props) {
  const cls = noteColorClass(value);
  const hex = noteHex(value);

  return (
    <div className="qw">
      <div className="ql">{q.lbl}</div>
      <div
        className="scale-wrap"
        style={{
          background: value ? `${noteBg(value)}15` : "var(--card)",
          borderColor: value ? `${noteBorder(value)}60` : "var(--border)",
        }}
      >
        {[[1,2,3,4,5],[6,7,8,9,10]].map((row, ri) => (
          <div key={ri} className="scale-row">
            {row.map((n) => (
              <button
                key={n}
                className={`sb${value === n ? ` on-${cls}` : ""}`}
                onClick={() => onChange(n)}
              >
                {n}
              </button>
            ))}
          </div>
        ))}
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:12, padding:"0 2px", alignItems:"center" }}>
          <span style={{ fontSize:12, color:hex, fontWeight:500, transition:"color .3s" }}>{q.la}</span>
          {value && (
            <span style={{ fontSize:14, fontWeight:700, color:hex, fontFamily:"var(--font2)", transition:"color .3s", display:"flex", alignItems:"center", gap:6 }}>
              {value}/10 — {labels[cls] || ""}
            </span>
          )}
          <span style={{ fontSize:12, color:hex, fontWeight:500, transition:"color .3s" }}>{q.lb}</span>
        </div>
      </div>
    </div>
  );
}
