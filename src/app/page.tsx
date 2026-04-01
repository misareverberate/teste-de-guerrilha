"use client";

import { useState, useEffect } from "react";
import { type Entry } from "@/lib/data";
import { storageGet, storageSet } from "@/lib/helpers";
import FormScreen from "@/components/FormScreen";
import ThanksScreen from "@/components/ThanksScreen";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const [screen, setScreen] = useState<"form" | "thanks" | "dash">("form");
  const [resps, setResps] = useState<Entry[]>([]);
  const [lastEntry, setLastEntry] = useState<Entry | null>(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    storageGet().then((d) => setResps(d));
  }, []);

  async function handleSubmit(entry: Entry) {
    const next = [...resps, entry];
    setResps(next);
    await storageSet(next);
    setLastEntry(entry);
    setScreen("thanks");
  }

  async function handleClear() {
    if (confirm("Apagar todas as respostas? Não pode ser desfeito.")) {
      setResps([]);
      await storageSet([]);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* TOPBAR */}
      <div className="topbar">
        <div className="brand">
          Mestres do <em>Sistema</em>
        </div>
        {screen === "form" ? (
          <>
            <div className="prog-wrap">
              <div className="prog-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="prog-pct">{pct}%</div>
          </>
        ) : (
          <div style={{ flex: 1 }} />
        )}
        <div className="tab-row">
          <button
            className={`tab-btn${screen === "form" ? " on" : ""}`}
            onClick={() => setScreen("form")}
          >
            Teste
          </button>
          <button
            className={`tab-btn${screen === "dash" ? " on" : ""}`}
            onClick={() => setScreen("dash")}
          >
            Dados
          </button>
        </div>
      </div>

      {/* SCREENS */}
      {screen === "form" && (
        <FormScreen onSubmit={handleSubmit} onPctChange={setPct} />
      )}
      {screen === "thanks" && (
        <ThanksScreen
          lastEntry={lastEntry}
          onReset={() => setScreen("form")}
          onDash={() => setScreen("dash")}
        />
      )}
      {screen === "dash" && (
        <div className="dash-wrap fade-up">
          <div className="dash-h">
            <div className="dash-title">Resultados</div>
            <div className="dash-sub">
              {resps.length
                ? `${resps.length} resposta${resps.length > 1 ? "s" : ""} coletada${resps.length > 1 ? "s" : ""}`
                : "Nenhuma resposta ainda."}
            </div>
          </div>
          <Dashboard resps={resps} onClear={handleClear} />
        </div>
      )}
    </div>
  );
}
