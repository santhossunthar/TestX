import { load as loadYaml } from "js-yaml";
import type { DiscoveredEndpoint, HttpMethod, WorkflowStep } from "./domain";

export const normalizeBaseSiteUrl = (raw: string): string => {
  const parsed = new URL(raw);
  return parsed.origin;
};

export const isWebSocketUrl = (rawUrl: string): boolean => /^wss?:\/\//i.test(rawUrl.trim());

export const parseHeaders = (raw: string): Record<string, string> => {
  const value = raw.trim();
  if (!value) return {};

  if (value.startsWith("{")) {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    const headers: Record<string, string> = {};
    Object.entries(parsed).forEach(([key, headerValue]) => {
      headers[key] = String(headerValue);
    });
    return headers;
  }

  const headers: Record<string, string> = {};
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const idx = line.indexOf(":");
      if (idx <= 0) return;
      const key = line.slice(0, idx).trim();
      const headerValue = line.slice(idx + 1).trim();
      headers[key] = headerValue;
    });

  return headers;
};

export const normalizeHeaders = (headers: WorkflowStep["headers"]): Record<string, string> => {
  if (!headers) return {};
  if (typeof headers === "string") return parseHeaders(headers);
  const out: Record<string, string> = {};
  Object.entries(headers).forEach(([k, v]) => {
    out[k] = String(v);
  });
  return out;
};

export const getEndpointConfigKey = (method: HttpMethod, url: string): string => `${method} ${url}`;

export const formatHeadersText = (headers: Record<string, string>): string =>
  Object.entries(headers)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

export const getSuggestedHeadersForEndpoint = (endpoint: DiscoveredEndpoint): Record<string, string> => {
  const out: Record<string, string> = { Accept: "application/json" };
  const lowerUrl = endpoint.url.toLowerCase();
  const lowerGroup = endpoint.group.toLowerCase();
  const needsJsonBody = ["POST", "PUT", "PATCH"].includes(endpoint.method) || lowerUrl.includes("graphql");
  if (needsJsonBody) {
    out["Content-Type"] = "application/json";
  }

  const authLike =
    lowerGroup.includes("auth") || /(auth|login|signin|signup|token|session)/i.test(lowerUrl);
  const basicAuthLike = /(basic[-_/]?auth|\/basic\/|\/basic$)/i.test(lowerUrl) || lowerGroup.includes("basic auth");
  if (basicAuthLike) {
    out.Authorization = "Basic <base64(username:password)>";
  } else if (authLike) {
    out.Authorization = "Bearer <token>";
  }

  if (/(api[-_]?key|apikey)/i.test(lowerUrl)) {
    out["x-api-key"] = "<api-key>";
  }
  return out;
};

export const getSuggestedHeadersText = (endpoint: DiscoveredEndpoint): string =>
  formatHeadersText(getSuggestedHeadersForEndpoint(endpoint));

export const extractJsonObject = (raw: string): string => {
  const first = raw.indexOf("{");
  const last = raw.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) {
    throw new Error("AI did not return a JSON object.");
  }
  return raw.slice(first, last + 1);
};

export const joinUrl = (base: string, path: string): string => {
  if (!base) return path;
  if (/^https?:\/\//i.test(path)) return path;
  const left = base.endsWith("/") ? base.slice(0, -1) : base;
  const right = path.startsWith("/") ? path : `/${path}`;
  return `${left}${right}`;
};

export const detectBaseUrl = (spec: Record<string, unknown>): string => {
  const openApiServers = spec.servers as Array<{ url?: string }> | undefined;
  if (Array.isArray(openApiServers) && openApiServers[0]?.url) {
    return String(openApiServers[0].url);
  }

  const host = typeof spec.host === "string" ? spec.host : "";
  const basePath = typeof spec.basePath === "string" ? spec.basePath : "";
  const schemes = Array.isArray(spec.schemes) ? spec.schemes : [];
  const scheme = typeof schemes[0] === "string" ? schemes[0] : "https";
  if (host) {
    return `${scheme}://${host}${basePath}`;
  }

  return "";
};

export const parseSpecText = (raw: string): Record<string, unknown> => {
  const text = raw.trim();
  if (!text) throw new Error("Swagger/OpenAPI content is empty.");

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    const parsed = loadYaml(text);
    if (!parsed || typeof parsed !== "object") {
      throw new Error("Invalid Swagger/OpenAPI format.");
    }
    return parsed as Record<string, unknown>;
  }
};

export const normalizeDiscoveredGroup = (value: string): string => {
  const trimmed = value.trim();
  return trimmed || "General";
};

export const inferGroupFromEndpointUrl = (url: string): string => {
  const value = url.toLowerCase();
  if (/^wss?:\/\//.test(value) || /(websocket|socket\.io|\/socket|\/ws\/|\/ws$|\/realtime)/.test(value)) {
    return "Realtime";
  }
  if (/(supabase|firebase|auth0|clerk|stripe|hasura|postgrest)/.test(value)) {
    return "Integrations";
  }
  if (/(auth|login|logout|signup|signin|token|oauth|password|refresh)/.test(value)) {
    return "Authentication";
  }
  if (/(user|users|profile|account|member|customer)/.test(value)) {
    return "User Management";
  }
  if (/(role|permission|acl|admin)/.test(value)) {
    return "Access Control";
  }
  if (/(order|cart|checkout|invoice|payment|billing|subscription)/.test(value)) {
    return "Commerce & Billing";
  }
  if (/(product|catalog|item|inventory)/.test(value)) {
    return "Catalog";
  }
  if (/(search|query|filter|suggest)/.test(value)) {
    return "Search";
  }
  if (/(notify|notification|message|email|sms|webhook)/.test(value)) {
    return "Notifications";
  }
  if (/(content|post|article|comment|media|upload|file)/.test(value)) {
    return "Content";
  }
  return "General";
};

export const redactText = (value: string): string =>
  value
    .replace(/(authorization\s*:\s*bearer\s+)[^\s"']+/gi, "$1[REDACTED]")
    .replace(/(api[_-]?key|token|secret|password)\s*[:=]\s*([^\s,"']+)/gi, "$1=[REDACTED]");

export const sanitizeUrlForAi = (rawUrl: string): string => {
  try {
    const url = new URL(rawUrl);
    url.username = "";
    url.password = "";
    Array.from(url.searchParams.keys()).forEach((key) => {
      url.searchParams.set(key, "[REDACTED]");
    });
    return url.toString();
  } catch {
    return redactText(rawUrl);
  }
};

export const discoverLinksFromHtml = (
  html: string,
  baseUrl: string
): { links: string[]; candidates: string[] } => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const links = new Set<string>();
  const candidates = new Set<string>();

  doc.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((anchor) => {
    try {
      const normalized = new URL(anchor.href, baseUrl).toString();
      links.add(normalized);
    } catch {}
  });

  const candidateRegex =
    /((?:https?|wss?):\/\/[^\s"'`<>]+|\/(?:api|v1|v2|v3|graphql|rest|ws|socket|realtime)[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]*)/gi;
  const scriptText = Array.from(doc.querySelectorAll("script"))
    .map((script) => script.textContent || "")
    .join("\n");
  const combined = `${html}\n${scriptText}`;
  let match: RegExpExecArray | null;
  while ((match = candidateRegex.exec(combined)) !== null) {
    const raw = match[1];
    try {
      const normalized = /^(https?|wss?):/i.test(raw) ? new URL(raw).toString() : new URL(raw, baseUrl).toString();
      candidates.add(normalized);
    } catch {}
  }

  return { links: Array.from(links), candidates: Array.from(candidates) };
};

const scoreCandidateUrl = (rawUrl: string): number => {
  const value = rawUrl.toLowerCase();
  let score = 0;
  if (/supabase\.co/.test(value)) score += 80;
  if (/^wss?:\/\//.test(value)) score += 75;
  if (/(api|graphql|rest\/v\d+|functions\/v\d+|auth\/v\d+|storage\/v\d+)/.test(value)) score += 50;
  if (/(websocket|socket\.io|\/socket|\/ws\/|\/ws$|\/realtime)/.test(value)) score += 45;
  if (/(\/v1\/|\/v2\/|\/v3\/|\/rpc\/|\/edge\/|\/function)/.test(value)) score += 30;
  if (/(firebase|hasura|stripe|auth0|clerk|postgrest)/.test(value)) score += 25;
  if (/[?&](apikey|token|auth|project|anon)=/i.test(rawUrl)) score += 10;
  if (/\.css($|\?)/.test(value) || /\.png($|\?)/.test(value) || /\.jpg($|\?)/.test(value)) score -= 40;
  return score;
};

export const prioritizeCandidates = (candidates: string[], limit: number): string[] =>
  candidates
    .slice()
    .sort((a, b) => scoreCandidateUrl(b) - scoreCandidateUrl(a))
    .slice(0, limit);

export const extractHeuristicEndpointsFromCandidates = (candidates: string[]): DiscoveredEndpoint[] => {
  const out = new Map<string, DiscoveredEndpoint>();

  candidates.forEach((rawUrl) => {
    let parsed: URL;
    try {
      parsed = new URL(rawUrl);
    } catch {
      return;
    }

    const value = parsed.toString().toLowerCase();
    const isWebSocket = /^wss?:\/\//.test(value);
    const looksLikeApi =
      isWebSocket ||
      /supabase\.co/.test(value) ||
      /(\/api\/|\/graphql|\/rest\/v\d+|\/functions\/v\d+|\/auth\/v\d+|\/storage\/v\d+|\/rpc\/|\/socket|\/ws\/|\/ws$|\/realtime)/.test(value);
    if (!looksLikeApi) return;

    const method: HttpMethod = /\/rpc\/|\/auth\/v\d+\/token/.test(value) ? "POST" : "GET";
    const group = normalizeDiscoveredGroup(inferGroupFromEndpointUrl(parsed.toString()));
    const key = `${method} ${parsed.toString()}`;
    if (out.has(key)) return;

    out.set(key, {
      id: crypto.randomUUID(),
      url: parsed.toString(),
      method,
      group,
      confidence: 0.65,
      reason: "Heuristic discovery from runtime/crawl candidate URL."
    });
  });

  return Array.from(out.values());
};

export const sanitizeDiscoveredUrl = (rawUrl: string): string => {
  try {
    const parsed = new URL(rawUrl);
    parsed.hash = "";
    Array.from(parsed.searchParams.keys()).forEach((key) => {
      if (/(api[_-]?key|token|secret|password|auth|signature|sig|jwt)/i.test(key)) {
        parsed.searchParams.set(key, "[REDACTED]");
      }
    });
    return parsed.toString();
  } catch {
    return rawUrl;
  }
};

export const isLikelyApiRequest = (url: string, method: HttpMethod, mimeType: string): boolean => {
  const value = url.toLowerCase();
  if (/^wss?:\/\//.test(value)) {
    return true;
  }
  if (/(api|graphql|rest\/v\d+|auth\/v\d+|functions\/v\d+|storage\/v\d+|rpc\/|oauth|token|session|login|signup|register)/.test(value)) {
    return true;
  }
  if (/(websocket|socket\.io|\/socket|\/ws\/|\/ws$|\/realtime)/.test(value)) {
    return true;
  }
  if (/(supabase\.co|firebase|hasura|postgrest|auth0|clerk|okta)/.test(value)) {
    return true;
  }
  if (method !== "GET" && /(json|graphql|javascript)/i.test(mimeType)) {
    return true;
  }
  if (method !== "GET" && /\/v\d+\//.test(value)) {
    return true;
  }
  return false;
};
