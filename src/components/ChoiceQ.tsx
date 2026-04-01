"use client";

import { L, type Question } from "@/lib/data";

type Props = { q: Question; value: string | undefined; onChange: (v: string) => void };

export default function ChoiceQ({ q, value, onChange }: Props) {
  const g2 = (q.opts?.length ?? 0) >= 4 && (q.opts ?? []).every((o) => o.length < 22);

  return (
    <div className="qw">
      <div className="ql">{q.lbl}</div>
      <div className={`choices${g2 ? " grid2" : ""}`}>
        {q.opts?.map((opt, i) => (
          <div key={opt} className={`ci${value === opt ? " on" : ""}`} onClick={() => onChange(opt)}>
            <div className="ci-let">{L[i]}</div>
            <div className="ci-txt">{opt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
