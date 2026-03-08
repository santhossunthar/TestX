import type { InspectorEvent, StorageEvent } from "../shared/types";

const tabId = chrome.devtools.inspectedWindow.tabId;
const port = chrome.runtime.connect({ name: "inspector-plus-panel" });
port.postMessage({ kind: "register-panel", tabId });

const rowsEl = document.querySelector<HTMLTableSectionElement>("#rows");
const countEl = document.querySelector<HTMLDivElement>("#count");
const typeFilterEl = document.querySelector<HTMLSelectElement>("#typeFilter");
const searchInputEl = document.querySelector<HTMLInputElement>("#searchInput");
const snapshotBtnEl = document.querySelector<HTMLButtonElement>("#snapshotBtn");
const exportBtnEl = document.querySelector<HTMLButtonElement>("#exportBtn");

if (
  !rowsEl ||
  !countEl ||
  !typeFilterEl ||
  !searchInputEl ||
  !snapshotBtnEl ||
  !exportBtnEl
) {
  throw new Error("Panel DOM failed to initialize.");
}

let events: InspectorEvent[] = [];

const fmtTime = (ts: number): string => new Date(ts).toLocaleTimeString();

const mkDetails = (event: InspectorEvent): string => {
  if (event.type === "network") {
    return `${event.method} ${event.status} ${event.url} (${event.durationMs.toFixed(1)}ms, ${event.mimeType})`;
  }
  if (event.type === "console") {
    return `${event.level.toUpperCase()} ${event.args.join(" ")}`;
  }
  return `local=${event.localCount} [${event.localKeys.join(", ")}] | session=${event.sessionCount} [${event.sessionKeys.join(", ")}] | cookies=${event.cookieCount}`;
};

const filteredEvents = (): InspectorEvent[] => {
  const typeValue = typeFilterEl.value;
  const searchValue = searchInputEl.value.trim().toLowerCase();
  return events.filter((event) => {
    const typeOk = typeValue === "all" || event.type === typeValue;
    if (!typeOk) return false;
    if (!searchValue) return true;
    const details = mkDetails(event).toLowerCase();
    return details.includes(searchValue);
  });
};

const render = () => {
  const shown = filteredEvents();
  countEl.textContent = `${shown.length} shown / ${events.length} total`;
  rowsEl.innerHTML = shown
    .slice()
    .reverse()
    .map(
      (event) => `<tr>
        <td>${fmtTime(event.ts)}</td>
        <td>${event.type}</td>
        <td><pre>${mkDetails(event)}</pre></td>
      </tr>`
    )
    .join("");
};

port.onMessage.addListener((msg: { kind: string; events?: InspectorEvent[]; event?: InspectorEvent }) => {
  if (msg.kind === "bootstrap" && msg.events) {
    events = msg.events;
    render();
  }
  if (msg.kind === "event" && msg.event) {
    events.push(msg.event);
    render();
  }
});

const collectStorage = async (): Promise<StorageEvent> =>
  new Promise((resolve, reject) => {
    const expr = `(() => {
      const safeKeys = (obj) => {
        try { return Object.keys(obj || {}); } catch { return []; }
      };
      const localKeys = safeKeys(window.localStorage);
      const sessionKeys = safeKeys(window.sessionStorage);
      const cookieCount = document.cookie ? document.cookie.split(";").filter(Boolean).length : 0;
      return {
        localCount: localKeys.length,
        sessionCount: sessionKeys.length,
        cookieCount,
        localKeys,
        sessionKeys
      };
    })();`;

    chrome.devtools.inspectedWindow.eval(expr, (result, exceptionInfo) => {
      if (exceptionInfo?.isException || !result) {
        reject(new Error("Failed to read storage values from inspected page."));
        return;
      }

      const data = result as Omit<StorageEvent, "id" | "tabId" | "ts" | "type">;
      resolve({
        id: crypto.randomUUID(),
        tabId,
        ts: Date.now(),
        type: "storage",
        localCount: data.localCount ?? 0,
        sessionCount: data.sessionCount ?? 0,
        cookieCount: data.cookieCount ?? 0,
        localKeys: Array.isArray(data.localKeys) ? data.localKeys : [],
        sessionKeys: Array.isArray(data.sessionKeys) ? data.sessionKeys : []
      });
    });
  });

typeFilterEl.addEventListener("change", render);
searchInputEl.addEventListener("input", render);

snapshotBtnEl.addEventListener("click", async () => {
  try {
    const event = await collectStorage();
    events.push(event);
    render();
    chrome.runtime.sendMessage({ kind: "event", tabId, event });
  } catch (error) {
    console.error(error);
  }
});

exportBtnEl.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(events, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `inspector-plus-${tabId}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
});
