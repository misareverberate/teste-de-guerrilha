import type { Entry } from "./data";
import { supabase } from "./supabase";

const COLLECTOR_KEY = "ms_collector_name_v1";
const STRING_FIELDS = [
  "ts",
  "coletor",
  "nome",
  "idade",
  "games",
  "fin",
  "recom",
  "aprendeu",
  "travou",
  "gostou",
  "melhoria",
  "onde",
  "iniciou",
  "objetivo",
  "tutorial",
  "tools",
  "prog",
  "consq",
  "tempo",
  "realismo",
  "erros",
  "habito",
  "visual",
];

function normalizeEntry(value: unknown): Entry | null {
  if (!value || typeof value !== "object") return null;

  const entry = value as Record<string, unknown>;
  if (typeof entry.id !== "string" || typeof entry.ts !== "string") return null;

  const normalized: Entry = {
    id: entry.id,
    ts: entry.ts,
  };

  for (const field of STRING_FIELDS) {
    const fieldValue = entry[field];

    if (typeof fieldValue === "string") {
      normalized[field] = fieldValue;
    }
  }

  if (typeof entry.nota === "number" && Number.isFinite(entry.nota)) {
    normalized.nota = entry.nota;
  }

  return normalized;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function noteColorClass(n: number | undefined): string {
  if (!n) return "";
  if (n <= 2) return "red";
  if (n <= 4) return "orange";
  if (n <= 6) return "yellow";
  if (n <= 8) return "green";
  return "teal";
}

export function noteHex(n: number | undefined): string {
  if (!n) return "#94a3b8";
  if (n <= 2) return "#ef4444";
  if (n <= 4) return "#f97316";
  if (n <= 6) return "#eab308";
  if (n <= 8) return "#22c55e";
  return "#14b8a6";
}

export function noteBg(n: number | undefined): string {
  if (!n) return "transparent";
  if (n <= 2) return "#fef2f2";
  if (n <= 4) return "#fff7ed";
  if (n <= 6) return "#fefce8";
  if (n <= 8) return "#f0fdf4";
  return "#f0fdfa";
}

export function noteBorder(n: number | undefined): string {
  if (!n) return "#e2e8f0";
  if (n <= 2) return "#fca5a5";
  if (n <= 4) return "#fdba74";
  if (n <= 6) return "#fde047";
  if (n <= 8) return "#86efac";
  return "#5eead4";
}

function parseEntries(rows: Array<{ payload: unknown }>): Entry[] {
  return rows
    .map((row) => normalizeEntry(row.payload))
    .filter((entry): entry is Entry => entry !== null);
}

export async function responsesGet(): Promise<Entry[]> {
  if (!supabase) {
    throw new Error("Supabase não configurado.");
  }

  const { data, error } = await supabase
    .from("responses")
    .select("payload")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error("Não foi possível carregar as respostas.");
  }

  return parseEntries(data ?? []);
}

export async function responseInsert(entry: Entry): Promise<Entry[]> {
  if (!supabase) {
    throw new Error("Supabase não configurado.");
  }

  const normalizedEntry = normalizeEntry(entry);

  if (!normalizedEntry) {
    throw new Error("A resposta contém dados inválidos.");
  }

  const { error } = await supabase
    .from("responses")
    .insert({ id: normalizedEntry.id, ts: normalizedEntry.ts, payload: normalizedEntry });

  if (error) {
    throw new Error("Não foi possível salvar a resposta.");
  }

  return responsesGet();
}

export function collectorNameGet(): string {
  try {
    return localStorage.getItem(COLLECTOR_KEY)?.trim() ?? "";
  } catch {
    return "";
  }
}

export function collectorNameSet(name: string): void {
  try {
    localStorage.setItem(COLLECTOR_KEY, name.trim());
  } catch {}
}

export function createEntryId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `entry-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getStringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function exportJSON(resps: Entry[]): void {
  const blob = new Blob([JSON.stringify(resps, null, 2)], { type: "application/json;charset=utf-8" });
  downloadBlob(blob, "testes_mestres_sistema.json");
}

export function exportCSV(resps: Entry[]): void {
  if (!resps.length) return;
  const allKeys = [...new Set(resps.flatMap((r) => Object.keys(r)))];
  const header = allKeys.join(",");
  const rows = resps.map((r) =>
    allKeys.map((k) => JSON.stringify((r as Record<string, unknown>)[k] ?? "")).join(",")
  );
  const csv = [[header, ...rows].join("\n")];
  const blob = new Blob(["\uFEFF", ...csv], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, "testes_mestres_sistema.csv");
}
