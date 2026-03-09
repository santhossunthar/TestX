import type { BackgroundEnvelope, InspectorEvent } from "../shared/types";
import { EventBuffer } from "./event-buffer";
import { PanelPortRegistry } from "./panel-port-registry";

const MAX_EVENTS = 5000;
const panelPorts = new PanelPortRegistry();
const eventBuffer = new EventBuffer(MAX_EVENTS);

const pushBuffered = (tabId: number, event: InspectorEvent) => {
  eventBuffer.push(tabId, event);
};

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "inspector-plus-panel") return;

  let tabId = -1;

  port.onMessage.addListener((msg: { kind: string; tabId?: number }) => {
    if (msg.kind === "register-panel" && typeof msg.tabId === "number") {
      tabId = msg.tabId;
      panelPorts.register(tabId, port);
      const buffered = eventBuffer.get(tabId);
      port.postMessage({ kind: "bootstrap", events: buffered });
    }
  });

  port.onDisconnect.addListener(() => {
    if (tabId >= 0) {
      panelPorts.unregister(tabId);
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
