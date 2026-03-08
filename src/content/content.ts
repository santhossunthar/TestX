import type { BackgroundEnvelope, PageConsolePayload } from "../shared/types";
import { createConsoleEvent } from "../shared/normalize";

const injectPageHook = () => {
  if (document.documentElement.dataset.inspectorPlusInjected === "1") return;

  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("page-hook.js");
  script.async = false;
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);
  document.documentElement.dataset.inspectorPlusInjected = "1";
};

injectPageHook();

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  const payload = event.data as PageConsolePayload;
  if (payload?.source !== "inspector-plus" || payload.kind !== "console") return;

  chrome.runtime.sendMessage({ kind: "get-tab-id" }, (response: { tabId?: number }) => {
    const tabId = response?.tabId;
    if (typeof tabId !== "number") return;
    const inspectorEvent = createConsoleEvent(tabId, payload.level, payload.args, payload.ts);
    const envelope: BackgroundEnvelope = { kind: "event", tabId, event: inspectorEvent };
    chrome.runtime.sendMessage(envelope);
  });
});
