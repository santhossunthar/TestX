import type { BackgroundEnvelope, InspectorEvent } from "../shared/types";

const panelPorts = new Map<number, chrome.runtime.Port>();
const eventBuffer = new Map<number, InspectorEvent[]>();
const MAX_EVENTS = 5000;

const pushBuffered = (tabId: number, event: InspectorEvent) => {
  const current = eventBuffer.get(tabId) ?? [];
  current.push(event);
  if (current.length > MAX_EVENTS) {
    current.splice(0, current.length - MAX_EVENTS);
  }
  eventBuffer.set(tabId, current);
};

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "inspector-plus-panel") return;

  let tabId = -1;

  port.onMessage.addListener((msg: { kind: string; tabId?: number }) => {
    if (msg.kind === "register-panel" && typeof msg.tabId === "number") {
      tabId = msg.tabId;
      panelPorts.set(tabId, port);
      const buffered = eventBuffer.get(tabId) ?? [];
      port.postMessage({ kind: "bootstrap", events: buffered });
    }
  });

  port.onDisconnect.addListener(() => {
    if (tabId >= 0) {
      panelPorts.delete(tabId);
    }
  });
});

chrome.runtime.onMessage.addListener((message: unknown, sender, sendResponse) => {
  if ((message as { kind?: string })?.kind === "get-tab-id") {
    sendResponse({ tabId: sender.tab?.id });
    return;
  }

  const payload = message as BackgroundEnvelope;
  if (payload?.kind !== "event" || typeof payload.tabId !== "number") return;

  pushBuffered(payload.tabId, payload.event);
  const port = panelPorts.get(payload.tabId);
  if (port) {
    port.postMessage({ kind: "event", event: payload.event });
  }
});
