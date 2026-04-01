"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";
import { SECS, type Entry } from "@/lib/data";
import { noteHex, exportJSON, exportCSV } from "@/lib/helpers";

function CTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="ctt">
      <div className="ctt-label">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="ctt-val">{p.value} resposta{p.value !== 1 ? "s" : ""}</div>
      ))}
    </div>
  );
}

type Props = { resps: Entry[]; onClear: () => void };

export default function Dashboard({ resps, onClear }: Props) {
  const [tab, setTab] = useState("overview");
  const [openCard, setOpenCard] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterAge, setFilterAge] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [crossField1, setCrossField1] = useState("games");
  const [crossField2, setCrossField2] = useState("nota");

  const filteredResps = useMemo(() => {
    let r = resps;
    if (filterAge) r = r.filter((x) => x.idade === filterAge);
    if (search.trim()) {
      const s = search.toLowerCase();
      r = r.filter((x) =>
        (x.nome || "").toLowerCase().includes(s) ||
        (x.gostou || "").toLowerCase().includes(s) ||
        (x.melhoria || "").toLowerCase().includes(s)
      );
    }
    return r;
  }, [resps, filterAge, search]);

  const n = filteredResps.length;

  const stats = useMemo(() => {
    if (!n) return { avg: "0", avgN: 0, recP: 0, apP: 0, fluiu: 0, total: 0, nps: 0, notasCount: 0 };
    const notas = filteredResps.map((r) => r.nota).filter((x): x is number => !!x);
    const avg = notas.length ? notas.reduce((a, b) => a + b, 0) / notas.length : 0;
    const recP = Math.round(filteredResps.filter((r) => r.recom === "Com certeza" || r.recom === "Provavelmente sim").length / n * 100);
    const apP = Math.round(filteredResps.filter((r) => r.aprendeu === "Aprendi bastante coisa nova" || r.aprendeu === "Aprendi algumas coisas").length / n * 100);
    const fluiu = Math.round(filteredResps.filter((r) => r.travou === "Não, o jogo fluiu bem").length / n * 100);
    const nps = notas.length
      ? Math.round(((notas.filter((x) => x >= 9).length - notas.filter((x) => x <= 6).length) / notas.length) * 100)
      : 0;
    return { avg: avg.toFixed(1), avgN: avg, recP, apP, fluiu, total: n, nps, notasCount: notas.length };
  }, [filteredResps, n]);

  const ages = useMemo(() => [...new Set(resps.map((r) => r.idade).filter(Boolean))] as string[], [resps]);

  function cntF(field: string): Record<string, number> {
    const c: Record<string, number> = {};
    filteredResps.forEach((r) => { const v = r[field] as string; if (v) c[v] = (c[v] || 0) + 1; });
    return c;
  }
  function toBarData(field: string, order?: string[]) {
    const c = cntF(field);
    const keys = order ? order.filter((k) => c[k]) : Object.keys(c).sort((a, b) => c[b] - c[a]);
    return keys.map((k) => ({ name: k, value: c[k] }));
  }
  function toPieData(field: string) {
    const c = cntF(field);
    return Object.entries(c).map(([name, value]) => ({ name, value }));
  }

  const COLORS = ["#4338ca","#0d9488","#d97706","#dc2626","#6366f1","#ec4899","#14b8a6","#0284c7"];

  function BarCard({ title, field, color = "#4338ca" }: { title: string; field: string; color?: string }) {
    const data = toBarData(field);
    if (!data.length) return null;
    return (
      <div className="cc">
        <div className="cc-t">{title}</div>
        <ResponsiveContainer width="100%" height={data.length * 48 + 20}>
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 40, top: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 11, fill: "#9b9690" }} tickLine={false} axisLine={false} />
            <Tooltip content={<CTooltip />} />
            <Bar dataKey="value" fill={color} radius={[0, 8, 8, 0]} label={{ position: "right", fontSize: 12, fill: "#9b9690" }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  function PieCard({ title, field }: { title: string; field: string }) {
    const data = toPieData(field);
    if (!data.length) return null;
    return (
      <div className="cc">
        <div className="cc-t">{title}</div>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={44} outerRadius={72} dataKey="value" paddingAngle={3} strokeWidth={0}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
            {data.map((d, i) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                <span style={{ color: "var(--ink2)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</span>
                <span style={{ color: "var(--ink3)", fontWeight: 700, fontFamily: "var(--font2)" }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function NotaCard() {
    const c: Record<number, number> = {};
    for (let i = 1; i <= 10; i++) c[i] = 0;
    filteredResps.forEach((r) => { if (r.nota) c[r.nota]++; });
    const data = Object.entries(c).map(([k, v]) => ({ name: k, value: v, fill: noteHex(Number(k)) }));
    const notas = filteredResps.map((r) => r.nota).filter((x): x is number => !!x);
    const promoters = notas.filter((x) => x >= 9).length;
    const passives = notas.filter((x) => x >= 7 && x <= 8).length;
    const detractors = notas.filter((x) => x <= 6).length;
    const total = notas.length || 1;

    return (
      <div className="cc">
        <div className="cc-t">
          <span>Distribuição de notas</span>
          <span style={{ fontSize: 11, color: "var(--ink3)", fontWeight: 400, textTransform: "none" as const, letterSpacing: 0 }}>{notas.length} avaliações</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 20 }}>
          <div style={{ fontFamily: "var(--font2)", fontSize: 56, fontWeight: 700, lineHeight: 1, letterSpacing: "-.04em", color: noteHex(Math.round(parseFloat(stats.avg))) }}>
            {stats.avg}
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 8 }}>média geral</div>
            <div className="nps-bar" style={{ width: 180 }}>
              <div className="nps-seg" style={{ width: `${(detractors / total) * 100}%`, background: "#dc2626", borderRadius: "99px 0 0 99px" }} />
              <div className="nps-seg" style={{ width: `${(passives / total) * 100}%`, background: "#d97706" }} />
              <div className="nps-seg" style={{ width: `${(promoters / total) * 100}%`, background: "#0d9488", borderRadius: "0 99px 99px 0" }} />
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 10, color: "var(--ink3)" }}>
              <span>🔴 {detractors} detratores</span>
              <span>🟡 {passives} neutros</span>
              <span>🟢 {promoters} promotores</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={data} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9b9690" }} tickLine={false} axisLine={false} />
            <YAxis hide />
            <Tooltip content={<CTooltip />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((d, i) => <Cell key={i} fill={d.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  function RadarCard() {
    const fields = [
      { key: "iniciou", label: "Inicio fácil", pos: "Sim, sem nenhuma dificuldade" },
      { key: "objetivo", label: "Obj. claro", pos: "Imediatamente, já no início" },
      { key: "tutorial", label: "Tutorial útil", pos: "Muito útil, explicou tudo" },
      { key: "aprendeu", label: "Aprendeu", pos: "Aprendi bastante coisa nova" },
      { key: "habito", label: "Mudaria hábito", pos: "Sim, com certeza" },
      { key: "recom", label: "Recomenda", pos: "Com certeza" },
    ];
    const data = fields.map((f) => ({
      subject: f.label,
      score: n ? Math.round(filteredResps.filter((r) => (r as Record<string, unknown>)[f.key] === f.pos).length / n * 100) : 0,
    }));
    return (
      <div className="cc">
        <div className="cc-t">Radar de experiência (% resposta ideal)</div>
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="#e0ddd6" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#9b9690" }} />
            <Radar dataKey="score" stroke="#4338ca" fill="#4338ca" fillOpacity={0.15} dot={{ fill: "#6366f1", r: 4 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  function InsightChips() {
    if (!n) return null;
    const chips: { cls: string; icon: string; text: string }[] = [];
    if (stats.recP >= 70) chips.push({ cls: "green", icon: "👍", text: `${stats.recP}% recomendariam` });
    else if (stats.recP < 40) chips.push({ cls: "red", icon: "⚠️", text: `Só ${stats.recP}% recomendariam` });
    if (parseFloat(stats.avg) >= 8) chips.push({ cls: "green", icon: "⭐", text: `Nota média ${stats.avg}` });
    else if (parseFloat(stats.avg) < 6) chips.push({ cls: "red", icon: "📉", text: `Nota baixa: ${stats.avg}` });
    if (stats.apP >= 60) chips.push({ cls: "blue", icon: "🧠", text: `${stats.apP}% aprenderam algo novo` });
    if (stats.nps >= 50) chips.push({ cls: "green", icon: "🚀", text: `NPS: +${stats.nps}` });
    else if (stats.nps < 0) chips.push({ cls: "red", icon: "📊", text: `NPS: ${stats.nps}` });
    else chips.push({ cls: "warn", icon: "📊", text: `NPS: ${stats.nps > 0 ? "+" : ""}${stats.nps}` });
    if (stats.fluiu >= 50) chips.push({ cls: "green", icon: "🎮", text: `${stats.fluiu}% sem travamentos` });
    else chips.push({ cls: "warn", icon: "🔧", text: `${100 - stats.fluiu}% tiveram travamentos` });
    return (
      <div className="insight-row">
        {chips.map((c, i) => (<div key={i} className={`insight-chip ${c.cls}`}>{c.icon} {c.text}</div>))}
      </div>
    );
  }

  function TextAnswers({ field, label }: { field: string; label: string }) {
    const items = filteredResps.filter((r) => ((r as Record<string, unknown>)[field] as string)?.trim()).map((r) => ({
      name: r.nome || "Anônimo",
      text: (r as Record<string, unknown>)[field] as string,
      ts: r.ts,
    }));
    if (!items.length) return (
      <div className="cc"><div className="cc-t">{label}</div><div style={{ fontSize: 13, color: "var(--ink3)", padding: "12px 0" }}>Nenhuma resposta textual ainda.</div></div>
    );
    return (
      <div className="cc">
        <div className="cc-t"><span>{label}</span><span style={{ fontSize: 11, color: "var(--ink3)", fontWeight: 400, textTransform: "none" as const, letterSpacing: 0 }}>{items.length} respostas</span></div>
        {items.map((item, i) => (
          <div key={i} className="text-answer-card">
            <div className="ta-name">{item.name} <span style={{ color: "var(--ink3)", fontWeight: 400 }}>· {item.ts}</span></div>
            <div className="ta-text">{item.text}</div>
          </div>
        ))}
      </div>
    );
  }

  function CrossTab() {
    const fieldOpts = [
      { id: "games", label: "Perfil gamer" },{ id: "fin", label: "Conhecimento financeiro" },
      { id: "idade", label: "Faixa etária" },{ id: "nota", label: "Nota (agrupada)" },
      { id: "recom", label: "Recomendaria?" },{ id: "aprendeu", label: "Aprendizado" },{ id: "travou", label: "Travamentos" },
    ];
    function getVal(r: Entry, field: string) {
      if (field === "nota") {
        const nota = r.nota;
        if (!nota) return "Sem nota";
        if (nota <= 4) return "1-4 (ruim)";
        if (nota <= 6) return "5-6 (ok)";
        if (nota <= 8) return "7-8 (bom)";
        return "9-10 (ótimo)";
      }
      return ((r as Record<string, unknown>)[field] as string) || "Sem resposta";
    }
    const rows = useMemo(() => {
      const groups: Record<string, Record<string, number>> = {};
      filteredResps.forEach((r) => {
        const k1 = getVal(r, crossField1);
        const k2 = getVal(r, crossField2);
        if (!groups[k1]) groups[k1] = {};
        groups[k1][k2] = (groups[k1][k2] || 0) + 1;
      });
      return groups;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredResps, crossField1, crossField2]);

    const col1Keys = Object.keys(rows).sort();
    const col2Keys = [...new Set(filteredResps.map((r) => getVal(r, crossField2)))].sort();
    const maxVal = Math.max(1, ...col1Keys.flatMap((k) => col2Keys.map((c) => rows[k]?.[c] || 0)));
    const selectStyle = { background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 8, padding: "6px 10px", color: "var(--ink2)", fontFamily: "var(--font)", fontSize: 12, outline: "none" as const };

    return (
      <div className="cc">
        <div className="cc-t">Tabulação cruzada</div>
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 10, color: "var(--ink3)", marginBottom: 4 }}>Linhas</div>
            <select value={crossField1} onChange={(e) => setCrossField1(e.target.value)} style={selectStyle}>
              {fieldOpts.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "var(--ink3)", marginBottom: 4 }}>Colunas</div>
            <select value={crossField2} onChange={(e) => setCrossField2(e.target.value)} style={selectStyle}>
              {fieldOpts.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
            </select>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="cross-tab-table">
            <thead><tr><th />{col2Keys.map((c) => <th key={c}>{c}</th>)}<th>Total</th></tr></thead>
            <tbody>
              {col1Keys.map((row) => {
                const rowTotal = col2Keys.reduce((s, c) => s + (rows[row]?.[c] || 0), 0);
                return (
                  <tr key={row}>
                    <td style={{ fontWeight: 600, color: "var(--ink)" }}>{row}</td>
                    {col2Keys.map((c) => {
                      const val = rows[row]?.[c] || 0;
                      const intensity = val / maxVal;
                      return (<td key={c}><div className="heat-cell" style={{
                        background: val ? `rgba(67,56,202,${0.08 + intensity * 0.4})` : "transparent",
                        color: val ? (intensity > 0.5 ? "#fff" : "var(--accent)") : "var(--ink3)",
                      }}>{val || "—"}</div></td>);
                    })}
                    <td style={{ fontWeight: 600 }}>{rowTotal}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function ResponsesList() {
    const allQs = SECS.flatMap((s) => s.qs);
    const items = filteredResps.slice().reverse();
    if (!items.length) return (<div style={{ textAlign: "center", padding: "40px 20px", color: "var(--ink3)" }}>Nenhuma resposta encontrada.</div>);
    return (
      <div className="rl">
        {items.map((r) => (
          <div key={r.id} className="rc" onClick={() => setOpenCard(openCard === r.id ? null : r.id)}>
            <div className="rc-top">
              <div><div className="rc-nm">{r.nome || "Anônimo"}</div><div className="rc-ts">{r.ts}</div></div>
              {r.nota && <div className="rc-nt" style={{ color: noteHex(r.nota) }}>{r.nota}/10</div>}
            </div>
            <div className="rc-chips">
              {[r.idade, r.games, r.fin, r.recom].filter(Boolean).map((t) => (<span key={t} className="rchip">{t}</span>))}
            </div>
            <div style={{ fontSize: 11, color: "var(--ink3)", display: "flex", alignItems: "center", gap: 4 }}>
              {openCard === r.id ? "▲ Fechar" : "▼ Ver detalhes"}
            </div>
            <div className={`rc-detail${openCard === r.id ? " open" : ""}`}>
              <div className="rc-full-answer">
                {allQs.filter((q) => (r as Record<string, unknown>)[q.id]).map((q) => (
                  <div key={q.id} className="rfa-item">
                    <div className="rfa-q">{q.lbl}</div>
                    <div className="rfa-a">{q.t === "sc" ? `${(r as Record<string, unknown>)[q.id]}/10` : String((r as Record<string, unknown>)[q.id])}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!resps.length) return (<div className="empty-s"><div className="ei">📋</div><h3>Sem dados ainda</h3><p>Colete respostas pelo formulário para ver os gráficos e análises aqui.</p></div>);

  const tabs = [
    { id: "overview", label: "Visão geral" },{ id: "gameplay", label: "Jogabilidade" },
    { id: "learning", label: "Aprendizado" },{ id: "qualitative", label: "Respostas abertas" },
    { id: "crosstab", label: "Tabulação cruzada" },{ id: "responses", label: `Individual (${resps.length})` },
  ];

  return (
    <div>
      <div className="stats-grid">
        <div className="sc"><div className="sc-n" style={{ color: "var(--accent2)" }}>{n}</div><div className="sc-l">Testadores{filterAge ? ` (${filterAge})` : ""}</div></div>
        <div className="sc"><div className="sc-n" style={{ color: noteHex(Math.round(parseFloat(stats.avg))) }}>{stats.avg}</div><div className="sc-l">Nota média</div></div>
        <div className="sc"><div className="sc-n" style={{ color: "var(--ok)" }}>{stats.recP}%</div><div className="sc-l">Recomendariam</div></div>
        <div className="sc"><div className="sc-n" style={{ color: stats.nps >= 0 ? "var(--ok2)" : "var(--danger)" }}>{stats.nps > 0 ? "+" : ""}{stats.nps}</div><div className="sc-l">NPS Score</div></div>
      </div>
      <InsightChips />
      <div className="dash-toolbar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input className="search-box" placeholder="Buscar por nome ou resposta…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="filter-wrap">
          <button className={`btn-sm${filterAge ? " active" : ""}`} onClick={() => setShowFilter(!showFilter)}>🏷️ {filterAge || "Filtrar idade"}</button>
          {showFilter && (
            <div className="filter-dropdown">
              <div className={`filter-opt${!filterAge ? " active" : ""}`} onClick={() => { setFilterAge(null); setShowFilter(false); }}>
                <div className="filter-check">{!filterAge ? "✓" : ""}</div>Todas as idades
              </div>
              {ages.map((age) => (
                <div key={age} className={`filter-opt${filterAge === age ? " active" : ""}`} onClick={() => { setFilterAge(age); setShowFilter(false); }}>
                  <div className="filter-check">{filterAge === age ? "✓" : ""}</div>{age}
                </div>
              ))}
            </div>
          )}
        </div>
        <button className="btn-sm" onClick={() => exportJSON(filteredResps)}>↓ JSON</button>
        <button className="btn-sm" onClick={() => exportCSV(filteredResps)}>↓ CSV</button>
        <button className="btn-sm red" onClick={onClear}>🗑️ Limpar</button>
      </div>
      <div className="dash-tabs" style={{ marginTop: 20 }}>
        {tabs.map((t) => (<button key={t.id} className={`dash-tab${tab === t.id ? " on" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>))}
      </div>
      {tab === "overview" && <div><NotaCard /><RadarCard /><PieCard title="Perfil de gamer" field="games" /><PieCard title="Conhecimento financeiro" field="fin" /><PieCard title="Faixa etária" field="idade" /></div>}
      {tab === "gameplay" && <div>
        <BarCard title="Progressão nos dias" field="prog" color="#4338ca" />
        <BarCard title="Percepção do tempo" field="tempo" color="#d97706" />
        <BarCard title="Travamentos" field="travou" color="#dc2626" />
        <BarCard title="Percebeu consequências?" field="consq" color="#6366f1" />
        <BarCard title="Objetivo claro?" field="objetivo" color="#4338ca" />
        <BarCard title="Tutorial útil?" field="tutorial" color="#0d9488" />
        <BarCard title="Usou ferramentas?" field="tools" color="#14b8a6" />
        <BarCard title="Conseguiu iniciar?" field="iniciou" color="#0284c7" />
      </div>}
      {tab === "learning" && <div>
        <BarCard title="Aprendeu algo novo?" field="aprendeu" color="#0d9488" />
        <BarCard title="Cenários realistas?" field="realismo" color="#0d9488" />
        <BarCard title="Explicações de erro claras?" field="erros" color="#d97706" />
        <BarCard title="Mudaria hábito?" field="habito" color="#0d9488" />
        <BarCard title="Recomendaria?" field="recom" color="#14b8a6" />
        <BarCard title="Visual pixel art" field="visual" color="#6366f1" />
      </div>}
      {tab === "qualitative" && <div><TextAnswers field="gostou" label="O que mais gostaram" /><TextAnswers field="melhoria" label="O que pode ser melhorado" /><TextAnswers field="onde" label="Onde travaram" /></div>}
      {tab === "crosstab" && <CrossTab />}
      {tab === "responses" && <div><div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 14 }}>💡 Clique em uma resposta para expandir</div><ResponsesList /></div>}
    </div>
  );
}
