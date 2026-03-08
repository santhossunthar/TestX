export type EventType = "network" | "console" | "storage";

export interface BaseEvent {
  id: string;
  tabId: number;
  ts: number;
  type: EventType;
}

export interface NetworkEvent extends BaseEvent {
  type: "network";
  url: string;
  method: string;
  status: number;
  durationMs: number;
  mimeType: string;
}

export interface ConsoleEvent extends BaseEvent {
  type: "console";
  level: "log" | "info" | "warn" | "error";
  args: string[];
}

export interface StorageEvent extends BaseEvent {
  type: "storage";
  localCount: number;
  sessionCount: number;
  cookieCount: number;
  localKeys: string[];
  sessionKeys: string[];
}

export type InspectorEvent = NetworkEvent | ConsoleEvent | StorageEvent;

export interface PageConsolePayload {
  source: "inspector-plus";
  kind: "console";
  level: "log" | "info" | "warn" | "error";
  args: unknown[];
  ts: number;
}

export interface BackgroundEnvelope {
  kind: "event";
  tabId: number;
  event: InspectorEvent;
}
