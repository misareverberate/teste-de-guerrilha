"use client";

import { noteHex } from "@/lib/helpers";
import type { Entry } from "@/lib/data";

type ConfettiPiece = {
  id: number;
  left: number;
  delay: number;
  color: string;
  size: number;
  duration: number;
};

function confettiValue(seed: number, min: number, max: number) {
  const normalized = ((seed * 9301 + 49297) % 233280) / 233280;
  return min + normalized * (max - min);
}

function Confetti() {
  const colors = ["#4338ca","#6366f1","#0d9488","#14b8a6","#d97706","#dc2626","#ec4899"];
  const pieces: ConfettiPiece[] = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: confettiValue(i + 1, 0, 100),
    delay: confettiValue(i + 11, 0, 1.5),
    color: colors[i % colors.length],
    size: confettiValue(i + 21, 6, 12),
    duration: confettiValue(i + 31, 1.5, 2.5),
  }));
  return (
    <>
      {pieces.map((p) => (
        <div key={p.id} className="confetti-piece" style={{
          left: `${p.left}%`, top: -20, width: p.size, height: p.size,
          background: p.color, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
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
