"use client";

import { useState } from "react";

type Props = {
  initialName: string;
  onSave: (name: string) => void;
};

export default function CollectorGate({ initialName, onSave }: Props) {
  const [name, setName] = useState(initialName);

  const trimmed = name.trim();

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      background: "radial-gradient(circle at top, rgba(67,56,202,.10), transparent 32%), var(--bg)",
    }}>
      <div style={{
        width: "min(100%, 520px)",
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        padding: 28,
        boxShadow: "var(--shadow2)",
      }}>
        <div className="sec-eye">Operador</div>
        <div className="sec-head" style={{ marginBottom: 12 }}>Quem está coletando agora?</div>
        <div style={{ color: "var(--ink2)", lineHeight: 1.6, marginBottom: 20 }}>
          Esse nome fica salvo só neste aparelho para identificar quem registrou as respostas no evento.
        </div>
        <div className="qw" style={{ marginBottom: 20 }}>
          <div className="ql">Nome do coletor</div>
          <input
            className="q-in"
            type="text"
            placeholder="Ex: Ana, João, Equipe A..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && trimmed) onSave(trimmed);
            }}
          />
        </div>
        <button
          className="btn btn-send"
          onClick={() => onSave(trimmed)}
          disabled={!trimmed}
          style={{ width: "100%", justifyContent: "center" }}
        >
          Entrar no coletor
        </button>
      </div>
    </div>
  );
}
