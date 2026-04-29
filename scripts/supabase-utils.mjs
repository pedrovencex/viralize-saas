import fs from "node:fs";
import vm from "node:vm";

export const loadEnv = (file = ".env") => {
  if (!fs.existsSync(file)) return;

  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...rest] = trimmed.split("=");
    process.env[key.trim()] ||= rest.join("=").trim().replace(/^["']|["']$/g, "");
  }
};

export const requireEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Variavel obrigatoria ausente: ${key}`);
  }
  return value;
};

export const readWindowData = (file, variableName) => {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: file });
  return context.window[variableName] || [];
};

export const normalizeText = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export const parseCompactNumber = (value) => {
  const text = String(value || "").replace(/\s/g, "").replace(",", ".");
  const number = Number(text.replace(/[^\d.]/g, "")) || 0;

  if (/m/i.test(text)) return Math.round(number * 1000000);
  if (/k/i.test(text) || /mil/i.test(text)) return Math.round(number * 1000);
  return Math.round(number);
};

export const parseMoney = (value) => {
  const text = String(value || "").toLowerCase().replace(/\s/g, "");
  const compact = text.replace(/[^\d.,]/g, "");
  const number = compact.includes(",")
    ? Number(compact.replace(/\./g, "").replace(",", ".")) || 0
    : Number(compact.replace(/[^\d.]/g, "")) || 0;

  if (text.includes("mil")) return number * 1000;
  if (text.includes("k")) return number * 1000;
  if (text.includes("mi")) return number * 1000000;
  return number;
};

export const categoryFromNiche = (niche) => {
  const text = normalizeText(niche);
  if (text.includes("beleza")) return "Beleza & Cuidados Pessoais";
  if (text.includes("roupas")) return "Roupas Femininas";
  if (text.includes("saude") || text.includes("suplement")) return "Saude & Bem-Estar";
  return niche || "VIRALYZE";
};

export const postgrest = async ({ method = "GET", path, body, serviceRole = false }) => {
  const url = requireEnv("SUPABASE_URL");
  const key = requireEnv(serviceRole ? "SUPABASE_SERVICE_ROLE_KEY" : "SUPABASE_ANON_KEY");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
      prefer: "return=representation,resolution=merge-duplicates",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`${method} ${path} falhou (${response.status}): ${text}`);
  }

  return data;
};
