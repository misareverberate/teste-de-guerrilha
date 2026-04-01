import { STORAGE_KEY, type Entry } from "./data";

function isStoredEntry(value: unknown): value is Entry {
  if (!value || typeof value !== "object") return false;

  const entry = value as Record<string, unknown>;
  return typeof entry.id === "number" && typeof entry.ts === "string";
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

export async function storageGet(): Promise<Entry[]> {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v) {
      const parsed: unknown = JSON.parse(v);
      if (Array.isArray(parsed)) return parsed.filter(isStoredEntry);
    }
  } catch {}
  return [];
}

export async function storageSet(data: Entry[]): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
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
