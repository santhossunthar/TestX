import { createNetworkEvent } from "../shared/normalize";
import type { BackgroundEnvelope } from "../shared/types";

const tabId = chrome.devtools.inspectedWindow.tabId;

chrome.devtools.panels.create("TestX", "", "panel.html");

chrome.devtools.network.onRequestFinished.addListener((request) => {
  const event = createNetworkEvent(tabId, request);
  const envelope: BackgroundEnvelope = { kind: "event", tabId, event };
  chrome.runtime.sendMessage(envelope);
});
