import type { ConsoleEvent, NetworkEvent } from "./types";

const asSafeString = (input: unknown): string => {
  if (typeof input === "string") return input;
  try {
    return JSON.stringify(input);
  } catch {
    return String(input);
  }
};

export const createNetworkEvent = (
  tabId: number,
  request: chrome.devtools.network.Request
): NetworkEvent => {
  const finished = request.time ?? 0;
  const started = request.startedDateTime
    ? new Date(request.startedDateTime).getTime()
    : Date.now();

  return {
    id: crypto.randomUUID(),
    tabId,
    ts: finished || Date.now(),
    type: "network",
    url: request.request.url,
    method: request.request.method,
    status: request.response.status,
    durationMs: Math.max(0, finished - started),
    mimeType: request.response.content.mimeType || "unknown"
  };
};

export const createConsoleEvent = (
  tabId: number,
  level: ConsoleEvent["level"],
  args: unknown[],
  ts: number
): ConsoleEvent => ({
  id: crypto.randomUUID(),
  tabId,
  ts,
  type: "console",
  level,
  args: args.map(asSafeString)
});
