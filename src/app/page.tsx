"use client";

import { useState, useEffect } from "react";
import { type Entry } from "@/lib/data";
import { collectorNameGet, collectorNameSet, responseInsert, responsesGet } from "@/lib/helpers";
import { getSupabaseConfigError, isSupabaseConfigured } from "@/lib/supabase";
import CollectorGate from "@/components/CollectorGate";
import FormScreen from "@/components/FormScreen";
import ThanksScreen from "@/components/ThanksScreen";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const [collectorName, setCollectorName] = useState("");
  const [screen, setScreen] = useState<"form" | "thanks" | "dash">("form");
  const [resps, setResps] = useState<Entry[]>([]);
  const [lastEntry, setLastEntry] = useState<Entry | null>(null);
  const [pct, setPct] = useState(0);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function loadResponses() {
    setLoading(true);
    setError(null);

    try {
      const data = await responsesGet();
      setResps(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível sincronizar os dados.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setCollectorName(collectorNameGet());

    if (!isSupabaseConfigured) {
      setLoading(false);
      setError(getSupabaseConfigError() ?? "Configure o Supabase para sincronizar os dados entre aparelhos.");
      return;
    }

    loadResponses();
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || screen !== "dash") return;

    loadResponses();
    const interval = window.setInterval(() => {
      void loadResponses();
    }, 15000);

    return () => window.clearInterval(interval);
  }, [screen]);

  async function handleSubmit(entry: Entry) {
    setSyncing(true);
    setError(null);

    try {
      const next = await responseInsert({ ...entry, coletor: collectorName });
      setResps(next);
      setLastEntry({ ...entry, coletor: collectorName });
      setScreen("thanks");
      setMobileMenuOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar a resposta.");
    } finally {
      setSyncing(false);
    }
  }

  function handleCollectorSave(name: string) {
    collectorNameSet(name);
    setCollectorName(name);
  }

  function goToScreen(nextScreen: "form" | "thanks" | "dash") {
    setScreen(nextScreen);
    setMobileMenuOpen(false);
  }

  if (!collectorName) {
    return <CollectorGate initialName="" onSave={handleCollectorSave} />;
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* TOPBAR */}
      <div className="topbar">
        <div className="topbar-main">
          <div className="brand">
            Mestres do <em>Sistema</em>
          </div>
          <div className="collector-pill">
            Coletor: {collectorName}
          </div>
        </div>
        <button
          className={`mobile-menu-btn${mobileMenuOpen ? " on" : ""}`}
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label="Abrir menu"
          aria-expanded={mobileMenuOpen}
        >
          <span />
          <span />
          <span />
        </button>
        <div className="topbar-side">
          {screen === "form" ? (
            <div className="topbar-progress">
              <div className="prog-wrap">
                <div className="prog-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="prog-pct">{pct}%</div>
            </div>
          ) : (
            <div className="topbar-spacer" />
          )}
          <div className="tab-row">
          <button
            className={`tab-btn${screen === "form" ? " on" : ""}`}
            onClick={() => goToScreen("form")}
          >
            Teste
          </button>
          <button
            className="tab-btn"
            onClick={() => {
              collectorNameSet("");
              setCollectorName("");
              setMobileMenuOpen(false);
            }}
          >
            Trocar Usuário
          </button>
          <button
            className={`tab-btn${screen === "dash" ? " on" : ""}`}
            onClick={() => goToScreen("dash")}
          >
            Dados
          </button>
          </div>
        </div>
      </div>
      <div className={`mobile-menu${mobileMenuOpen ? " open" : ""}`}>
        <div className="mobile-menu-card">
          <div className="mobile-menu-label">Coletor ativo</div>
          <div className="mobile-menu-name">{collectorName}</div>
          {screen === "form" && (
            <div className="mobile-menu-progress">
              <div className="prog-wrap">
                <div className="prog-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="prog-pct">{pct}%</div>
            </div>
          )}
          <div className="mobile-menu-actions">
            <button
              className={`mobile-menu-action${screen === "form" ? " on" : ""}`}
              onClick={() => goToScreen("form")}
            >
              Teste
            </button>
            <button
              className={`mobile-menu-action${screen === "dash" ? " on" : ""}`}
              onClick={() => goToScreen("dash")}
            >
              Dados
            </button>
            <button
              className="mobile-menu-action secondary"
              onClick={() => {
                collectorNameSet("");
                setCollectorName("");
                setMobileMenuOpen(false);
              }}
            >
              Trocar usuário
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div style={{
          margin: "16px auto 0",
          width: "min(960px, calc(100% - 32px))",
          background: "var(--danger-bg)",
          border: "1px solid rgba(220,38,38,.18)",
          color: "var(--danger)",
          borderRadius: 12,
          padding: "12px 14px",
          fontSize: 13,
        }}>
          {error}
        </div>
      )}

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
              {loading
                ? "Sincronizando respostas..."
                : resps.length
                ? `${resps.length} resposta${resps.length > 1 ? "s" : ""} coletada${resps.length > 1 ? "s" : ""}`
                : "Nenhuma resposta ainda."}
            </div>
          </div>
          {syncing && (
            <div style={{ marginBottom: 12, color: "var(--ink3)", fontSize: 12 }}>
              Salvando resposta no banco compartilhado...
            </div>
          )}
          <Dashboard resps={resps} />
        </div>
      )}
    </div>
  );
}
