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
    <div className="collector-screen">
      <div className="collector-card">
        <div className="sec-eye">Operador</div>
        <div className="sec-head collector-head">Quem está coletando agora?</div>
        <div className="collector-copy">
          Esse nome fica salvo só neste aparelho para identificar quem registrou as respostas no evento.
        </div>
        <div className="qw collector-field">
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
