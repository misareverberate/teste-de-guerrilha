"use client";

import { noteHex } from "@/lib/helpers";
import type { Entry } from "@/lib/data";

function Confetti() {
  const colors = ["#4338ca","#6366f1","#0d9488","#14b8a6","#d97706","#dc2626","#ec4899"];
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i, left: Math.random() * 100, delay: Math.random() * 1.5,
    color: colors[i % colors.length], size: 6 + Math.random() * 6,
  }));
  return (
    <>
      {pieces.map((p) => (
        <div key={p.id} className="confetti-piece" style={{
          left: `${p.left}%`, top: -20, width: p.size, height: p.size,
          background: p.color, animationDelay: `${p.delay}s`, animationDuration: `${1.5 + Math.random()}s`,
        }} />
      ))}
    </>
  );
}

type Props = { lastEntry: Entry | null; onReset: () => void; onDash: () => void };

export default function ThanksScreen({ lastEntry, onReset, onDash }: Props) {
  const pairs: [string, string][] = [
    ["Nome", lastEntry?.nome || "Anônimo"],
    ["Faixa etária", lastEntry?.idade || "—"],
    ["Nota", lastEntry?.nota ? lastEntry.nota + "/10" : "—"],
    ["Games", (lastEntry?.games as string) || "—"],
    ["Finanças", (lastEntry?.fin as string) || "—"],
    ["Recomenda", lastEntry?.recom || "—"],
  ];

  return (
    <div className="thanks-wrap">
      <div className="thanks-glow" />
      <Confetti />
      <div className="ty-icon">🎮</div>
      <div className="ty-title fade-up" style={{ animationDelay: ".15s" }}>Valeu demais!</div>
      <div className="ty-sub fade-up" style={{ animationDelay: ".25s" }}>
        Suas respostas foram salvas com sucesso. Elas vão ajudar a melhorar o Mestres do Sistema.
      </div>
      <div className="recap-card fade-up" style={{ animationDelay: ".35s" }}>
        <div className="recap-lbl">Resumo das respostas</div>
        <div className="recap-grid">
          {pairs.map(([k, v]) => (
            <div key={k} className="rp">
              <div className="rk">{k}</div>
              <div className="rv" style={{ color: k === "Nota" ? noteHex(lastEntry?.nota) : "var(--ink)" }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="ty-btns fade-up" style={{ animationDelay: ".45s" }}>
        <button className="btn btn-reset" onClick={onReset}>Próximo testador →</button>
        <button className="btn btn-dash-link" onClick={onDash}>Ver resultados no dashboard</button>
      </div>
    </div>
  );
}
