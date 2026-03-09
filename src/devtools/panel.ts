import {
  AI_PROVIDER_PRESETS,
  METHOD_SET,
  defaultAppState,
  defaultWorkspaceSetup,
  type AiProvider,
  type ApiGroup,
  type ApiRoute,
  type AppState,
  type AuthMode,
  type DiscoveredEndpoint,
  type EndpointTestResult,
  type HttpMethod,
  type ImportedRoute,
  type RepeaterEntry,
  type Theme,
  type WorkflowPlan,
  type WorkflowStep,
  type WorkspaceItem,
  type WorkspaceSetup
} from "./features/core/domain";
import {
  ACTIVE_WORKSPACE_KEY,
  AI_SESSION_KEY,
  THEME_KEY,
  clearPersistentApiKey,
  clearWorkspaceRequestHeaders,
  clearWorkspaceSecrets,
  createWorkspaceItem,
  getPersistentApiKey,
  initializeWorkspaces,
  readAiSettings,
  readWorkspaceDiscoveredEndpoints,
  readWorkspaceRequestHeaders,
  readWorkspaceSecrets,
  readWorkspaceSetup,
  readWorkspaceState,
  saveAiSettings as persistAiSettings,
  saveWorkspaceDiscoveredEndpoints,
  saveWorkspaceRequestHeaders,
  saveWorkspaceSecrets,
  saveWorkspaceSetup,
  saveWorkspaceState,
  saveWorkspaces,
  setPersistentApiKey
} from "./features/core/storage";
import {
  detectBaseUrl,
  discoverLinksFromHtml,
  extractHeuristicEndpointsFromCandidates,
  getEndpointConfigKey,
  getSuggestedHeadersForEndpoint,
  getSuggestedHeadersText,
  inferGroupFromEndpointUrl,
  isLikelyApiRequest,
  joinUrl,
  isWebSocketUrl,
  normalizeBaseSiteUrl,
  normalizeDiscoveredGroup,
  normalizeHeaders,
  parseHeaders,
  parseSpecText,
  prioritizeCandidates,
  redactText,
  sanitizeDiscoveredUrl,
  sanitizeUrlForAi
} from "./features/core/helpers";
import { callAiForJson } from "./features/ai/client";
import { createSecretsFeature } from "./features/secrets/controller";

const groupNameInput = document.querySelector<HTMLInputElement>("#groupNameInput");
const addGroupBtn = document.querySelector<HTMLButtonElement>("#addGroupBtn");
const routeNameInput = document.querySelector<HTMLInputElement>("#routeNameInput");
const routeMethodInput = document.querySelector<HTMLSelectElement>("#routeMethodInput");
const routeUrlInput = document.querySelector<HTMLInputElement>("#routeUrlInput");
const routeGroupSelect = document.querySelector<HTMLSelectElement>("#routeGroupSelect");
const addRouteBtn = document.querySelector<HTMLButtonElement>("#addRouteBtn");
const routeTree = document.querySelector<HTMLDivElement>("#routeTree");
const swaggerUrlInput = document.querySelector<HTMLInputElement>("#swaggerUrlInput");
const importSwaggerUrlBtn = document.querySelector<HTMLButtonElement>("#importSwaggerUrlBtn");
const swaggerSpecInput = document.querySelector<HTMLTextAreaElement>("#swaggerSpecInput");
const importSwaggerTextBtn = document.querySelector<HTMLButtonElement>("#importSwaggerTextBtn");
const importStatus = document.querySelector<HTMLDivElement>("#importStatus");
const workspaceSelect = document.querySelector<HTMLSelectElement>("#workspaceSelect");
const workspaceNameInput = document.querySelector<HTMLInputElement>("#workspaceNameInput");
const createWorkspaceBtn = document.querySelector<HTMLButtonElement>("#createWorkspaceBtn");
const saveWorkspaceBtn = document.querySelector<HTMLButtonElement>("#saveWorkspaceBtn");
const clearWorkspaceBtn = document.querySelector<HTMLButtonElement>("#clearWorkspaceBtn");
const workspaceStatus = document.querySelector<HTMLDivElement>("#workspaceStatus");
const workspaceAnalytics = document.querySelector<HTMLDivElement>("#workspaceAnalytics");
const siteBaseUrlInput = document.querySelector<HTMLInputElement>("#siteBaseUrlInput");
const siteMaxPagesInput = document.querySelector<HTMLInputElement>("#siteMaxPagesInput");
const passiveDiscoveryEnabledInput = document.querySelector<HTMLInputElement>("#passiveDiscoveryEnabledInput");
const proxyDiscoveryEnabledInput = document.querySelector<HTMLInputElement>("#proxyDiscoveryEnabledInput");
const startSiteTestingBtn = document.querySelector<HTMLButtonElement>("#startSiteTestingBtn");
const authModeSelect = document.querySelector<HTMLSelectElement>("#authModeSelect");
const authEmailInput = document.querySelector<HTMLInputElement>("#authEmailInput");
const authUsernameInput = document.querySelector<HTMLInputElement>("#authUsernameInput");
const authPasswordInput = document.querySelector<HTMLInputElement>("#authPasswordInput");
const authConfirmPasswordInput = document.querySelector<HTMLInputElement>("#authConfirmPasswordInput");
const authRequiresManualStepInput = document.querySelector<HTMLInputElement>("#authRequiresManualStepInput");
const runAuthDiscoveryBtn = document.querySelector<HTMLButtonElement>("#runAuthDiscoveryBtn");
const continueAuthDiscoveryBtn = document.querySelector<HTMLButtonElement>("#continueAuthDiscoveryBtn");
const cancelAuthSessionBtn = document.querySelector<HTMLButtonElement>("#cancelAuthSessionBtn");
const authStatus = document.querySelector<HTMLDivElement>("#authStatus");
const addDiscoveredRoutesBtn = document.querySelector<HTMLButtonElement>("#addDiscoveredRoutesBtn");
const testSelectAllInput = document.querySelector<HTMLInputElement>("#testSelectAllInput");
const runEndpointTestingBtn = document.querySelector<HTMLButtonElement>("#runEndpointTestingBtn");
const endpointTestingStatus = document.querySelector<HTMLDivElement>("#endpointTestingStatus");
const requestHeadersStatus = document.querySelector<HTMLDivElement>("#requestHeadersStatus");
const requestHeadersList = document.querySelector<HTMLDivElement>("#requestHeadersList");
const siteStatus = document.querySelector<HTMLDivElement>("#siteStatus");
const proxyTrafficStatus = document.querySelector<HTMLDivElement>("#proxyTrafficStatus");
const proxyTrafficList = document.querySelector<HTMLDivElement>("#proxyTrafficList");
const proxyTrafficHead = document.querySelector<HTMLDivElement>(".proxy-table-head");
const proxyDetailPane = document.querySelector<HTMLElement>(".proxy-detail-pane");
const clearProxyTrafficBtn = document.querySelector<HTMLButtonElement>("#clearProxyTrafficBtn");
const proxyHttpTabBtn = document.querySelector<HTMLButtonElement>("#proxyHttpTabBtn");
const proxyWebSocketTabBtn = document.querySelector<HTMLButtonElement>("#proxyWebSocketTabBtn");
const proxyRequestBody = document.querySelector<HTMLPreElement>("#proxyRequestBody");
const proxyResponseBody = document.querySelector<HTMLPreElement>("#proxyResponseBody");
const proxyDetailGrid = document.querySelector<HTMLDivElement>("#proxyDetailGrid");
const proxyRequestCol = document.querySelector<HTMLElement>("#proxyRequestCol");
const proxyResponseCol = document.querySelector<HTMLElement>("#proxyResponseCol");
const testEndpointsList = document.querySelector<HTMLDivElement>("#testEndpointsList");
const testResultsList = document.querySelector<HTMLDivElement>("#testResultsList");
const manageEndpointsList = document.querySelector<HTMLDivElement>("#manageEndpointsList");
const repeaterTabs = document.querySelector<HTMLDivElement>("#repeaterTabs");
const repeaterEmptyState = document.querySelector<HTMLDivElement>("#repeaterEmptyState");
const repeaterView = document.querySelector<HTMLDivElement>("#repeaterView");
const repeaterMethodInput = document.querySelector<HTMLSelectElement>("#repeaterMethodInput");
const repeaterUrlInput = document.querySelector<HTMLInputElement>("#repeaterUrlInput");
const repeaterHeadersInput = document.querySelector<HTMLTextAreaElement>("#repeaterHeadersInput");
const repeaterBodyInput = document.querySelector<HTMLTextAreaElement>("#repeaterBodyInput");
const repeaterSendBtn = document.querySelector<HTMLButtonElement>("#repeaterSendBtn");
const repeaterResponseMeta = document.querySelector<HTMLSpanElement>("#repeaterResponseMeta");
const repeaterResponseHeaders = document.querySelector<HTMLPreElement>("#repeaterResponseHeaders");
const repeaterResponseBody = document.querySelector<HTMLPreElement>("#repeaterResponseBody");
const secretDomainInput = document.querySelector<HTMLInputElement>("#secretDomainInput");
const useCurrentSiteDomainBtn = document.querySelector<HTMLButtonElement>("#useCurrentSiteDomainBtn");
const secretKeyInput = document.querySelector<HTMLInputElement>("#secretKeyInput");
const secretValueInput = document.querySelector<HTMLInputElement>("#secretValueInput");
const secretPlacementInput = document.querySelector<HTMLSelectElement>("#secretPlacementInput");
const secretEnabledInput = document.querySelector<HTMLInputElement>("#secretEnabledInput");
const saveSecretBtn = document.querySelector<HTMLButtonElement>("#saveSecretBtn");
const cancelSecretEditBtn = document.querySelector<HTMLButtonElement>("#cancelSecretEditBtn");
const secretsStatus = document.querySelector<HTMLDivElement>("#secretsStatus");
const secretsList = document.querySelector<HTMLDivElement>("#secretsList");
const manageEndpointUrlInput = document.querySelector<HTMLInputElement>("#manageEndpointUrlInput");
const manageEndpointMethodInput = document.querySelector<HTMLSelectElement>("#manageEndpointMethodInput");
const manageEndpointGroupInput = document.querySelector<HTMLInputElement>("#manageEndpointGroupInput");
const manageEndpointReasonInput = document.querySelector<HTMLInputElement>("#manageEndpointReasonInput");
const saveManagedEndpointBtn = document.querySelector<HTMLButtonElement>("#saveManagedEndpointBtn");
const cancelManagedEndpointEditBtn = document.querySelector<HTMLButtonElement>("#cancelManagedEndpointEditBtn");
const manageGroupSelect = document.querySelector<HTMLSelectElement>("#manageGroupSelect");
const manageGroupNameInput = document.querySelector<HTMLInputElement>("#manageGroupNameInput");
const renameGroupBtn = document.querySelector<HTMLButtonElement>("#renameGroupBtn");
const manageEndpointStatus = document.querySelector<HTMLDivElement>("#manageEndpointStatus");
const aiProviderSelect = document.querySelector<HTMLSelectElement>("#aiProviderSelect");
const aiEndpointInput = document.querySelector<HTMLInputElement>("#aiEndpointInput");
const aiModelInput = document.querySelector<HTMLInputElement>("#aiModelInput");
const aiApiKeyInput = document.querySelector<HTMLInputElement>("#aiApiKeyInput");
const aiRememberKeyInput = document.querySelector<HTMLInputElement>("#aiRememberKeyInput");
const aiOneTimeKeyInput = document.querySelector<HTMLInputElement>("#aiOneTimeKeyInput");
const aiAutoClearMinutesInput = document.querySelector<HTMLInputElement>("#aiAutoClearMinutesInput");
const aiAllowUnsafeEndpointInput = document.querySelector<HTMLInputElement>("#aiAllowUnsafeEndpointInput");
const clearAiKeyBtn = document.querySelector<HTMLButtonElement>("#clearAiKeyBtn");
const aiPrivacyModeInput = document.querySelector<HTMLInputElement>("#aiPrivacyModeInput");
const aiAllowSensitiveInput = document.querySelector<HTMLInputElement>("#aiAllowSensitiveInput");
const aiPromptInput = document.querySelector<HTMLTextAreaElement>("#aiPromptInput");
const saveAiSettingsBtn = document.querySelector<HTMLButtonElement>("#saveAiSettingsBtn");
const planAiWorkflowBtn = document.querySelector<HTMLButtonElement>("#planAiWorkflowBtn");
const runAiWorkflowBtn = document.querySelector<HTMLButtonElement>("#runAiWorkflowBtn");
const aiStatus = document.querySelector<HTMLDivElement>("#aiStatus");
const aiWorkflowPreview = document.querySelector<HTMLPreElement>("#aiWorkflowPreview");

const tester = document.querySelector<HTMLDivElement>("#tester");
const emptyState = document.querySelector<HTMLDivElement>("#emptyState");
const selectedRouteName = document.querySelector<HTMLInputElement>("#selectedRouteName");
const selectedRouteMethod = document.querySelector<HTMLSelectElement>("#selectedRouteMethod");
const selectedRouteGroup = document.querySelector<HTMLSelectElement>("#selectedRouteGroup");
const selectedRouteUrl = document.querySelector<HTMLInputElement>("#selectedRouteUrl");
const selectedRouteHeaders = document.querySelector<HTMLTextAreaElement>("#selectedRouteHeaders");
const selectedRouteBody = document.querySelector<HTMLTextAreaElement>("#selectedRouteBody");
const saveRouteBtn = document.querySelector<HTMLButtonElement>("#saveRouteBtn");
const deleteRouteBtn = document.querySelector<HTMLButtonElement>("#deleteRouteBtn");
const sendRequestBtn = document.querySelector<HTMLButtonElement>("#sendRequestBtn");
const responseMeta = document.querySelector<HTMLSpanElement>("#responseMeta");
const responseHeaders = document.querySelector<HTMLPreElement>("#responseHeaders");
const responseBody = document.querySelector<HTMLPreElement>("#responseBody");
const confirmModal = document.querySelector<HTMLDivElement>("#confirmModal");
const confirmModalTitle = document.querySelector<HTMLHeadingElement>("#confirmModalTitle");
const confirmModalMessage = document.querySelector<HTMLParagraphElement>("#confirmModalMessage");
const confirmModalConfirmBtn = document.querySelector<HTMLButtonElement>("#confirmModalConfirmBtn");
const confirmModalCancelBtn = document.querySelector<HTMLButtonElement>("#confirmModalCancelBtn");
const endpointContextMenu = document.querySelector<HTMLDivElement>("#endpointContextMenu");
const sendToRepeaterMenuItem = document.querySelector<HTMLButtonElement>("#sendToRepeaterMenuItem");

const themeToggleEl = document.querySelector<HTMLButtonElement>("#themeToggle");
const themeIconEl = document.querySelector<HTMLSpanElement>("#themeIcon");
const themeModeText = document.querySelector<HTMLSpanElement>("#themeModeText");
const devRefreshBtn = document.querySelector<HTMLButtonElement>("#devRefreshBtn");
const navItems = Array.from(document.querySelectorAll<HTMLButtonElement>(".nav-item"));
const pages = Array.from(document.querySelectorAll<HTMLElement>(".page"));

if (
  !groupNameInput ||
  !addGroupBtn ||
  !routeNameInput ||
  !routeMethodInput ||
  !routeUrlInput ||
  !routeGroupSelect ||
  !addRouteBtn ||
  !routeTree ||
  !swaggerUrlInput ||
  !importSwaggerUrlBtn ||
  !swaggerSpecInput ||
  !importSwaggerTextBtn ||
  !importStatus ||
  !workspaceSelect ||
  !workspaceNameInput ||
  !createWorkspaceBtn ||
  !saveWorkspaceBtn ||
  !clearWorkspaceBtn ||
  !workspaceStatus ||
  !workspaceAnalytics ||
  !siteBaseUrlInput ||
  !siteMaxPagesInput ||
  !passiveDiscoveryEnabledInput ||
  !proxyDiscoveryEnabledInput ||
  !startSiteTestingBtn ||
  !authModeSelect ||
  !authEmailInput ||
  !authUsernameInput ||
  !authPasswordInput ||
  !authConfirmPasswordInput ||
  !authRequiresManualStepInput ||
  !runAuthDiscoveryBtn ||
  !continueAuthDiscoveryBtn ||
  !cancelAuthSessionBtn ||
  !authStatus ||
  !addDiscoveredRoutesBtn ||
  !testSelectAllInput ||
  !runEndpointTestingBtn ||
  !endpointTestingStatus ||
  !requestHeadersStatus ||
  !requestHeadersList ||
  !siteStatus ||
  !proxyTrafficStatus ||
  !proxyTrafficList ||
  !proxyTrafficHead ||
  !proxyDetailPane ||
  !clearProxyTrafficBtn ||
  !proxyHttpTabBtn ||
  !proxyWebSocketTabBtn ||
  !proxyRequestBody ||
  !proxyResponseBody ||
  !proxyDetailGrid ||
  !proxyRequestCol ||
  !proxyResponseCol ||
  !testEndpointsList ||
  !testResultsList ||
  !manageEndpointsList ||
  !repeaterTabs ||
  !repeaterEmptyState ||
  !repeaterView ||
  !repeaterMethodInput ||
  !repeaterUrlInput ||
  !repeaterHeadersInput ||
  !repeaterBodyInput ||
  !repeaterSendBtn ||
  !repeaterResponseMeta ||
  !repeaterResponseHeaders ||
  !repeaterResponseBody ||
  !secretDomainInput ||
  !useCurrentSiteDomainBtn ||
  !secretKeyInput ||
  !secretValueInput ||
  !secretPlacementInput ||
  !secretEnabledInput ||
  !saveSecretBtn ||
  !cancelSecretEditBtn ||
  !secretsStatus ||
  !secretsList ||
  !manageEndpointUrlInput ||
  !manageEndpointMethodInput ||
  !manageEndpointGroupInput ||
  !manageEndpointReasonInput ||
  !saveManagedEndpointBtn ||
  !cancelManagedEndpointEditBtn ||
  !manageGroupSelect ||
  !manageGroupNameInput ||
  !renameGroupBtn ||
  !manageEndpointStatus ||
  !aiProviderSelect ||
  !aiEndpointInput ||
  !aiModelInput ||
  !aiApiKeyInput ||
  !aiRememberKeyInput ||
  !aiOneTimeKeyInput ||
  !aiAutoClearMinutesInput ||
  !aiAllowUnsafeEndpointInput ||
  !clearAiKeyBtn ||
  !aiPrivacyModeInput ||
  !aiAllowSensitiveInput ||
  !aiPromptInput ||
  !saveAiSettingsBtn ||
  !planAiWorkflowBtn ||
  !runAiWorkflowBtn ||
  !aiStatus ||
  !aiWorkflowPreview ||
  !tester ||
  !emptyState ||
  !selectedRouteName ||
  !selectedRouteMethod ||
  !selectedRouteGroup ||
  !selectedRouteUrl ||
  !selectedRouteHeaders ||
  !selectedRouteBody ||
  !saveRouteBtn ||
  !deleteRouteBtn ||
  !sendRequestBtn ||
  !responseMeta ||
  !responseHeaders ||
  !responseBody ||
  !confirmModal ||
  !confirmModalTitle ||
  !confirmModalMessage ||
  !confirmModalConfirmBtn ||
  !confirmModalCancelBtn ||
  !endpointContextMenu ||
  !sendToRepeaterMenuItem ||
  !devRefreshBtn ||
  !themeToggleEl ||
  !themeIconEl ||
  navItems.length === 0 ||
  pages.length === 0
) {
  throw new Error("Panel DOM failed to initialize.");
}

const workspaceBoot = initializeWorkspaces();
let workspaces: WorkspaceItem[] = workspaceBoot.items;
let currentWorkspaceId = workspaceBoot.activeId;

const readState = (): AppState => {
  return readWorkspaceState(currentWorkspaceId);
};

const readDiscoveredEndpoints = (): DiscoveredEndpoint[] => {
  return readWorkspaceDiscoveredEndpoints(currentWorkspaceId);
};

const saveDiscoveredEndpoints = () => {
  saveWorkspaceDiscoveredEndpoints(currentWorkspaceId, discoveredEndpoints);
};

let state: AppState = readState();
let currentWorkflow: WorkflowPlan | null = null;
let aiApiKeyMemory = "";
let keyAutoClearTimer: number | null = null;
let discoveredEndpoints: DiscoveredEndpoint[] = readDiscoveredEndpoints();
let editingDiscoveredEndpointId: string | null = null;
let devRefreshInProgress = false;
let discoveryInProgress = false;
let awaitingManualAuthStep = false;
let authMonitorTimer: number | null = null;
const authMonitoredCandidates = new Set<string>();
let runtimeDiscoveryRenderTimer: number | null = null;
let runtimeDiscoveryPauseUntil = 0;
let repeaterEntries: RepeaterEntry[] = [];
let activeRepeaterEntryId: string | null = null;
let contextMenuEndpointId: string | null = null;
let requestHeadersByEndpoint: Record<string, string> = readWorkspaceRequestHeaders(currentWorkspaceId);
const selectedTestEndpointIds = new Set<string>();
const endpointTestResults = new Map<string, EndpointTestResult>();
const endpointLastRequestBodies = new Map<string, string>();
const endpointLastRequestHeaders = new Map<string, string>();
const MAX_PROXY_TRAFFIC_ENTRIES = 500;
const PROXY_TRAFFIC_PAGE_SIZE = 80;
const PROXY_COLUMN_MIN_WIDTH = 64;
const PROXY_COLUMN_MAX_WIDTH = 900;
const PROXY_DETAIL_MIN_WIDTH = 220;
const PROXY_COLUMN_KEYS = ["datetime", "method", "url", "path", "param", "status", "time"] as const;
type ProxyColumnKey = (typeof PROXY_COLUMN_KEYS)[number];
const proxyColumnWidths: Record<ProxyColumnKey, number> = {
  datetime: 150,
  method: 70,
  url: 260,
  path: 160,
  param: 70,
  status: 70,
  time: 90
};

interface ProxyTrafficEntry {
  id: string;
  ts: number;
  type: "http" | "websocket";
  method: string;
  url: string;
  path: string;
  hasQuery: boolean;
  status: number;
  statusText: string;
  mimeType: string;
  durationMs: number;
  requestHttpVersion: string;
  requestHeaders: string;
  requestBody: string;
  responseHttpVersion: string;
  responseHeaders: string;
  responseBody: string;
}

let proxyTrafficEntries: ProxyTrafficEntry[] = [];
let activeProxyTrafficTab: "http" | "websocket" = "http";
let selectedProxyTrafficId: string | null = null;
let proxyViewLimitByTab: Record<"http" | "websocket", number> = {
  http: PROXY_TRAFFIC_PAGE_SIZE,
  websocket: PROXY_TRAFFIC_PAGE_SIZE
};

const applyProxyColumnWidths = () => {
  let minWidth = 0;
  PROXY_COLUMN_KEYS.forEach((key) => {
    const width = Math.max(PROXY_COLUMN_MIN_WIDTH, Math.min(PROXY_COLUMN_MAX_WIDTH, proxyColumnWidths[key]));
    proxyColumnWidths[key] = width;
    document.documentElement.style.setProperty(`--proxy-col-${key}`, `${width}px`);
    minWidth += width;
  });
  document.documentElement.style.setProperty("--proxy-table-min-width", `${minWidth + 48}px`);
};

const syncProxyHeaderWithListScrollbar = () => {
  const scrollbarWidth = Math.max(0, proxyTrafficList.offsetWidth - proxyTrafficList.clientWidth);
  proxyTrafficHead.style.setProperty("--proxy-list-scrollbar-width", `${scrollbarWidth}px`);
};

const formatProxyDateTime = (ts: number): string => {
  if (!Number.isFinite(ts) || ts <= 0) return "-";
  const dt = new Date(ts);
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  const hours = String(dt.getHours()).padStart(2, "0");
  const minutes = String(dt.getMinutes()).padStart(2, "0");
  const seconds = String(dt.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const setupProxyColumnResize = () => {
  const edgeThreshold = 8;
  const headerCells = Array.from(proxyTrafficHead.querySelectorAll<HTMLElement>("span"));
  if (headerCells.length !== PROXY_COLUMN_KEYS.length) return;

  const getBorderIndexes = (event: MouseEvent): { left: number; right: number } | null => {
    const target = (event.target as HTMLElement).closest<HTMLElement>("span");
    if (!target) return null;
    const index = headerCells.indexOf(target);
    if (index < 0) return null;
    const rect = target.getBoundingClientRect();
    const distLeft = event.clientX - rect.left;
    const distRight = rect.right - event.clientX;
    if (distLeft <= edgeThreshold && index > 0) return { left: index - 1, right: index };
    if (distRight <= edgeThreshold && index < headerCells.length - 1) return { left: index, right: index + 1 };
    return null;
  };

  const onMouseMove = (event: MouseEvent) => {
    proxyTrafficHead.style.cursor = getBorderIndexes(event) ? "col-resize" : "";
  };

  const onMouseLeave = () => {
    proxyTrafficHead.style.cursor = "";
  };

  proxyTrafficHead.addEventListener("mousemove", onMouseMove);
  proxyTrafficHead.addEventListener("mouseleave", onMouseLeave);

  proxyTrafficHead.addEventListener("mousedown", (event) => {
    if (event.button !== 0) return;
    const border = getBorderIndexes(event);
    if (!border) return;
    event.preventDefault();
    const leftKey = PROXY_COLUMN_KEYS[border.left];
    const rightKey = PROXY_COLUMN_KEYS[border.right];
    const startLeftWidth = proxyColumnWidths[leftKey];
    const startRightWidth = proxyColumnWidths[rightKey];
    const startX = event.clientX;

    const onDrag = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      let nextLeft = Math.max(
        PROXY_COLUMN_MIN_WIDTH,
        Math.min(PROXY_COLUMN_MAX_WIDTH, startLeftWidth + delta)
      );
      const appliedDelta = nextLeft - startLeftWidth;
      let nextRight = Math.max(
        PROXY_COLUMN_MIN_WIDTH,
        Math.min(PROXY_COLUMN_MAX_WIDTH, startRightWidth - appliedDelta)
      );
      const correctedDelta = startRightWidth - nextRight;
      nextLeft = Math.max(
        PROXY_COLUMN_MIN_WIDTH,
        Math.min(PROXY_COLUMN_MAX_WIDTH, startLeftWidth + correctedDelta)
      );
      proxyColumnWidths[leftKey] = nextLeft;
      proxyColumnWidths[rightKey] = nextRight;
      applyProxyColumnWidths();
    };

    const onStop = () => {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", onStop);
    };

    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", onStop);
  });
};

const setupProxyDetailResize = () => {
  const edgeThreshold = 8;

  const canResizeAtViewport = (): boolean => window.innerWidth > 920;

  const nearSharedBorder = (event: MouseEvent): boolean => {
    if (!canResizeAtViewport()) return false;
    const reqRect = proxyRequestCol.getBoundingClientRect();
    const resRect = proxyResponseCol.getBoundingClientRect();
    const nearReqRight =
      Math.abs(event.clientX - reqRect.right) <= edgeThreshold &&
      event.clientY >= reqRect.top &&
      event.clientY <= reqRect.bottom;
    const nearResLeft =
      Math.abs(event.clientX - resRect.left) <= edgeThreshold &&
      event.clientY >= resRect.top &&
      event.clientY <= resRect.bottom;
    return nearReqRight || nearResLeft;
  };

  proxyDetailGrid.addEventListener("mousemove", (event) => {
    proxyDetailGrid.style.cursor = nearSharedBorder(event) ? "col-resize" : "";
  });

  proxyDetailGrid.addEventListener("mouseleave", () => {
    proxyDetailGrid.style.cursor = "";
  });

  proxyDetailGrid.addEventListener("mousedown", (event) => {
    if (event.button !== 0) return;
    if (!nearSharedBorder(event)) return;
    event.preventDefault();

    const startX = event.clientX;
    const startReqWidth = proxyRequestCol.getBoundingClientRect().width;
    const startResWidth = proxyResponseCol.getBoundingClientRect().width;
    const totalWidth = startReqWidth + startResWidth;
    const maxReqWidth = Math.max(PROXY_DETAIL_MIN_WIDTH, totalWidth - PROXY_DETAIL_MIN_WIDTH);

    const onDrag = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const nextReqWidth = Math.max(
        PROXY_DETAIL_MIN_WIDTH,
        Math.min(maxReqWidth, startReqWidth + delta)
      );
      const nextResWidth = Math.max(PROXY_DETAIL_MIN_WIDTH, totalWidth - nextReqWidth);
      proxyDetailGrid.style.setProperty("--proxy-detail-request-width", `${nextReqWidth}px`);
      proxyDetailGrid.style.setProperty("--proxy-detail-response-width", `${nextResWidth}px`);
    };

    const onStop = () => {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", onStop);
    };

    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", onStop);
  });
};


const resolveStatusText = (status: number, rawStatusText: string): string => {
  if (rawStatusText.trim()) return rawStatusText.trim();
  if (!Number.isFinite(status) || status <= 0) return "";
  const known: Record<number, string> = {
    100: "Continue",
    101: "Switching Protocols",
    102: "Processing",
    103: "Early Hints",
    200: "OK",
    201: "Created",
    202: "Accepted",
    203: "Non-Authoritative Information",
    204: "No Content",
    205: "Reset Content",
    206: "Partial Content",
    207: "Multi-Status",
    208: "Already Reported",
    226: "IM Used",
    300: "Multiple Choices",
    301: "Moved Permanently",
    302: "Found",
    303: "See Other",
    304: "Not Modified",
    305: "Use Proxy",
    307: "Temporary Redirect",
    308: "Permanent Redirect",
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length Required",
    412: "Precondition Failed",
    413: "Payload Too Large",
    414: "URI Too Long",
    415: "Unsupported Media Type",
    416: "Range Not Satisfiable",
    417: "Expectation Failed",
    418: "I'm a Teapot",
    421: "Misdirected Request",
    422: "Unprocessable Entity",
    423: "Locked",
    424: "Failed Dependency",
    425: "Too Early",
    426: "Upgrade Required",
    428: "Precondition Required",
    429: "Too Many Requests",
    431: "Request Header Fields Too Large",
    451: "Unavailable For Legal Reasons",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported",
    506: "Variant Also Negotiates",
    507: "Insufficient Storage",
    508: "Loop Detected",
    510: "Not Extended",
    511: "Network Authentication Required"
  };
  return known[status] ?? "";
};

const resolveProxyDurationMs = (entry: chrome.devtools.network.Request): number => {
  if (typeof entry?.time === "number" && Number.isFinite(entry.time) && entry.time >= 0) {
    return entry.time;
  }

  const timings = entry?.timings;
  if (timings && typeof timings === "object") {
    const phaseKeys = ["blocked", "dns", "connect", "send", "wait", "receive", "ssl"] as const;
    const summed = phaseKeys.reduce((total, key) => {
      const value = (timings as Record<string, unknown>)[key];
      return total + (typeof value === "number" && value > 0 ? value : 0);
    }, 0);
    if (summed > 0) return summed;
  }

  const startedAt =
    typeof entry?.startedDateTime === "string" ? new Date(entry.startedDateTime).getTime() : NaN;
  if (Number.isFinite(startedAt)) {
    return Math.max(0, Date.now() - startedAt);
  }
  return 0;
};

let aiSettings = readAiSettings();

const saveState = () => {
  saveWorkspaceState(currentWorkspaceId, state);
};

const saveAiSettings = () => {
  persistAiSettings(aiSettings);
};

const isSessionStorageAvailable = (): boolean =>
  typeof chrome !== "undefined" && Boolean(chrome.storage?.session);

const getSessionApiKey = async (): Promise<string> => {
  if (!isSessionStorageAvailable()) return "";
  return new Promise((resolve) => {
    chrome.storage.session.get([AI_SESSION_KEY], (items) => {
      if (chrome.runtime.lastError) {
        resolve("");
        return;
      }
      const value = items[AI_SESSION_KEY];
      resolve(typeof value === "string" ? value : "");
    });
  });
};

const setSessionApiKey = async (key: string): Promise<void> => {
  if (!isSessionStorageAvailable()) return;
  await new Promise<void>((resolve) => {
    chrome.storage.session.set({ [AI_SESSION_KEY]: key }, () => resolve());
  });
};

const clearSessionApiKey = async (): Promise<void> => {
  if (!isSessionStorageAvailable()) return;
  await new Promise<void>((resolve) => {
    chrome.storage.session.remove([AI_SESSION_KEY], () => resolve());
  });
};

const clearApiKeyNow = async (message?: string) => {
  aiApiKeyMemory = "";
  aiApiKeyInput.value = "";
  await clearSessionApiKey();
  clearPersistentApiKey();
  if (keyAutoClearTimer) {
    window.clearTimeout(keyAutoClearTimer);
    keyAutoClearTimer = null;
  }
  if (message) {
    aiStatus.textContent = message;
  }
};

const scheduleKeyAutoClear = () => {
  if (keyAutoClearTimer) {
    window.clearTimeout(keyAutoClearTimer);
    keyAutoClearTimer = null;
  }
  if (!aiApiKeyMemory) return;
  const minutes = Math.max(1, aiSettings.autoClearMinutes);
  keyAutoClearTimer = window.setTimeout(() => {
    void clearApiKeyNow("API key auto-cleared after inactivity.");
  }, minutes * 60 * 1000);
};

const getCurrentInspectedUrl = async (): Promise<string> =>
  new Promise((resolve) => {
    chrome.devtools.inspectedWindow.eval("window.location.href", (result) => {
      if (typeof result === "string") {
        resolve(result);
        return;
      }
      resolve("");
    });
  });

const secretsFeature = createSecretsFeature({
  initialSecrets: readWorkspaceSecrets(currentWorkspaceId),
  elements: {
    secretDomainInput,
    useCurrentSiteDomainBtn,
    secretKeyInput,
    secretValueInput,
    secretPlacementInput,
    secretEnabledInput,
    saveSecretBtn,
    cancelSecretEditBtn,
    secretsStatus,
    secretsList
  },
  getCurrentInspectedUrl,
  persistSecrets: (secrets) => {
    saveWorkspaceSecrets(currentWorkspaceId, secrets);
  },
  onSecretsChanged: () => {
    renderWorkspaceAnalytics();
  }
});

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

const showConfirmDialog = (title: string, message: string): Promise<boolean> =>
  new Promise((resolve) => {
    confirmModalTitle.textContent = title;
    confirmModalMessage.textContent = message;
    confirmModal.classList.remove("hidden");

    const close = (result: boolean) => {
      confirmModal.classList.add("hidden");
      confirmModalConfirmBtn.removeEventListener("click", onConfirm);
      confirmModalCancelBtn.removeEventListener("click", onCancel);
      confirmModal.removeEventListener("click", onBackdrop);
      window.removeEventListener("keydown", onKeyDown);
      resolve(result);
    };

    const onConfirm = () => close(true);
    const onCancel = () => close(false);
    const onBackdrop = (event: MouseEvent) => {
      if (event.target === confirmModal) close(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(false);
    };

    confirmModalConfirmBtn.addEventListener("click", onConfirm);
    confirmModalCancelBtn.addEventListener("click", onCancel);
    confirmModal.addEventListener("click", onBackdrop);
    window.addEventListener("keydown", onKeyDown);
  });

const stopAuthMonitoring = () => {
  if (authMonitorTimer) {
    window.clearInterval(authMonitorTimer);
    authMonitorTimer = null;
  }
};

const startAuthMonitoring = () => {
  stopAuthMonitoring();
  authMonitorTimer = window.setInterval(async () => {
    const hints = await collectRuntimeApiHints();
    hints.forEach((hint) => authMonitoredCandidates.add(hint));
  }, 1500);
};

const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const getWorkspaceSetupFromInputs = (): WorkspaceSetup => ({
  siteBaseUrl: siteBaseUrlInput.value.trim(),
  siteMaxPages: Math.max(1, Math.min(30, Number.parseInt(siteMaxPagesInput.value || "6", 10) || 6)),
  passiveDiscoveryEnabled: passiveDiscoveryEnabledInput.checked,
  proxyDiscoveryEnabled: proxyDiscoveryEnabledInput.checked
});

const touchWorkspaceUpdatedAt = (workspaceId: string) => {
  const now = new Date().toISOString();
  workspaces = workspaces.map((workspace) =>
    workspace.id === workspaceId ? { ...workspace, updatedAt: now } : workspace
  );
  saveWorkspaces(workspaces);
};

const saveWorkspaceSnapshot = () => {
  saveState();
  saveDiscoveredEndpoints();
  saveWorkspaceSetup(currentWorkspaceId, getWorkspaceSetupFromInputs());
  saveWorkspaceRequestHeaders(currentWorkspaceId, requestHeadersByEndpoint);
  touchWorkspaceUpdatedAt(currentWorkspaceId);
  renderWorkspaceAnalytics();
};

const renderWorkspaceAnalytics = () => {
  const active = workspaces.find((workspace) => workspace.id === currentWorkspaceId);
  const setup = readWorkspaceSetup(currentWorkspaceId);
  const updatedLabel = active?.updatedAt ? new Date(active.updatedAt).toLocaleString() : "N/A";
  const lines = [
    `Active: ${active?.name ?? "Unknown"}`,
    `Updated: ${updatedLabel}`,
    `Groups: ${state.groups.length}`,
    `Routes: ${state.routes.length}`,
    `Discovered: ${discoveredEndpoints.length}`,
    `Secrets: ${secretsFeature.getSecrets().length}`,
    `Passive: ${setup.passiveDiscoveryEnabled ? "On" : "Off"}`,
    `Proxy: ${setup.proxyDiscoveryEnabled ? "On" : "Off"}`
  ];
  workspaceAnalytics.textContent = lines.join(" | ");
};

const renderWorkspaceOptions = () => {
  const previous = workspaceSelect.value;
  workspaceSelect.innerHTML = workspaces
    .map((workspace) => `<option value="${workspace.id}">${workspace.name}</option>`)
    .join("");
  if (workspaces.some((workspace) => workspace.id === previous)) {
    workspaceSelect.value = previous;
  } else {
    workspaceSelect.value = currentWorkspaceId;
  }
};

const loadWorkspaceIntoPanel = (workspaceId: string) => {
  currentWorkspaceId = workspaceId;
  localStorage.setItem(ACTIVE_WORKSPACE_KEY, workspaceId);
  state = readState();
  discoveredEndpoints = readDiscoveredEndpoints();
  selectedTestEndpointIds.clear();
  endpointTestResults.clear();
  endpointLastRequestBodies.clear();
  endpointLastRequestHeaders.clear();
  const setup = readWorkspaceSetup(workspaceId);
  secretsFeature.setSecrets(readWorkspaceSecrets(workspaceId));
  requestHeadersByEndpoint = readWorkspaceRequestHeaders(workspaceId);
  siteBaseUrlInput.value = setup.siteBaseUrl || "";
  siteMaxPagesInput.value = String(setup.siteMaxPages || 6);
  passiveDiscoveryEnabledInput.checked = setup.passiveDiscoveryEnabled;
  proxyDiscoveryEnabledInput.checked = setup.proxyDiscoveryEnabled;
  editingDiscoveredEndpointId = null;
  currentWorkflow = null;
  aiWorkflowPreview.textContent = "";
  repeaterEntries = [];
  activeRepeaterEntryId = null;
  proxyTrafficEntries = [];
  selectedProxyTrafficId = null;
  proxyViewLimitByTab = { http: PROXY_TRAFFIC_PAGE_SIZE, websocket: PROXY_TRAFFIC_PAGE_SIZE };
  hideEndpointContextMenu();
  renderRepeater();
  renderProxyTraffic();
  renderWorkspaceOptions();
  renderDiscoveredEndpoints();
  render();
};

const clearWorkspaceData = (workspaceId: string) => {
  saveWorkspaceState(workspaceId, defaultAppState());
  saveWorkspaceDiscoveredEndpoints(workspaceId, []);
  saveWorkspaceSetup(workspaceId, defaultWorkspaceSetup());
  clearWorkspaceSecrets(workspaceId);
  clearWorkspaceRequestHeaders(workspaceId);
};

const syncAuthModeInputs = () => {
  const signupMode = authModeSelect.value === "signup";
  authConfirmPasswordInput.disabled = !signupMode;
  authConfirmPasswordInput.placeholder = signupMode
    ? "Confirm password (for sign up)"
    : "Confirm password (disabled for sign in)";
};

const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
  const switchTo = theme === "dark" ? "light" : "dark";
  const label = `Switch to ${switchTo} mode`;
  themeToggleEl.setAttribute("aria-label", label);
  themeToggleEl.setAttribute("title", label);
  themeIconEl.textContent = "\u{1F4A1}";
  themeIconEl.dataset.state = theme === "dark" ? "on" : "off";
  if (themeModeText) {
    themeModeText.textContent = `Theme: ${theme === "dark" ? "Dark" : "Light"}`;
  }
  localStorage.setItem(THEME_KEY, theme);
};

let currentTheme: Theme = getInitialTheme();
applyTheme(currentTheme);

const setActivePage = (pageId: string) => {
  navItems.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.page === pageId);
  });
  pages.forEach((page) => {
    page.classList.toggle("is-active", page.dataset.page === pageId);
  });

  if (pageId === "discovery" && !siteBaseUrlInput.value.trim()) {
    void (async () => {
      const inspectedUrl = await getCurrentInspectedUrl();
      if (!inspectedUrl || !inspectedUrl.startsWith("http")) return;
      try {
        siteBaseUrlInput.value = normalizeBaseSiteUrl(inspectedUrl);
      } catch {
        siteBaseUrlInput.value = inspectedUrl;
      }
      saveWorkspaceSetup(currentWorkspaceId, getWorkspaceSetupFromInputs());
      renderWorkspaceAnalytics();
    })();
  }
};

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const pageId = item.dataset.page;
    if (!pageId) return;
    setActivePage(pageId);
  });
});

const getSelectedRoute = (): ApiRoute | undefined =>
  state.routes.find((route) => route.id === state.selectedRouteId);

const setGroupSelectOptions = (target: HTMLSelectElement, selected: string | null) => {
  target.innerHTML = "";

  const ungrouped = document.createElement("option");
  ungrouped.value = "";
  ungrouped.textContent = "Ungrouped";
  target.appendChild(ungrouped);

  state.groups.forEach((group) => {
    const option = document.createElement("option");
    option.value = group.id;
    option.textContent = group.name;
    target.appendChild(option);
  });

  target.value = selected ?? "";
};

const renderTreeSection = (title: string, routes: ApiRoute[]) => {
  const section = document.createElement("section");
  section.className = "tree-section";

  const heading = document.createElement("h4");
  heading.textContent = title;
  section.appendChild(heading);

  if (routes.length === 0) {
    const empty = document.createElement("div");
    empty.className = "tree-empty";
    empty.textContent = "No routes";
    section.appendChild(empty);
    return section;
  }

  routes.forEach((route) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `route-item${route.id === state.selectedRouteId ? " is-selected" : ""}`;
    btn.innerHTML = `<span class="method">${route.method}</span><span class="name"></span>`;
    const nameEl = btn.querySelector(".name");
    if (nameEl) nameEl.textContent = route.name;
    btn.addEventListener("click", () => {
      state.selectedRouteId = route.id;
      saveState();
      render();
    });
    section.appendChild(btn);
  });

  return section;
};

const renderTree = () => {
  routeTree.innerHTML = "";

  const ungroupedRoutes = state.routes.filter((route) => !route.groupId);
  routeTree.appendChild(renderTreeSection("Ungrouped", ungroupedRoutes));

  state.groups.forEach((group) => {
    const groupedRoutes = state.routes.filter((route) => route.groupId === group.id);
    routeTree.appendChild(renderTreeSection(group.name, groupedRoutes));
  });
};

const renderEditor = () => {
  const route = getSelectedRoute();
  if (!route) {
    tester.classList.add("hidden");
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  tester.classList.remove("hidden");

  selectedRouteName.value = route.name;
  selectedRouteMethod.value = route.method;
  selectedRouteUrl.value = route.url;
  selectedRouteHeaders.value = route.headers;
  selectedRouteBody.value = route.body;
  setGroupSelectOptions(selectedRouteGroup, route.groupId);
};

const render = () => {
  setGroupSelectOptions(routeGroupSelect, null);
  renderTree();
  renderEditor();
  renderWorkspaceAnalytics();
};

const getResolvedHeadersText = (endpoint: DiscoveredEndpoint): string => {
  const key = getEndpointConfigKey(endpoint.method, endpoint.url);
  const saved = requestHeadersByEndpoint[key];
  if (typeof saved === "string" && saved.trim()) return saved;
  return getSuggestedHeadersText(endpoint);
};

const getDiscoveredGroupNames = (): string[] => {
  const names = new Set(discoveredEndpoints.map((endpoint) => normalizeDiscoveredGroup(endpoint.group)));
  if (names.size === 0) names.add("General");
  return Array.from(names).sort((a, b) => a.localeCompare(b));
};

const extractImportedRoutes = (spec: Record<string, unknown>): ImportedRoute[] => {
  const paths = spec.paths;
  if (!paths || typeof paths !== "object") {
    throw new Error("Spec does not contain a valid 'paths' object.");
  }

  const baseUrl = detectBaseUrl(spec);
  const imported: ImportedRoute[] = [];

  Object.entries(paths as Record<string, Record<string, unknown>>).forEach(([pathKey, pathItem]) => {
    if (!pathItem || typeof pathItem !== "object") return;

    Object.entries(pathItem).forEach(([methodRaw, operation]) => {
      const method = methodRaw.toUpperCase() as HttpMethod;
      if (!METHOD_SET.has(method)) return;

      const op = (operation ?? {}) as Record<string, unknown>;
      const tags = Array.isArray(op.tags) ? op.tags : [];
      const firstTag = typeof tags[0] === "string" ? tags[0] : null;
      const summary = typeof op.summary === "string" ? op.summary : "";
      const operationId = typeof op.operationId === "string" ? op.operationId : "";
      const name = summary || operationId || `${method} ${pathKey}`;

      imported.push({
        name,
        method,
        url: joinUrl(baseUrl, pathKey),
        groupName: firstTag
      });
    });
  });

  if (imported.length === 0) {
    throw new Error("No supported HTTP operations found in spec paths.");
  }

  return imported;
};

const importSpec = (specText: string) => {
  const spec = parseSpecText(specText);
  const importedRoutes = extractImportedRoutes(spec);

  const groupByName = new Map(state.groups.map((group) => [group.name.toLowerCase(), group]));

  let firstRouteId: string | null = null;
  importedRoutes.forEach((item) => {
    let groupId: string | null = null;

    if (item.groupName) {
      const key = item.groupName.toLowerCase();
      let group = groupByName.get(key);
      if (!group) {
        group = { id: crypto.randomUUID(), name: item.groupName };
        state.groups.push(group);
        groupByName.set(key, group);
      }
      groupId = group.id;
    }

    const route: ApiRoute = {
      id: crypto.randomUUID(),
      name: item.name,
      method: item.method,
      url: item.url,
      groupId,
      headers: "",
      body: ""
    };

    state.routes.push(route);
    if (!firstRouteId) firstRouteId = route.id;
  });

  if (firstRouteId) state.selectedRouteId = firstRouteId;
  saveState();
  render();
  importStatus.textContent = `Imported ${importedRoutes.length} routes from spec.`;
};

const executeRequest = async (
  method: HttpMethod,
  url: string,
  headersInput: Record<string, string>,
  bodyInput: string
) => {
  const applied = secretsFeature.applySecretsToRequest(url, headersInput);
  const init: RequestInit = { method, headers: applied.headers };
  const allowsBody = !["GET", "DELETE", "HEAD", "OPTIONS"].includes(method);
  if (allowsBody && bodyInput.trim()) {
    init.body = bodyInput;
  }

  const started = performance.now();
  const res = await fetch(applied.url, init);
  const elapsed = performance.now() - started;
  const headersObj: Record<string, string> = {};
  res.headers.forEach((value, key) => {
    headersObj[key] = value;
  });
  const text = await res.text();

  return { res, elapsed, headersObj, text };
};


const routeSummary = () =>
  state.routes.map((route) => {
    const includeSensitive = aiSettings.allowSensitiveContext;
    const privacyOn = aiSettings.privacyMode;
    return {
      id: route.id,
      name: route.name,
      method: route.method,
      url: privacyOn ? sanitizeUrlForAi(route.url) : route.url,
      group: state.groups.find((g) => g.id === route.groupId)?.name ?? "Ungrouped",
      headers:
        includeSensitive && route.headers
          ? privacyOn
            ? redactText(route.headers)
            : route.headers
          : undefined,
      body:
        includeSensitive && route.body
          ? privacyOn
            ? "[REDACTED_BODY]"
            : route.body
          : undefined
    };
  });

const syncAiInputsFromSettings = () => {
  aiProviderSelect.value = aiSettings.provider;
  aiEndpointInput.value = aiSettings.endpoint;
  aiModelInput.value = aiSettings.model;
  aiApiKeyInput.value = aiApiKeyMemory;
  aiRememberKeyInput.checked = aiSettings.rememberKeyInSession;
  aiOneTimeKeyInput.checked = aiSettings.oneTimeKeyMode;
  aiAllowUnsafeEndpointInput.checked = aiSettings.allowUnsafeEndpoint;
  aiAutoClearMinutesInput.value = String(aiSettings.autoClearMinutes);
  aiPrivacyModeInput.checked = aiSettings.privacyMode;
  aiAllowSensitiveInput.checked = aiSettings.allowSensitiveContext;
};

const updateAiSettingsFromInputs = () => {
  aiApiKeyMemory = aiApiKeyInput.value.trim();
  aiSettings = {
    provider: aiProviderSelect.value as AiProvider,
    endpoint: aiEndpointInput.value.trim(),
    model: aiModelInput.value.trim(),
    rememberKeyInSession: aiRememberKeyInput.checked,
    oneTimeKeyMode: aiOneTimeKeyInput.checked,
    allowUnsafeEndpoint: aiAllowUnsafeEndpointInput.checked,
    autoClearMinutes: Math.max(1, Number.parseInt(aiAutoClearMinutesInput.value || "15", 10) || 15),
    privacyMode: aiPrivacyModeInput.checked,
    allowSensitiveContext: aiAllowSensitiveInput.checked
  };
};

const persistApiKeyMode = async () => {
  if (aiSettings.oneTimeKeyMode) {
    await clearSessionApiKey();
    clearPersistentApiKey();
    return;
  }
  if (aiSettings.rememberKeyInSession) {
    if (aiApiKeyMemory) {
      await setSessionApiKey(aiApiKeyMemory);
    } else {
      await clearSessionApiKey();
    }
  } else {
    await clearSessionApiKey();
  }
  if (aiApiKeyMemory) {
    setPersistentApiKey(aiApiKeyMemory);
  } else {
    clearPersistentApiKey();
  }
};

const mergeDiscoveredEndpoints = (items: DiscoveredEndpoint[]): number => {
  if (items.length === 0) return 0;
  const merged = new Map<string, DiscoveredEndpoint>();
  discoveredEndpoints.forEach((endpoint) => {
    const key = `${endpoint.method} ${sanitizeDiscoveredUrl(endpoint.url)}`;
    merged.set(key, {
      ...endpoint,
      url: sanitizeDiscoveredUrl(endpoint.url),
      group: normalizeDiscoveredGroup(endpoint.group || inferGroupFromEndpointUrl(endpoint.url))
    });
  });

  let addedOrUpdated = 0;
  items.forEach((endpoint) => {
    const safeUrl = sanitizeDiscoveredUrl(endpoint.url);
    const key = `${endpoint.method} ${safeUrl}`;
    const normalized: DiscoveredEndpoint = {
      ...endpoint,
      url: safeUrl,
      group: normalizeDiscoveredGroup(endpoint.group || inferGroupFromEndpointUrl(safeUrl))
    };
    const current = merged.get(key);
    if (!current) {
      merged.set(key, normalized);
      addedOrUpdated += 1;
      return;
    }

    const currentConfidence = typeof current.confidence === "number" ? current.confidence : -1;
    const nextConfidence = typeof normalized.confidence === "number" ? normalized.confidence : -1;
    if (nextConfidence > currentConfidence || (normalized.reason && !current.reason)) {
      merged.set(key, { ...current, ...normalized, id: current.id });
      addedOrUpdated += 1;
    }
  });

  discoveredEndpoints = Array.from(merged.values()).sort((a, b) => {
    const byGroup = a.group.localeCompare(b.group);
    if (byGroup !== 0) return byGroup;
    const byMethod = a.method.localeCompare(b.method);
    if (byMethod !== 0) return byMethod;
    return a.url.localeCompare(b.url);
  });

  return addedOrUpdated;
};

const collectRuntimeApiHints = async (): Promise<string[]> =>
  new Promise((resolve) => {
    const script = `(() => {
      const out = new Set();
      try {
        performance.getEntriesByType("resource").forEach((entry) => {
          const name = entry && entry.name ? String(entry.name) : "";
          if (!name) return;
          if (/api|graphql|rest\\/v\\d+|functions\\/v\\d+|auth\\/v\\d+|storage\\/v\\d+|supabase\\.co|websocket|socket\\.io|\\/socket|\\/ws\\/|\\/ws$|\\/realtime|^wss?:\\/\\//i.test(name)) {
            out.add(name);
          }
        });
      } catch {}
      try {
        const html = document.documentElement ? document.documentElement.outerHTML : "";
        const regex = /((?:https?|wss?):\\/\\/[^\\s"'<>]+|\\/[a-zA-Z0-9\\-._~:/?#[\\]@!$&'()*+,;=%]+)/g;
        let m;
        while ((m = regex.exec(html)) !== null) {
          const raw = m[1];
          if (!raw) continue;
          if (/api|graphql|rest\\/v\\d+|functions\\/v\\d+|auth\\/v\\d+|storage\\/v\\d+|supabase\\.co|websocket|socket\\.io|\\/socket|\\/ws\\/|\\/ws$|\\/realtime|^wss?:\\/\\//i.test(raw)) {
            try {
              const full = /^(https?|wss?):/i.test(raw) ? new URL(raw).toString() : new URL(raw, window.location.origin).toString();
              out.add(full);
            } catch {}
          }
        }
      } catch {}
      return Array.from(out);
    })();`;

    chrome.devtools.inspectedWindow.eval(script, (result) => {
      if (Array.isArray(result)) {
        resolve(result.filter((item): item is string => typeof item === "string"));
        return;
      }
      resolve([]);
    });
  });

const runAuthInteractionInInspectedPage = async (payload: {
  mode: AuthMode;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}): Promise<{ success: boolean; details: string }> =>
  new Promise((resolve) => {
    const injected = `(() => {
      const cfg = ${JSON.stringify(payload)};
      const isVisible = (el) => {
        if (!el || el.disabled) return false;
        try {
          const style = window.getComputedStyle(el);
          if (style.display === "none" || style.visibility === "hidden") return false;
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        } catch {
          return false;
        }
      };

      const list = (root, selector) => Array.from(root.querySelectorAll(selector));
      const firstVisible = (root, selector) => list(root, selector).find((el) => isVisible(el)) || null;

      const setValue = (el, value) => {
        if (!el || value === undefined || value === null || value === "") return false;
        try {
          el.focus();
          const proto = Object.getPrototypeOf(el);
          const descriptor = proto ? Object.getOwnPropertyDescriptor(proto, "value") : null;
          if (descriptor && typeof descriptor.set === "function") {
            descriptor.set.call(el, value);
          } else {
            el.value = value;
          }
          el.dispatchEvent(new Event("input", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
          el.dispatchEvent(new Event("blur", { bubbles: true }));
          return true;
        } catch {
          return false;
        }
      };

      const modeRegex =
        cfg.mode === "signup"
          ? /(sign\\s*up|register|create\\s*account|join)/i
          : /(sign\\s*in|log\\s*in|login|continue)/i;

      const forms = list(document, "form").filter((form) =>
        list(form, 'input[type="password"]').some((field) => isVisible(field))
      );
      const scored = forms
        .map((form) => {
          const text = ((form.textContent || "") + " " + (form.getAttribute("aria-label") || "")).toLowerCase();
          let score = 0;
          if (modeRegex.test(text)) score += 20;
          if (form.querySelector('input[type="email"]')) score += 8;
          if (form.querySelector('input[type="password"]')) score += 8;
          return { form, score };
        })
        .sort((a, b) => b.score - a.score);

      const targetForm = scored[0] ? scored[0].form : document.querySelector("form");
      const root = targetForm || document;

      const emailField = firstVisible(root, 'input[type="email"], input[name*="email" i], input[id*="email" i], input[autocomplete="email"]');
      const usernameField = firstVisible(
        root,
        'input[name*="username" i], input[id*="username" i], input[name*="login" i], input[id*="login" i], input[autocomplete="username"]'
      );
      const passFields = list(root, 'input[type="password"]').filter((field) => isVisible(field));
      const confirmField = firstVisible(
        root,
        'input[name*="confirm" i], input[id*="confirm" i], input[name*="repeat" i], input[id*="repeat" i]'
      );

      let filled = 0;
      if (emailField && cfg.email && setValue(emailField, cfg.email)) filled += 1;
      if (
        usernameField &&
        cfg.username &&
        usernameField !== emailField &&
        setValue(usernameField, cfg.username)
      ) {
        filled += 1;
      }
      if (cfg.password) {
        if (passFields[0] && setValue(passFields[0], cfg.password)) filled += 1;
        if (cfg.mode === "signup" && passFields[1] && setValue(passFields[1], cfg.confirmPassword || cfg.password)) {
          filled += 1;
        }
      }
      if (cfg.mode === "signup" && confirmField && setValue(confirmField, cfg.confirmPassword || cfg.password)) {
        filled += 1;
      }

      const submit =
        firstVisible(root, 'button[type="submit"], input[type="submit"]') ||
        list(root, "button").find((btn) =>
          isVisible(btn) && modeRegex.test((btn.textContent || "").trim())
        ) ||
        firstVisible(document, 'button[type="submit"], input[type="submit"]');
      if (submit) {
        submit.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
      } else {
        const form = targetForm || document.querySelector("form");
        if (form && typeof form.requestSubmit === "function") {
          form.requestSubmit();
        } else if (form) {
          form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        }
      }

      return {
        success: filled > 0,
        details:
          filled > 0
            ? "Filled auth fields in target form and triggered submit."
            : "Could not match visible auth fields in a sign-in/sign-up form."
      };
    })();`;

    chrome.devtools.inspectedWindow.eval(injected, (result) => {
      if (result && typeof result === "object") {
        const parsed = result as { success?: boolean; details?: string };
        resolve({ success: parsed.success === true, details: parsed.details || "Done." });
      } else {
        resolve({ success: false, details: "Auth automation script failed to run." });
      }
    });
  });

const runDiscovery = async (baseUrlRaw: string): Promise<void> => {
  if (devRefreshInProgress) {
    siteStatus.textContent = "Refresh still in progress. Please wait a moment.";
    return;
  }
  if (discoveryInProgress) {
    siteStatus.textContent = "Discovery is already running.";
    return;
  }

  discoveryInProgress = true;
  startSiteTestingBtn.disabled = true;
  runAuthDiscoveryBtn.disabled = true;

  try {
    let baseInput = baseUrlRaw.trim();
    if (!baseInput) {
      const inspectedUrl = await getCurrentInspectedUrl();
      if (inspectedUrl) {
        baseInput = inspectedUrl;
        siteBaseUrlInput.value = inspectedUrl;
      }
    }
    if (!baseInput) {
      siteStatus.textContent = "Enter the site URL first.";
      return;
    }

    updateAiSettingsFromInputs();
    saveAiSettings();
    await persistApiKeyMode();
    scheduleKeyAutoClear();

    let normalizedUrl = "";
    try {
      normalizedUrl = normalizeBaseSiteUrl(baseInput);
      const parsed = new URL(normalizedUrl);
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        siteStatus.textContent = "Site URL must use http or https.";
        return;
      }
      siteBaseUrlInput.value = normalizedUrl;
      saveWorkspaceSetup(currentWorkspaceId, getWorkspaceSetupFromInputs());
    } catch {
      siteStatus.textContent = "Invalid site URL.";
      return;
    }

    const maxPages = Math.max(1, Math.min(30, Number.parseInt(siteMaxPagesInput.value || "6", 10) || 6));
    siteStatus.textContent = "Crawling site and collecting signals...";

    try {
      const monitored = Array.from(authMonitoredCandidates);
      const siteData = await crawlSiteSignals(normalizedUrl, maxPages, monitored);
      siteStatus.textContent = `Crawl completed (${siteData.visitedPages.length} pages). Asking AI to identify endpoints...`;
      const discoveredFromAi = await requestAiEndpointDiscovery(siteData);
      const normalizedFromAi = discoveredFromAi.map((endpoint) => ({
        ...endpoint,
        group: normalizeDiscoveredGroup(endpoint.group || inferGroupFromEndpointUrl(endpoint.url))
      }));
      mergeDiscoveredEndpoints(normalizedFromAi);
      renderDiscoveredEndpoints();
      siteStatus.textContent =
        discoveredEndpoints.length > 0
          ? `Found ${discoveredEndpoints.length} potential endpoint(s).`
          : "No endpoints found. Try using the app first, then run discovery again.";
      setActivePage("test-endpoints");
      authMonitoredCandidates.clear();
      if (aiSettings.oneTimeKeyMode) {
        await clearApiKeyNow("Discovery completed. API key cleared (one-time mode).");
      } else {
        scheduleKeyAutoClear();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      siteStatus.textContent = `Discovery failed: ${message}`;
      authMonitoredCandidates.clear();
    }
  } finally {
    discoveryInProgress = false;
    if (!devRefreshInProgress) {
      startSiteTestingBtn.disabled = false;
      runAuthDiscoveryBtn.disabled = false;
    }
  }
};

const crawlSiteSignals = async (rootUrl: string, maxPages: number, seedCandidates: string[] = []) => {
  const root = new URL(rootUrl);
  const queue: string[] = [root.toString()];
  const visited = new Set<string>();
  const pageSnippets: Array<{ url: string; snippet: string }> = [];
  const candidates = new Set<string>(seedCandidates);

  while (queue.length > 0 && visited.size < maxPages) {
    const current = queue.shift();
    if (!current || visited.has(current)) continue;
    visited.add(current);

    try {
      const res = await fetch(current);
      if (!res.ok) continue;
      const html = await res.text();
      const { links, candidates: extracted } = discoverLinksFromHtml(html, current);
      extracted.forEach((item) => candidates.add(item));
      pageSnippets.push({
        url: current,
        snippet: html.replace(/\s+/g, " ").slice(0, 2600)
      });

      links.forEach((nextUrl) => {
        try {
          const next = new URL(nextUrl);
          if (next.origin !== root.origin) return;
          if (!visited.has(next.toString()) && queue.length < maxPages * 3) {
            queue.push(next.toString());
          }
        } catch {}
      });
    } catch {}
  }

  const runtimeHints = await collectRuntimeApiHints();
  runtimeHints.forEach((item) => candidates.add(item));

  const prioritized = prioritizeCandidates(Array.from(candidates), 500);

  return {
    rootUrl: root.toString(),
    visitedPages: Array.from(visited),
    candidates: prioritized,
    snippets: pageSnippets.slice(0, 8)
  };
};

const requestAiWorkflow = async (userPrompt: string): Promise<WorkflowPlan> => {
  const systemPrompt =
    "You generate API testing workflows. Return only JSON object: {\"goal\":string,\"steps\":[{\"name\":string,\"routeId\":string,\"routeName\":string,\"method\":string,\"url\":string,\"headers\":object,\"body\":string|object,\"assertStatus\":number|number[]}]}. Use routeId or routeName whenever possible. Keep steps executable.";

  const prompt = aiSettings.privacyMode ? redactText(userPrompt) : userPrompt;
  const parsed = (await callAiForJson(aiSettings, aiApiKeyMemory, systemPrompt, {
    prompt,
    availableRoutes: routeSummary()
  })) as Partial<WorkflowPlan>;
  if (!Array.isArray(parsed.steps) || parsed.steps.length === 0) {
    throw new Error("Workflow must include a non-empty steps array.");
  }

  return {
    goal: typeof parsed.goal === "string" ? parsed.goal : "",
    steps: parsed.steps as WorkflowStep[]
  };
};

const findRouteFromStep = (step: WorkflowStep): ApiRoute | undefined => {
  if (step.routeId) {
    const byId = state.routes.find((route) => route.id === step.routeId);
    if (byId) return byId;
  }
  if (step.routeName) {
    return state.routes.find((route) => route.name.toLowerCase() === step.routeName?.toLowerCase());
  }
  return undefined;
};

const runWorkflow = async (plan: WorkflowPlan) => {
  if (!plan.steps.length) throw new Error("No steps to run.");

  const logs: string[] = [];
  for (let i = 0; i < plan.steps.length; i += 1) {
    const step = plan.steps[i];
    const baseRoute = findRouteFromStep(step);
    const methodCandidate = step.method ?? baseRoute?.method;
    const method =
      methodCandidate && METHOD_SET.has(methodCandidate as HttpMethod)
        ? (methodCandidate as HttpMethod)
        : undefined;
    const url = step.url ?? baseRoute?.url;
    if (!method || !url) {
      throw new Error(`Step ${i + 1}: missing method/url and no matching route found.`);
    }

    const baseHeaders = baseRoute ? parseHeaders(baseRoute.headers) : {};
    const mergedHeaders = { ...baseHeaders, ...normalizeHeaders(step.headers) };
    const bodyFromStep =
      typeof step.body === "string"
        ? step.body
        : step.body !== undefined
          ? JSON.stringify(step.body)
          : baseRoute?.body ?? "";

    const { res, elapsed } = await executeRequest(method, url, mergedHeaders, bodyFromStep);
    const expected = Array.isArray(step.assertStatus)
      ? step.assertStatus
      : step.assertStatus !== undefined
        ? [step.assertStatus]
        : [];
    if (expected.length && !expected.includes(res.status)) {
      throw new Error(
        `Step ${i + 1} failed status assertion. Expected ${expected.join(", ")}, got ${res.status}.`
      );
    }

    logs.push(
      `${i + 1}. ${step.name ?? `${method} ${url}`} -> ${res.status} ${res.statusText} (${elapsed.toFixed(0)}ms)`
    );
  }

  return logs;
};

const requestAiEndpointDiscovery = async (siteData: {
  rootUrl: string;
  visitedPages: string[];
  candidates: string[];
  snippets: Array<{ url: string; snippet: string }>;
}): Promise<DiscoveredEndpoint[]> => {
  const heuristicEndpoints = extractHeuristicEndpointsFromCandidates(siteData.candidates);
  const systemPrompt =
    "You are an API discovery assistant. Identify likely backend API endpoints from crawl/runtime signals and assign each to a feature group like Authentication, User Management, Billing, Orders, Content, Search, Notifications, Integrations, or General. Include first-party and third-party backend endpoints (for example Supabase project URLs) when they are clearly used by the app. Return only JSON object: {\"endpoints\":[{\"url\":string,\"method\":string,\"group\":string,\"confidence\":number,\"reason\":string}]}. Keep only plausible API endpoints and include absolute URLs.";

  const parsed = await callAiForJson(aiSettings, aiApiKeyMemory, systemPrompt, {
    rootUrl: siteData.rootUrl,
    visitedPages: siteData.visitedPages,
    candidateUrls: siteData.candidates,
    pageSnippets: siteData.snippets
  });

  const endpointsRaw = parsed.endpoints;
  if (!Array.isArray(endpointsRaw)) {
    return heuristicEndpoints;
  }

  const unique = new Map<string, DiscoveredEndpoint>();
  endpointsRaw.forEach((item) => {
    if (!item || typeof item !== "object") return;
    const endpoint = item as Record<string, unknown>;
    const url = typeof endpoint.url === "string" ? endpoint.url.trim() : "";
    if (!url) return;
    const methodCandidate = typeof endpoint.method === "string" ? endpoint.method.toUpperCase() : "GET";
    const method = METHOD_SET.has(methodCandidate as HttpMethod)
      ? (methodCandidate as HttpMethod)
      : "GET";
    const confidence =
      typeof endpoint.confidence === "number" && Number.isFinite(endpoint.confidence)
        ? Math.max(0, Math.min(1, endpoint.confidence))
        : undefined;
    const reason = typeof endpoint.reason === "string" ? endpoint.reason : undefined;
    const groupRaw =
      typeof endpoint.group === "string"
        ? endpoint.group
        : typeof endpoint.feature === "string"
          ? endpoint.feature
          : inferGroupFromEndpointUrl(url);
    const group = normalizeDiscoveredGroup(groupRaw);
    unique.set(`${method} ${url}`, { id: crypto.randomUUID(), url, method, group, confidence, reason });
  });

  const aiEndpoints = Array.from(unique.values());
  if (aiEndpoints.length === 0) {
    return heuristicEndpoints.slice(0, 120);
  }

  const merged = new Map<string, DiscoveredEndpoint>();
  heuristicEndpoints.forEach((endpoint) => {
    merged.set(`${endpoint.method} ${endpoint.url}`, endpoint);
  });
  aiEndpoints.forEach((endpoint) => {
    merged.set(`${endpoint.method} ${endpoint.url}`, endpoint);
  });

  return Array.from(merged.values()).slice(0, 120);
};

const addDiscoveredEndpointsToRoutes = () => {
  if (discoveredEndpoints.length === 0) return 0;

  const groupByName = new Map(state.groups.map((group) => [group.name.toLowerCase(), group]));
  const existingKeys = new Set(state.routes.map((route) => `${route.method} ${route.url}`));
  let addedCount = 0;
  discoveredEndpoints.forEach((endpoint) => {
    if (isWebSocketUrl(endpoint.url)) return;
    const methodCandidate = (endpoint.method || "GET").toUpperCase() as HttpMethod;
    const method = METHOD_SET.has(methodCandidate) ? methodCandidate : "GET";
    const discoveredGroupName = normalizeDiscoveredGroup(endpoint.group);
    const groupKey = discoveredGroupName.toLowerCase();
    let targetGroup = groupByName.get(groupKey);
    if (!targetGroup) {
      targetGroup = { id: crypto.randomUUID(), name: discoveredGroupName };
      state.groups.push(targetGroup);
      groupByName.set(groupKey, targetGroup);
    }
    const key = `${method} ${endpoint.url}`;
    if (existingKeys.has(key)) return;

    const nameFromUrl = (() => {
      try {
        const parsed = new URL(endpoint.url);
        return `${method} ${parsed.pathname}${parsed.search}` || key;
      } catch {
        return key;
      }
    })();

    state.routes.push({
      id: crypto.randomUUID(),
      name: nameFromUrl,
      method,
      url: endpoint.url,
      groupId: targetGroup.id,
      headers: "",
      body: ""
    });
    existingKeys.add(key);
    addedCount += 1;
  });

  if (addedCount > 0) {
    state.selectedRouteId = state.routes[state.routes.length - 1]?.id ?? state.selectedRouteId;
    saveState();
    render();
  }
  return addedCount;
};

addGroupBtn.addEventListener("click", () => {
  const name = groupNameInput.value.trim();
  if (!name) return;

  state.groups.push({ id: crypto.randomUUID(), name });
  groupNameInput.value = "";
  saveState();
  render();
});

addRouteBtn.addEventListener("click", () => {
  const name = routeNameInput.value.trim();
  const url = routeUrlInput.value.trim();
  if (!name || !url) return;

  const route: ApiRoute = {
    id: crypto.randomUUID(),
    name,
    method: routeMethodInput.value as HttpMethod,
    url,
    groupId: routeGroupSelect.value || null,
    headers: "",
    body: ""
  };

  state.routes.push(route);
  state.selectedRouteId = route.id;
  routeNameInput.value = "";
  routeUrlInput.value = "";
  routeMethodInput.value = "GET";
  routeGroupSelect.value = "";
  saveState();
  render();
});

const endpointCardHtml = (endpoint: DiscoveredEndpoint): string => {
  const checked = selectedTestEndpointIds.has(endpoint.id) ? "checked" : "";
  const description = endpoint.reason?.trim() ? endpoint.reason.trim() : "No description";
  const result = endpointTestResults.get(endpoint.id);
  const resultText = result
    ? result.error
      ? `Failed - ${result.error}`
      : `${result.status ?? "-"} in ${result.elapsedMs?.toFixed(0) ?? "-"}ms | ${result.summary}`
    : "";
  const resultLine = resultText ? `<div class="helper-text">Last Test: ${resultText}</div>` : "";
  return `<div class="endpoint-item" data-endpoint-id="${endpoint.id}">
    <div class="endpoint-item-head">
      <label class="check-row">
        <input type="checkbox" data-endpoint-select-id="${endpoint.id}" ${checked} />
      </label>
      <span class="endpoint-method">${endpoint.method}</span>
      <span class="endpoint-url">${endpoint.url}</span>
    </div>
    <div class="helper-text">Group: ${endpoint.group}</div>
    <div class="helper-text">Description: ${description}</div>
    ${resultLine}
  </div>`;
};

const syncSelectAllState = () => {
  if (discoveredEndpoints.length === 0) {
    testSelectAllInput.checked = false;
    testSelectAllInput.indeterminate = false;
    return;
  }
  const selectedCount = discoveredEndpoints.filter((endpoint) => selectedTestEndpointIds.has(endpoint.id)).length;
  testSelectAllInput.checked = selectedCount === discoveredEndpoints.length;
  testSelectAllInput.indeterminate = selectedCount > 0 && selectedCount < discoveredEndpoints.length;
};

const renderTestEndpointsList = () => {
  if (discoveredEndpoints.length === 0) {
    testEndpointsList.innerHTML = `<div class="helper-text">No discovered endpoints yet.</div>`;
    syncSelectAllState();
    return;
  }
  const validIds = new Set(discoveredEndpoints.map((endpoint) => endpoint.id));
  Array.from(selectedTestEndpointIds).forEach((id) => {
    if (!validIds.has(id)) selectedTestEndpointIds.delete(id);
  });
  const grouped = new Map<string, DiscoveredEndpoint[]>();
  discoveredEndpoints.forEach((endpoint) => {
    const groupName = normalizeDiscoveredGroup(endpoint.group);
    const list = grouped.get(groupName) ?? [];
    list.push(endpoint);
    grouped.set(groupName, list);
  });
  testEndpointsList.innerHTML = Array.from(grouped.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(
      ([groupName, endpoints]) => `<div class="endpoint-group">
        <h4>${groupName} (${endpoints.length})</h4>
        ${endpoints.map(endpointCardHtml).join("")}
      </div>`
    )
    .join("");
  syncSelectAllState();
};

const renderTestResultsList = () => {
  const testedEndpoints = discoveredEndpoints.filter((endpoint) => endpointTestResults.has(endpoint.id));
  if (testedEndpoints.length === 0) {
    testResultsList.innerHTML = `<div class="helper-text">No automated test results yet.</div>`;
    return;
  }

  const grouped = new Map<string, DiscoveredEndpoint[]>();
  testedEndpoints.forEach((endpoint) => {
    const groupName = normalizeDiscoveredGroup(endpoint.group);
    const list = grouped.get(groupName) ?? [];
    list.push(endpoint);
    grouped.set(groupName, list);
  });

  testResultsList.innerHTML = Array.from(grouped.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(
      ([groupName, endpoints]) => `<div class="endpoint-group">
      <h4>${groupName} (${endpoints.length})</h4>
      ${endpoints
        .map((endpoint) => {
          const result = endpointTestResults.get(endpoint.id);
          if (!result) return "";
          const description = endpoint.reason?.trim() || "No description";
          const confidence = typeof endpoint.confidence === "number" ? `${Math.round(endpoint.confidence * 100)}%` : "Unknown";
          const statusLine = result.error
            ? `Failed - ${result.error}`
            : `${result.status ?? "-"} in ${result.elapsedMs?.toFixed(0) ?? "-"}ms`;
          return `<div class="endpoint-item" data-endpoint-id="${endpoint.id}">
        <div class="endpoint-item-head">
          <span class="endpoint-method">${endpoint.method}</span>
          <span class="endpoint-url">${endpoint.url}</span>
        </div>
        <div class="helper-text">Group: ${endpoint.group}</div>
        <div class="helper-text">Confidence: ${confidence}</div>
        <div class="helper-text">Description: ${description}</div>
        <div class="helper-text">Result: ${statusLine}</div>
        <div class="helper-text">AI Summary: ${result.summary || "-"}</div>
      </div>`;
        })
        .join("")}
    </div>`
    )
    .join("");
};

const renderRequestHeadersList = () => {
  const validKeys = new Set(discoveredEndpoints.map((endpoint) => getEndpointConfigKey(endpoint.method, endpoint.url)));
  let pruned = false;
  Object.keys(requestHeadersByEndpoint).forEach((key) => {
    if (!validKeys.has(key)) {
      delete requestHeadersByEndpoint[key];
      pruned = true;
    }
  });
  if (pruned) {
    saveWorkspaceRequestHeaders(currentWorkspaceId, requestHeadersByEndpoint);
  }

  if (discoveredEndpoints.length === 0) {
    requestHeadersStatus.textContent = "";
    requestHeadersList.innerHTML = `<div class="helper-text">No discovered endpoints yet.</div>`;
    return;
  }

  requestHeadersStatus.textContent =
    "Suggestions are based on endpoint URL/method. Edit any value before automated testing.";

  requestHeadersList.innerHTML = discoveredEndpoints
    .map((endpoint) => {
      const key = getEndpointConfigKey(endpoint.method, endpoint.url);
      const value = getResolvedHeadersText(endpoint);
      return `<div class="endpoint-item" data-endpoint-header-id="${endpoint.id}">
        <div class="endpoint-item-head">
          <span class="endpoint-method">${endpoint.method}</span>
          <span class="endpoint-url">${endpoint.url}</span>
        </div>
        <label>
          Request headers (JSON or key:value per line)
          <textarea data-endpoint-header-key="${key}" rows="4">${value}</textarea>
        </label>
        <div class="inline">
          <button type="button" data-endpoint-header-action="suggested" data-endpoint-header-key="${key}">Use Suggested</button>
        </div>
      </div>`;
    })
    .join("");
};

const resetManagedEndpointForm = () => {
  editingDiscoveredEndpointId = null;
  manageEndpointUrlInput.value = "";
  manageEndpointMethodInput.value = "GET";
  manageEndpointGroupInput.value = "General";
  manageEndpointReasonInput.value = "";
};

const renderManageEndpointsList = () => {
  if (discoveredEndpoints.length === 0) {
    manageEndpointsList.innerHTML = `<div class="helper-text">No endpoints to manage.</div>`;
    return;
  }

  const grouped = new Map<string, DiscoveredEndpoint[]>();
  discoveredEndpoints.forEach((endpoint) => {
    const groupName = normalizeDiscoveredGroup(endpoint.group);
    const list = grouped.get(groupName) ?? [];
    list.push(endpoint);
    grouped.set(groupName, list);
  });

  manageEndpointsList.innerHTML = Array.from(grouped.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(
      ([groupName, endpoints]) => `<div class="endpoint-group">
      <h4>${groupName} (${endpoints.length})</h4>
      ${endpoints
        .map(
          (endpoint) => `<div class="endpoint-item">
        <div class="endpoint-item-head">
          <span class="endpoint-method">${endpoint.method}</span>
          <span class="endpoint-url">${endpoint.url}</span>
        </div>
        <div class="inline">
          <button type="button" data-endpoint-action="edit" data-endpoint-id="${endpoint.id}">Edit</button>
          <button type="button" data-endpoint-action="delete" data-endpoint-id="${endpoint.id}">Delete</button>
        </div>
        <div class="helper-text">Group: ${endpoint.group}</div>
        <div class="helper-text">Confidence: ${typeof endpoint.confidence === "number" ? `${Math.round(endpoint.confidence * 100)}%` : "Unknown"}</div>
        <div class="helper-text">Description: ${endpoint.reason?.trim() || "No description"}</div>
      </div>`
        )
        .join("")}
      </div>`
    )
    .join("");
};

const renderManageGroupOptions = () => {
  const groupNames = getDiscoveredGroupNames();
  const prev = manageGroupSelect.value;
  manageGroupSelect.innerHTML = groupNames
    .map((groupName) => `<option value="${groupName}">${groupName}</option>`)
    .join("");
  if (groupNames.includes(prev)) {
    manageGroupSelect.value = prev;
  }
};

const renderDiscoveredEndpoints = () => {
  saveDiscoveredEndpoints();
  renderTestEndpointsList();
  renderTestResultsList();
  renderRequestHeadersList();
  renderManageEndpointsList();
  renderManageGroupOptions();
  renderWorkspaceAnalytics();
};

const renderProxyTraffic = () => {
  const proxyOn = proxyDiscoveryEnabledInput.checked;
  proxyHttpTabBtn.classList.toggle("is-active", activeProxyTrafficTab === "http");
  proxyWebSocketTabBtn.classList.toggle("is-active", activeProxyTrafficTab === "websocket");

  const filtered = proxyTrafficEntries
    .filter((entry) => entry.type === activeProxyTrafficTab)
    .slice()
    .reverse();
  const limit = proxyViewLimitByTab[activeProxyTrafficTab];
  const visible = filtered.slice(0, limit);

  if (!proxyOn) {
    proxyTrafficStatus.textContent = "Proxy mode is off. Enable it in Discovery to trace traffic.";
  } else {
    const label = activeProxyTrafficTab === "websocket" ? "WebSocket Entries" : "HTTP Entries";
    proxyTrafficStatus.textContent = `${label}: ${filtered.length}`;
  }

  if (!visible.some((entry) => entry.id === selectedProxyTrafficId)) {
    selectedProxyTrafficId = visible[0]?.id ?? null;
  }

  if (visible.length === 0) {
    proxyDetailPane.hidden = true;
    proxyTrafficList.innerHTML = `<div class="helper-text">No ${
      activeProxyTrafficTab === "http" ? "HTTP" : "WebSocket"
    } traffic captured yet.</div>`;
    proxyRequestBody.textContent = "";
    proxyResponseBody.textContent = "";
    return;
  }
  proxyDetailPane.hidden = false;

  proxyTrafficList.innerHTML = visible
    .map((entry) => {
      const duration = Number.isFinite(entry.durationMs) ? `${entry.durationMs.toFixed(0)}ms` : "-";
      const selectedClass = entry.id === selectedProxyTrafficId ? " is-selected" : "";
      const paramIcon = entry.hasQuery ? "&#10003;" : "";
      const statusCode = entry.status > 0 ? String(entry.status) : "";
      const dateTime = formatProxyDateTime(entry.ts);
      return `<button type="button" class="proxy-row${selectedClass}" data-proxy-entry-id="${entry.id}">
        <span title="${dateTime}">${dateTime}</span>
        <span>${entry.type === "websocket" ? "WS" : entry.method}</span>
        <span title="${entry.url}">${entry.url}</span>
        <span title="${entry.path}">${entry.path || "/"}</span>
        <span class="proxy-col-center" title="${entry.hasQuery ? "Query params found" : ""}">${paramIcon}</span>
        <span class="proxy-col-center">${statusCode}</span>
        <span class="proxy-col-center">${duration}</span>
      </button>`;
    })
    .join("");

  const selected = visible.find((entry) => entry.id === selectedProxyTrafficId);
  if (!selected) {
    proxyRequestBody.textContent = "";
    proxyResponseBody.textContent = "";
    return;
  }
  const requestVersion = selected.requestHttpVersion || "HTTP/?";
  const requestLines = [`${selected.method.toUpperCase()} ${selected.url} ${requestVersion}`];
  if (selected.requestHeaders.trim()) {
    requestLines.push(selected.requestHeaders.trim());
  }
  if (selected.requestBody) {
    requestLines.push("", selected.requestBody);
  }

  const responseStatus = selected.status ? String(selected.status) : "-";
  const statusText = selected.statusText ? ` ${selected.statusText}` : "";
  const responseLines = [`${responseStatus}${statusText}`];
  if (selected.responseHeaders.trim()) {
    responseLines.push(selected.responseHeaders.trim());
  }
  if (selected.responseBody) {
    responseLines.push("", selected.responseBody);
  }

  proxyRequestBody.textContent = requestLines.join("\n");
  proxyResponseBody.textContent = responseLines.join("\n");
  syncProxyHeaderWithListScrollbar();
};

const addProxyTrafficEntry = (entry: ProxyTrafficEntry) => {
  proxyTrafficEntries.push(entry);
  if (proxyTrafficEntries.length > MAX_PROXY_TRAFFIC_ENTRIES) {
    proxyTrafficEntries = proxyTrafficEntries.slice(proxyTrafficEntries.length - MAX_PROXY_TRAFFIC_ENTRIES);
  }
  if (!selectedProxyTrafficId) {
    selectedProxyTrafficId = entry.id;
  }
  renderProxyTraffic();
};

const updateProxyTrafficEntry = (id: string, patch: Partial<ProxyTrafficEntry>) => {
  const index = proxyTrafficEntries.findIndex((entry) => entry.id === id);
  if (index === -1) return;
  proxyTrafficEntries[index] = { ...proxyTrafficEntries[index], ...patch };
  renderProxyTraffic();
};

const requestEndpointTestAnalysis = async (
  endpoint: DiscoveredEndpoint,
  requestBody: string,
  responseStatus: number,
  responseHeaders: Record<string, string>,
  responseText: string
): Promise<string> => {
  try {
    const parsed = (await callAiForJson(
      aiSettings,
      aiApiKeyMemory,
      "You are an API test analyzer. Return only JSON object: {\"summary\":string}. Keep summary short and actionable.",
      {
        endpoint: { method: endpoint.method, url: endpoint.url, group: endpoint.group },
        request: { body: requestBody ? requestBody.slice(0, 2500) : "" },
        response: {
          status: responseStatus,
          headers: responseHeaders,
          body: responseText.slice(0, 3500)
        }
      }
    )) as { summary?: string };
    if (typeof parsed.summary === "string" && parsed.summary.trim()) {
      return parsed.summary.trim();
    }
  } catch {}
  if (responseStatus >= 200 && responseStatus < 300) return `Reachable endpoint response (HTTP ${responseStatus}).`;
  if (responseStatus >= 400 && responseStatus < 500) {
    return `Client/auth validation issue likely (HTTP ${responseStatus}).`;
  }
  if (responseStatus >= 500) return `Server-side failure likely (HTTP ${responseStatus}).`;
  return `Response received (HTTP ${responseStatus}).`;
};

const runAutomatedEndpointTesting = async (endpointIds: string[]) => {
  if (endpointIds.length === 0) {
    endpointTestingStatus.textContent = "No endpoints selected.";
    return;
  }
  runEndpointTestingBtn.disabled = true;
  endpointTestingStatus.textContent = `Running automated tests for ${endpointIds.length} endpoint(s)...`;

  updateAiSettingsFromInputs();
  saveAiSettings();
  await persistApiKeyMode();
  scheduleKeyAutoClear();

  let completed = 0;
  for (const endpointId of endpointIds) {
    const endpoint = discoveredEndpoints.find((item) => item.id === endpointId);
    if (!endpoint) continue;
    if (isWebSocketUrl(endpoint.url)) {
      endpointTestResults.set(endpoint.id, {
        endpointId: endpoint.id,
        summary: "WebSocket endpoint discovered. HTTP automated testing is not applicable."
      });
      completed += 1;
      endpointTestingStatus.textContent = `Tested ${completed}/${endpointIds.length} endpoint(s)...`;
      renderTestEndpointsList();
      renderTestResultsList();
      continue;
    }
    const requestBody = ["POST", "PUT", "PATCH"].includes(endpoint.method) ? "{}" : "";
    const requestHeaders = getResolvedHeadersText(endpoint);
    const parsedRequestHeaders = parseHeaders(requestHeaders);
    endpointLastRequestBodies.set(endpoint.id, requestBody);
    endpointLastRequestHeaders.set(endpoint.id, requestHeaders);
    try {
      const { res, elapsed, headersObj, text } = await executeRequest(
        endpoint.method,
        endpoint.url,
        parsedRequestHeaders,
        requestBody
      );
      const summary = await requestEndpointTestAnalysis(endpoint, requestBody, res.status, headersObj, text);
      endpointTestResults.set(endpoint.id, {
        endpointId: endpoint.id,
        status: res.status,
        elapsedMs: elapsed,
        summary
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      endpointTestResults.set(endpoint.id, {
        endpointId: endpoint.id,
        summary: "Request failed.",
        error: message
      });
    }
    completed += 1;
    endpointTestingStatus.textContent = `Tested ${completed}/${endpointIds.length} endpoint(s)...`;
    renderTestEndpointsList();
    renderTestResultsList();
  }

  if (aiSettings.oneTimeKeyMode) {
    await clearApiKeyNow("Automated endpoint testing completed. API key cleared (one-time mode).");
  } else {
    scheduleKeyAutoClear();
    endpointTestingStatus.textContent = `Automated testing completed for ${endpointIds.length} endpoint(s).`;
  }
  runEndpointTestingBtn.disabled = false;
  setActivePage("test-results");
};

const getActiveRepeaterEntry = (): RepeaterEntry | undefined =>
  repeaterEntries.find((entry) => entry.id === activeRepeaterEntryId);

const renderRepeater = () => {
  if (repeaterEntries.length === 0) {
    repeaterTabs.innerHTML = "";
    repeaterView.classList.add("hidden");
    repeaterEmptyState.classList.remove("hidden");
    activeRepeaterEntryId = null;
    return;
  }

  if (!activeRepeaterEntryId || !repeaterEntries.some((entry) => entry.id === activeRepeaterEntryId)) {
    activeRepeaterEntryId = repeaterEntries[0].id;
  }

  repeaterTabs.innerHTML = repeaterEntries
    .map((entry) => {
      const activeClass = entry.id === activeRepeaterEntryId ? " is-active" : "";
      return `<button type="button" class="repeater-tab${activeClass}" data-repeater-tab-id="${entry.id}">
        <span class="repeater-tab-name">${entry.name}</span>
        <span class="repeater-tab-close" data-repeater-close-id="${entry.id}" title="Close tab">&times;</span>
      </button>`;
    })
    .join("");

  const active = getActiveRepeaterEntry();
  if (!active) return;

  repeaterEmptyState.classList.add("hidden");
  repeaterView.classList.remove("hidden");
  repeaterMethodInput.value = active.method;
  repeaterUrlInput.value = active.url;
  repeaterHeadersInput.value = active.headers;
  repeaterBodyInput.value = active.body;
};

const addEndpointToRepeater = (endpoint: DiscoveredEndpoint) => {
  const method = METHOD_SET.has(endpoint.method) ? endpoint.method : "GET";
  const existing = repeaterEntries.find((entry) => entry.method === method && entry.url === endpoint.url);
  if (existing) {
    activeRepeaterEntryId = existing.id;
    renderRepeater();
    return;
  }

  const savedBody = endpointLastRequestBodies.get(endpoint.id);
  const savedHeaders = endpointLastRequestHeaders.get(endpoint.id);
  const bodyDefault = savedBody !== undefined ? savedBody : ["POST", "PUT", "PATCH"].includes(method) ? "{}" : "";
  const entry: RepeaterEntry = {
    id: crypto.randomUUID(),
    name: `${method} ${endpoint.url}`,
    method,
    url: endpoint.url,
    headers: savedHeaders ?? "",
    body: bodyDefault
  };
  repeaterEntries.push(entry);
  activeRepeaterEntryId = entry.id;
  renderRepeater();
};

const scheduleRuntimeDiscoveredRender = () => {
  if (runtimeDiscoveryRenderTimer) return;
  runtimeDiscoveryRenderTimer = window.setTimeout(() => {
    runtimeDiscoveryRenderTimer = null;
    renderDiscoveredEndpoints();
  }, 700);
};

manageEndpointsList.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  const button = target.closest("button[data-endpoint-action]") as HTMLButtonElement | null;
  if (!button) return;

  const endpointId = button.dataset.endpointId;
  if (!endpointId) return;
  const endpoint = discoveredEndpoints.find((item) => item.id === endpointId);
  if (!endpoint) return;

  if (button.dataset.endpointAction === "delete") {
    discoveredEndpoints = discoveredEndpoints.filter((item) => item.id !== endpointId);
    if (editingDiscoveredEndpointId === endpointId) {
      resetManagedEndpointForm();
    }
    renderDiscoveredEndpoints();
    manageEndpointStatus.textContent = "Endpoint deleted.";
    return;
  }

  editingDiscoveredEndpointId = endpoint.id;
  manageEndpointUrlInput.value = endpoint.url;
  manageEndpointMethodInput.value = endpoint.method;
  manageEndpointGroupInput.value = endpoint.group;
  manageEndpointReasonInput.value = endpoint.reason ?? "";
  manageEndpointStatus.textContent = "Editing selected endpoint.";
});

saveManagedEndpointBtn.addEventListener("click", () => {
  const url = manageEndpointUrlInput.value.trim();
  if (!url) {
    manageEndpointStatus.textContent = "Endpoint URL is required.";
    return;
  }
  const methodCandidate = manageEndpointMethodInput.value.toUpperCase() as HttpMethod;
  const method = METHOD_SET.has(methodCandidate) ? methodCandidate : "GET";
  const group = normalizeDiscoveredGroup(manageEndpointGroupInput.value);
  const reason = manageEndpointReasonInput.value.trim();

  if (editingDiscoveredEndpointId) {
    discoveredEndpoints = discoveredEndpoints.map((endpoint) =>
      endpoint.id === editingDiscoveredEndpointId ? { ...endpoint, url, method, group, reason } : endpoint
    );
    manageEndpointStatus.textContent = "Endpoint updated.";
  } else {
    discoveredEndpoints.push({
      id: crypto.randomUUID(),
      url,
      method,
      group,
      reason,
      confidence: undefined
    });
    manageEndpointStatus.textContent = "Endpoint added.";
  }

  resetManagedEndpointForm();
  renderDiscoveredEndpoints();
});

cancelManagedEndpointEditBtn.addEventListener("click", () => {
  resetManagedEndpointForm();
  manageEndpointStatus.textContent = "Edit canceled.";
});

renameGroupBtn.addEventListener("click", () => {
  const fromGroup = manageGroupSelect.value;
  const toGroup = normalizeDiscoveredGroup(manageGroupNameInput.value);
  if (!fromGroup) {
    manageEndpointStatus.textContent = "Select a group to rename.";
    return;
  }
  if (fromGroup === toGroup) {
    manageEndpointStatus.textContent = "New group name must be different.";
    return;
  }
  discoveredEndpoints = discoveredEndpoints.map((endpoint) =>
    endpoint.group === fromGroup ? { ...endpoint, group: toGroup } : endpoint
  );
  manageGroupNameInput.value = "";
  renderDiscoveredEndpoints();
  manageEndpointStatus.textContent = `Group renamed from "${fromGroup}" to "${toGroup}".`;
});

const hideEndpointContextMenu = () => {
  endpointContextMenu.classList.add("hidden");
  contextMenuEndpointId = null;
};

testEndpointsList.addEventListener("contextmenu", (event) => {
  const target = event.target as HTMLElement;
  const endpointEl = target.closest("[data-endpoint-id]") as HTMLElement | null;
  if (!endpointEl) return;
  const endpointId = endpointEl.dataset.endpointId;
  if (!endpointId) return;
  event.preventDefault();
  contextMenuEndpointId = endpointId;
  endpointContextMenu.classList.remove("hidden");
  endpointContextMenu.style.left = `${event.clientX}px`;
  endpointContextMenu.style.top = `${event.clientY}px`;
});

testResultsList.addEventListener("contextmenu", (event) => {
  const target = event.target as HTMLElement;
  const endpointEl = target.closest("[data-endpoint-id]") as HTMLElement | null;
  if (!endpointEl) return;
  const endpointId = endpointEl.dataset.endpointId;
  if (!endpointId) return;
  event.preventDefault();
  contextMenuEndpointId = endpointId;
  endpointContextMenu.classList.remove("hidden");
  endpointContextMenu.style.left = `${event.clientX}px`;
  endpointContextMenu.style.top = `${event.clientY}px`;
});

testEndpointsList.addEventListener("change", (event) => {
  const target = event.target as HTMLElement;
  const checkbox = target.closest("input[data-endpoint-select-id]") as HTMLInputElement | null;
  if (!checkbox) return;
  const endpointId = checkbox.dataset.endpointSelectId;
  if (!endpointId) return;
  if (checkbox.checked) {
    selectedTestEndpointIds.add(endpointId);
  } else {
    selectedTestEndpointIds.delete(endpointId);
  }
  syncSelectAllState();
});

testSelectAllInput.addEventListener("change", () => {
  if (testSelectAllInput.checked) {
    discoveredEndpoints.forEach((endpoint) => selectedTestEndpointIds.add(endpoint.id));
  } else {
    selectedTestEndpointIds.clear();
  }
  renderTestEndpointsList();
});

runEndpointTestingBtn.addEventListener("click", async () => {
  const selectedIds = discoveredEndpoints.filter((endpoint) => selectedTestEndpointIds.has(endpoint.id)).map((endpoint) => endpoint.id);
  if (selectedIds.length === 0) {
    endpointTestingStatus.textContent = "Select at least one endpoint to start testing.";
    return;
  }
  await runAutomatedEndpointTesting(selectedIds);
});

requestHeadersList.addEventListener("input", (event) => {
  const target = event.target as HTMLElement;
  const textarea = target.closest("textarea[data-endpoint-header-key]") as HTMLTextAreaElement | null;
  if (!textarea) return;
  const key = textarea.dataset.endpointHeaderKey;
  if (!key) return;
  requestHeadersByEndpoint[key] = textarea.value;
  saveWorkspaceRequestHeaders(currentWorkspaceId, requestHeadersByEndpoint);
  touchWorkspaceUpdatedAt(currentWorkspaceId);
  requestHeadersStatus.textContent = "Request header configuration updated.";
  renderWorkspaceAnalytics();
});

requestHeadersList.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  const button = target.closest("button[data-endpoint-header-action]") as HTMLButtonElement | null;
  if (!button) return;
  const key = button.dataset.endpointHeaderKey;
  if (!key) return;
  if (button.dataset.endpointHeaderAction !== "suggested") return;
  const endpoint = discoveredEndpoints.find((item) => getEndpointConfigKey(item.method, item.url) === key);
  if (!endpoint) return;
  const suggested = getSuggestedHeadersText(endpoint);
  requestHeadersByEndpoint[key] = suggested;
  saveWorkspaceRequestHeaders(currentWorkspaceId, requestHeadersByEndpoint);
  touchWorkspaceUpdatedAt(currentWorkspaceId);
  requestHeadersStatus.textContent = "Suggested headers restored for endpoint.";
  renderRequestHeadersList();
  renderWorkspaceAnalytics();
});

document.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  if (target.closest("#endpointContextMenu")) return;
  hideEndpointContextMenu();
});

window.addEventListener("blur", () => {
  hideEndpointContextMenu();
});

sendToRepeaterMenuItem.addEventListener("click", () => {
  if (!contextMenuEndpointId) return;
  const endpoint = discoveredEndpoints.find((item) => item.id === contextMenuEndpointId);
  hideEndpointContextMenu();
  if (!endpoint) return;
  addEndpointToRepeater(endpoint);
  setActivePage("repeater");
});

const syncActiveRepeaterFromInputs = () => {
  const active = getActiveRepeaterEntry();
  if (!active) return;
  const methodCandidate = repeaterMethodInput.value.toUpperCase() as HttpMethod;
  active.method = METHOD_SET.has(methodCandidate) ? methodCandidate : "GET";
  active.url = repeaterUrlInput.value.trim();
  active.headers = repeaterHeadersInput.value;
  active.body = repeaterBodyInput.value;
};

repeaterMethodInput.addEventListener("change", syncActiveRepeaterFromInputs);
repeaterUrlInput.addEventListener("input", syncActiveRepeaterFromInputs);
repeaterHeadersInput.addEventListener("input", syncActiveRepeaterFromInputs);
repeaterBodyInput.addEventListener("input", syncActiveRepeaterFromInputs);

repeaterTabs.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  const closeEl = target.closest("[data-repeater-close-id]") as HTMLElement | null;
  if (closeEl) {
    const closeId = closeEl.dataset.repeaterCloseId;
    if (!closeId) return;
    repeaterEntries = repeaterEntries.filter((entry) => entry.id !== closeId);
    if (activeRepeaterEntryId === closeId) {
      activeRepeaterEntryId = repeaterEntries[0]?.id ?? null;
      repeaterResponseMeta.textContent = "";
      repeaterResponseHeaders.textContent = "";
      repeaterResponseBody.textContent = "";
    }
    renderRepeater();
    return;
  }

  const tabEl = target.closest("[data-repeater-tab-id]") as HTMLElement | null;
  if (!tabEl) return;
  const tabId = tabEl.dataset.repeaterTabId;
  if (!tabId) return;
  syncActiveRepeaterFromInputs();
  activeRepeaterEntryId = tabId;
  renderRepeater();
});

repeaterSendBtn.addEventListener("click", async () => {
  const active = getActiveRepeaterEntry();
  if (!active) return;
  syncActiveRepeaterFromInputs();

  if (!active.url) {
    repeaterResponseMeta.textContent = "Request URL is required.";
    return;
  }

  repeaterResponseMeta.textContent = "Sending...";
  repeaterResponseHeaders.textContent = "";
  repeaterResponseBody.textContent = "";

  try {
    const headers = parseHeaders(active.headers);
    const { res, elapsed, headersObj, text } = await executeRequest(active.method, active.url, headers, active.body);
    repeaterResponseMeta.textContent = `${res.status} ${res.statusText} in ${elapsed.toFixed(0)}ms`;
    repeaterResponseHeaders.textContent = JSON.stringify(headersObj, null, 2);
    try {
      repeaterResponseBody.textContent = JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      repeaterResponseBody.textContent = text;
    }

    const matchedEndpoint = discoveredEndpoints.find(
      (endpoint) => endpoint.method === active.method && endpoint.url === active.url
    );
    if (matchedEndpoint) {
      endpointLastRequestBodies.set(matchedEndpoint.id, active.body);
      endpointLastRequestHeaders.set(matchedEndpoint.id, active.headers);
      const summary = await requestEndpointTestAnalysis(
        matchedEndpoint,
        active.body,
        res.status,
        headersObj,
        text
      );
      endpointTestResults.set(matchedEndpoint.id, {
        endpointId: matchedEndpoint.id,
        status: res.status,
        elapsedMs: elapsed,
        summary
      });
      renderTestEndpointsList();
      renderTestResultsList();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    repeaterResponseMeta.textContent = "Request failed";
    repeaterResponseBody.textContent = message;
  }
});

startSiteTestingBtn.addEventListener("click", async () => {
  awaitingManualAuthStep = false;
  continueAuthDiscoveryBtn.disabled = true;
  cancelAuthSessionBtn.disabled = true;
  stopAuthMonitoring();
  await runDiscovery(siteBaseUrlInput.value);
});

runAuthDiscoveryBtn.addEventListener("click", async () => {
  if (devRefreshInProgress) {
    authStatus.textContent = "Refresh still in progress. Please wait a moment.";
    return;
  }
  if (discoveryInProgress) {
    authStatus.textContent = "Discovery is already running.";
    return;
  }
  if (awaitingManualAuthStep) {
    authStatus.textContent = "Complete or cancel the current manual auth session first.";
    return;
  }

  const mode: AuthMode = authModeSelect.value === "signup" ? "signup" : "signin";
  const email = authEmailInput.value.trim();
  const username = authUsernameInput.value.trim();
  const password = authPasswordInput.value;
  const confirmPassword = authConfirmPasswordInput.value;

  if (!password) {
    authStatus.textContent = "Password is required.";
    return;
  }
  if (!email && !username) {
    authStatus.textContent = "Enter email or username.";
    return;
  }
  if (mode === "signup" && confirmPassword && confirmPassword !== password) {
    authStatus.textContent = "Confirm password does not match.";
    return;
  }

  if (!siteBaseUrlInput.value.trim()) {
    const inspectedUrl = await getCurrentInspectedUrl();
    if (inspectedUrl) {
      siteBaseUrlInput.value = inspectedUrl;
    }
  }
  if (!siteBaseUrlInput.value.trim()) {
    authStatus.textContent = "Enter site URL first, then run auth discovery.";
    return;
  }

  authStatus.textContent =
    "Running auth automation in inspected page. Keep sign-in/sign-up screen open.";
  const authResult = await runAuthInteractionInInspectedPage({
    mode,
    email,
    username,
    password,
    confirmPassword
  });
  authStatus.textContent = authResult.details;
  if (!authResult.success) {
    return;
  }

  if (authRequiresManualStepInput.checked) {
    awaitingManualAuthStep = true;
    authMonitoredCandidates.clear();
    startAuthMonitoring();
    continueAuthDiscoveryBtn.disabled = false;
    cancelAuthSessionBtn.disabled = false;
    authStatus.textContent =
      "Auth submitted. Complete OTP/manual step in the app, then click Continue Discovery. Monitoring API activity in background.";
    return;
  }

  awaitingManualAuthStep = false;
  continueAuthDiscoveryBtn.disabled = true;
  cancelAuthSessionBtn.disabled = true;
  stopAuthMonitoring();
  authStatus.textContent = "Auth submitted. Waiting for app/network activity...";
  await sleep(5000);
  await runDiscovery(siteBaseUrlInput.value);
  authStatus.textContent = "Auth-assisted discovery completed.";
});

continueAuthDiscoveryBtn.addEventListener("click", async () => {
  if (!awaitingManualAuthStep) {
    authStatus.textContent = "No manual auth session is active.";
    continueAuthDiscoveryBtn.disabled = true;
    cancelAuthSessionBtn.disabled = true;
    return;
  }
  awaitingManualAuthStep = false;
  continueAuthDiscoveryBtn.disabled = true;
  cancelAuthSessionBtn.disabled = true;
  stopAuthMonitoring();
  authStatus.textContent = "Continuing discovery with monitored auth session...";
  await runDiscovery(siteBaseUrlInput.value);
  authStatus.textContent = "Auth-assisted discovery completed.";
});

cancelAuthSessionBtn.addEventListener("click", () => {
  awaitingManualAuthStep = false;
  continueAuthDiscoveryBtn.disabled = true;
  cancelAuthSessionBtn.disabled = true;
  stopAuthMonitoring();
  authMonitoredCandidates.clear();
  authStatus.textContent = "Manual auth session canceled.";
});

workspaceSelect.addEventListener("change", () => {
  const nextId = workspaceSelect.value;
  if (nextId === currentWorkspaceId) {
    workspaceStatus.textContent = "";
    return;
  }
  saveWorkspaceSnapshot();
  loadWorkspaceIntoPanel(nextId);
});

createWorkspaceBtn.addEventListener("click", () => {
  const name = workspaceNameInput.value.trim();
  if (!name) {
    workspaceStatus.textContent = "Enter a workspace name.";
    return;
  }
  const exists = workspaces.some((workspace) => workspace.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    workspaceStatus.textContent = "Workspace name already exists.";
    return;
  }

  saveWorkspaceSnapshot();
  const workspace = createWorkspaceItem(name);
  workspaces = [...workspaces, workspace];
  saveWorkspaces(workspaces);
  workspaceNameInput.value = "";
  loadWorkspaceIntoPanel(workspace.id);
  workspaceStatus.textContent = `Workspace "${workspace.name}" created.`;
});

saveWorkspaceBtn.addEventListener("click", () => {
  saveWorkspaceSnapshot();
  const current = workspaces.find((workspace) => workspace.id === currentWorkspaceId);
  workspaceStatus.textContent = current
    ? `Workspace "${current.name}" saved.`
    : "Workspace saved.";
});

clearWorkspaceBtn.addEventListener("click", async () => {
  const current = workspaces.find((workspace) => workspace.id === currentWorkspaceId);
  if (!current) return;
  const confirmed = await showConfirmDialog(
    "Clear Workspace",
    `Clear all data in workspace "${current.name}"? This cannot be undone.`
  );
  if (!confirmed) return;

  awaitingManualAuthStep = false;
  continueAuthDiscoveryBtn.disabled = true;
  cancelAuthSessionBtn.disabled = true;
  stopAuthMonitoring();
  authMonitoredCandidates.clear();
  runtimeDiscoveryPauseUntil = Date.now() + 10000;

  clearWorkspaceData(currentWorkspaceId);
  state = defaultAppState();
  discoveredEndpoints = [];
  selectedTestEndpointIds.clear();
  endpointTestResults.clear();
  endpointLastRequestBodies.clear();
  endpointLastRequestHeaders.clear();
  secretsFeature.setSecrets([]);
  requestHeadersByEndpoint = {};
  repeaterEntries = [];
  activeRepeaterEntryId = null;
  proxyTrafficEntries = [];
  selectedProxyTrafficId = null;
  proxyViewLimitByTab = { http: PROXY_TRAFFIC_PAGE_SIZE, websocket: PROXY_TRAFFIC_PAGE_SIZE };
  renderRepeater();
  renderProxyTraffic();
  editingDiscoveredEndpointId = null;
  const setup = defaultWorkspaceSetup();
  siteBaseUrlInput.value = setup.siteBaseUrl;
  siteMaxPagesInput.value = String(setup.siteMaxPages);
  passiveDiscoveryEnabledInput.checked = setup.passiveDiscoveryEnabled;
  proxyDiscoveryEnabledInput.checked = setup.proxyDiscoveryEnabled;
  saveWorkspaceSetup(currentWorkspaceId, setup);
  renderDiscoveredEndpoints();
  render();
  touchWorkspaceUpdatedAt(currentWorkspaceId);
  workspaceStatus.textContent = `Workspace "${current.name}" cleared.`;
});

addDiscoveredRoutesBtn.addEventListener("click", () => {
  const added = addDiscoveredEndpointsToRoutes();
  siteStatus.textContent =
    added > 0 ? `Added ${added} discovered endpoint(s) into Routes.` : "No new endpoints were added.";
});

renderDiscoveredEndpoints();
renderRepeater();
applyProxyColumnWidths();
setupProxyColumnResize();
setupProxyDetailResize();
renderProxyTraffic();
window.addEventListener("resize", syncProxyHeaderWithListScrollbar);
secretsFeature.renderSecretsList();
secretsFeature.resetSecretForm();
resetManagedEndpointForm();
syncAuthModeInputs();
authModeSelect.addEventListener("change", syncAuthModeInputs);
renderWorkspaceOptions();
workspaceSelect.value = currentWorkspaceId;
const initialSetup = readWorkspaceSetup(currentWorkspaceId);
siteBaseUrlInput.value = initialSetup.siteBaseUrl || siteBaseUrlInput.value;
siteMaxPagesInput.value = String(initialSetup.siteMaxPages || 6);
passiveDiscoveryEnabledInput.checked = initialSetup.passiveDiscoveryEnabled;
proxyDiscoveryEnabledInput.checked = initialSetup.proxyDiscoveryEnabled;

syncAiInputsFromSettings();
aiWorkflowPreview.textContent = "";
aiApiKeyInput.addEventListener("input", () => {
  aiApiKeyMemory = aiApiKeyInput.value.trim();
  if (aiSettings.oneTimeKeyMode) {
    clearPersistentApiKey();
  } else if (aiApiKeyMemory) {
    setPersistentApiKey(aiApiKeyMemory);
  } else {
    clearPersistentApiKey();
  }
  if (aiSettings.rememberKeyInSession && !aiSettings.oneTimeKeyMode) {
    void setSessionApiKey(aiApiKeyMemory);
  }
  scheduleKeyAutoClear();
});

siteBaseUrlInput.addEventListener("blur", () => {
  const value = siteBaseUrlInput.value.trim();
  if (value) {
    try {
      siteBaseUrlInput.value = normalizeBaseSiteUrl(value);
    } catch {}
  }
  saveWorkspaceSetup(currentWorkspaceId, getWorkspaceSetupFromInputs());
});

siteMaxPagesInput.addEventListener("change", () => {
  saveWorkspaceSetup(currentWorkspaceId, getWorkspaceSetupFromInputs());
});

passiveDiscoveryEnabledInput.addEventListener("change", () => {
  saveWorkspaceSetup(currentWorkspaceId, getWorkspaceSetupFromInputs());
  renderWorkspaceAnalytics();
});

proxyDiscoveryEnabledInput.addEventListener("change", () => {
  saveWorkspaceSetup(currentWorkspaceId, getWorkspaceSetupFromInputs());
  renderWorkspaceAnalytics();
  renderProxyTraffic();
});

proxyHttpTabBtn.addEventListener("click", () => {
  activeProxyTrafficTab = "http";
  proxyViewLimitByTab.http = Math.max(proxyViewLimitByTab.http, PROXY_TRAFFIC_PAGE_SIZE);
  renderProxyTraffic();
});

proxyWebSocketTabBtn.addEventListener("click", () => {
  activeProxyTrafficTab = "websocket";
  proxyViewLimitByTab.websocket = Math.max(proxyViewLimitByTab.websocket, PROXY_TRAFFIC_PAGE_SIZE);
  renderProxyTraffic();
});

proxyTrafficList.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  const row = target.closest<HTMLElement>("[data-proxy-entry-id]");
  if (!row) return;
  const id = row.dataset.proxyEntryId;
  if (!id) return;
  selectedProxyTrafficId = id;
  renderProxyTraffic();
});

clearProxyTrafficBtn.addEventListener("click", () => {
  proxyTrafficEntries = [];
  selectedProxyTrafficId = null;
  proxyViewLimitByTab = { http: PROXY_TRAFFIC_PAGE_SIZE, websocket: PROXY_TRAFFIC_PAGE_SIZE };
  proxyTrafficList.scrollTop = 0;
  renderProxyTraffic();
});

proxyTrafficList.addEventListener("scroll", () => {
  const nearBottom = proxyTrafficList.scrollTop + proxyTrafficList.clientHeight >= proxyTrafficList.scrollHeight - 48;
  if (!nearBottom) return;
  const totalForTab = proxyTrafficEntries.filter((entry) => entry.type === activeProxyTrafficTab).length;
  if (proxyViewLimitByTab[activeProxyTrafficTab] >= totalForTab) return;
  proxyViewLimitByTab[activeProxyTrafficTab] += PROXY_TRAFFIC_PAGE_SIZE;
  renderProxyTraffic();
});

void (async () => {
  if (aiSettings.rememberKeyInSession && !aiSettings.oneTimeKeyMode) {
    aiApiKeyMemory = await getSessionApiKey();
    if (!aiApiKeyMemory) {
      aiApiKeyMemory = getPersistentApiKey();
    }
    aiApiKeyInput.value = aiApiKeyMemory;
  } else if (!aiSettings.oneTimeKeyMode) {
    aiApiKeyMemory = getPersistentApiKey();
    aiApiKeyInput.value = aiApiKeyMemory;
  } else {
    aiApiKeyMemory = "";
    aiApiKeyInput.value = "";
  }
  scheduleKeyAutoClear();

  if (!siteBaseUrlInput.value.trim()) {
    chrome.devtools.inspectedWindow.eval("window.location.href", (result) => {
      if (typeof result === "string" && result.startsWith("http")) {
        try {
          siteBaseUrlInput.value = normalizeBaseSiteUrl(result);
        } catch {
          siteBaseUrlInput.value = result;
        }
        saveWorkspaceSetup(currentWorkspaceId, getWorkspaceSetupFromInputs());
      }
    });
  }
})();

startSiteTestingBtn.disabled = false;
runAuthDiscoveryBtn.disabled = false;

aiProviderSelect.addEventListener("change", () => {
  const nextProvider = aiProviderSelect.value as AiProvider;
  if (nextProvider === "custom") {
    aiSettings.provider = nextProvider;
    aiSettings.allowUnsafeEndpoint = aiAllowUnsafeEndpointInput.checked;
    saveAiSettings();
    return;
  }

  const preset = AI_PROVIDER_PRESETS[nextProvider];
  aiSettings = {
    provider: nextProvider,
    endpoint: preset.endpoint,
    model: preset.model,
    rememberKeyInSession: aiRememberKeyInput.checked,
    oneTimeKeyMode: aiOneTimeKeyInput.checked,
    allowUnsafeEndpoint: aiAllowUnsafeEndpointInput.checked,
    autoClearMinutes: Math.max(1, Number.parseInt(aiAutoClearMinutesInput.value || "15", 10) || 15),
    privacyMode: aiPrivacyModeInput.checked,
    allowSensitiveContext: aiAllowSensitiveInput.checked
  };
  syncAiInputsFromSettings();
  saveAiSettings();
});

saveAiSettingsBtn.addEventListener("click", async () => {
  updateAiSettingsFromInputs();
  saveAiSettings();
  await persistApiKeyMode();
  scheduleKeyAutoClear();
  aiStatus.textContent = aiSettings.oneTimeKeyMode
    ? "AI settings saved. One-time key mode is active."
    : aiSettings.rememberKeyInSession
      ? "AI settings saved. API key is stored in session and local storage (dev)."
      : "AI settings saved. API key is stored in local storage (dev).";
});

planAiWorkflowBtn.addEventListener("click", async () => {
  const prompt = aiPromptInput.value.trim();
  if (!prompt) {
    aiStatus.textContent = "Enter a prompt describing the workflow.";
    return;
  }

  updateAiSettingsFromInputs();
  saveAiSettings();
  await persistApiKeyMode();
  scheduleKeyAutoClear();
  aiStatus.textContent = "Generating workflow...";
  aiWorkflowPreview.textContent = "";

  try {
    currentWorkflow = await requestAiWorkflow(prompt);
    aiWorkflowPreview.textContent = JSON.stringify(currentWorkflow, null, 2);
    if (aiSettings.oneTimeKeyMode) {
      await clearApiKeyNow("Workflow ready. API key cleared (one-time mode).");
    } else {
      scheduleKeyAutoClear();
      aiStatus.textContent = `Workflow ready with ${currentWorkflow.steps.length} step(s).`;
    }
  } catch (error) {
    currentWorkflow = null;
    const message = error instanceof Error ? error.message : String(error);
    aiStatus.textContent = `AI workflow generation failed: ${message}`;
  }
});

clearAiKeyBtn.addEventListener("click", async () => {
  await clearApiKeyNow("API key cleared from memory, session storage, and local storage.");
});

runAiWorkflowBtn.addEventListener("click", async () => {
  if (!currentWorkflow) {
    aiStatus.textContent = "Generate a workflow first.";
    return;
  }
  aiStatus.textContent = "Running workflow...";

  try {
    const logs = await runWorkflow(currentWorkflow);
    aiStatus.textContent = `Workflow completed (${logs.length} step(s)).`;
    aiWorkflowPreview.textContent = `${JSON.stringify(currentWorkflow, null, 2)}\n\nRun log:\n${logs.join("\n")}`;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    aiStatus.textContent = `Workflow failed: ${message}`;
  }
});

importSwaggerTextBtn.addEventListener("click", () => {
  try {
    importSpec(swaggerSpecInput.value);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    importStatus.textContent = `Import failed: ${message}`;
  }
});

importSwaggerUrlBtn.addEventListener("click", async () => {
  const url = swaggerUrlInput.value.trim();
  if (!url) {
    importStatus.textContent = "Please enter a Swagger/OpenAPI URL.";
    return;
  }

  importStatus.textContent = "Fetching spec...";
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    const text = await res.text();
    importSpec(text);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    importStatus.textContent = `Import failed: ${message}`;
  }
});

saveRouteBtn.addEventListener("click", () => {
  const route = getSelectedRoute();
  if (!route) return;

  route.name = selectedRouteName.value.trim() || route.name;
  route.method = selectedRouteMethod.value as HttpMethod;
  route.groupId = selectedRouteGroup.value || null;
  route.url = selectedRouteUrl.value.trim();
  route.headers = selectedRouteHeaders.value;
  route.body = selectedRouteBody.value;

  saveState();
  render();
});

deleteRouteBtn.addEventListener("click", () => {
  const route = getSelectedRoute();
  if (!route) return;

  state.routes = state.routes.filter((item) => item.id !== route.id);
  state.selectedRouteId = state.routes[0]?.id ?? null;
  responseMeta.textContent = "";
  responseHeaders.textContent = "";
  responseBody.textContent = "";
  saveState();
  render();
});

sendRequestBtn.addEventListener("click", async () => {
  const route = getSelectedRoute();
  if (!route) return;

  route.name = selectedRouteName.value.trim() || route.name;
  route.method = selectedRouteMethod.value as HttpMethod;
  route.groupId = selectedRouteGroup.value || null;
  route.url = selectedRouteUrl.value.trim();
  route.headers = selectedRouteHeaders.value;
  route.body = selectedRouteBody.value;
  saveState();
  renderTree();

  responseMeta.textContent = "Sending...";
  responseHeaders.textContent = "";
  responseBody.textContent = "";

  try {
    const headers = parseHeaders(route.headers);
    const { res, elapsed, headersObj, text } = await executeRequest(
      route.method,
      route.url,
      headers,
      route.body
    );

    responseMeta.textContent = `${res.status} ${res.statusText} in ${elapsed.toFixed(0)}ms`;
    responseHeaders.textContent = JSON.stringify(headersObj, null, 2);

    try {
      responseBody.textContent = JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      responseBody.textContent = text;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    responseMeta.textContent = "Request failed";
    responseBody.textContent = message;
  }
});

themeToggleEl.addEventListener("click", () => {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(currentTheme);
});

devRefreshBtn.addEventListener("click", () => {
  if (devRefreshInProgress) return;
  devRefreshInProgress = true;
  awaitingManualAuthStep = false;
  continueAuthDiscoveryBtn.disabled = true;
  cancelAuthSessionBtn.disabled = true;
  stopAuthMonitoring();
  authMonitoredCandidates.clear();
  devRefreshBtn.disabled = true;
  startSiteTestingBtn.disabled = true;
  runAuthDiscoveryBtn.disabled = true;
  siteStatus.textContent = "Refreshing inspected page and panel...";
  chrome.devtools.inspectedWindow.reload({ ignoreCache: true });
  window.setTimeout(() => {
    window.location.reload();
  }, 250);
});

chrome.devtools.network.onNavigated.addListener(() => {
  if (!devRefreshInProgress) return;
  devRefreshInProgress = false;
  devRefreshBtn.disabled = false;
  startSiteTestingBtn.disabled = false;
  runAuthDiscoveryBtn.disabled = false;
  siteStatus.textContent = "Refresh done. Panel reloaded.";
});

chrome.devtools.network.onRequestFinished.addListener((entry) => {
  if (Date.now() < runtimeDiscoveryPauseUntil) return;
  const passiveOn = passiveDiscoveryEnabledInput.checked;
  const proxyOn = proxyDiscoveryEnabledInput.checked;
  if (!passiveOn && !proxyOn) return;
  const rawUrl = entry?.request?.url;
  if (!rawUrl || typeof rawUrl !== "string") return;
  if (!/^(https?|wss?):\/\//i.test(rawUrl)) return;
  const methodCandidate = (entry?.request?.method || "GET").toUpperCase();
  const method = METHOD_SET.has(methodCandidate as HttpMethod) ? (methodCandidate as HttpMethod) : "GET";
  const status = typeof entry?.response?.status === "number" ? entry.response.status : 0;
  const statusTextRaw = typeof entry?.response?.statusText === "string" ? entry.response.statusText : "";
  const statusText = resolveStatusText(status, statusTextRaw);
  const mimeType =
    typeof entry?.response?.content?.mimeType === "string" ? entry.response.content.mimeType : "";
  const durationMs = resolveProxyDurationMs(entry);
  const isWsTraffic = isWebSocketUrl(rawUrl) || status === 101 || /websocket/i.test(mimeType);

  if (proxyOn) {
    let path = "/";
    let hasQuery = false;
    try {
      const parsed = new URL(rawUrl);
      path = parsed.pathname || "/";
      hasQuery = Boolean(parsed.search && parsed.search.length > 1);
    } catch {}
    const proxyEntryId = crypto.randomUUID();
    const requestHeaders =
      Array.isArray(entry?.request?.headers) && entry.request.headers.length > 0
        ? entry.request.headers
            .filter((header) => {
              const name = (header.name || "").toLowerCase();
              return name !== ":authority" && name !== ":method" && name !== ":path" && name !== ":scheme";
            })
            .map((header) => `${header.name}: ${header.value}`)
            .join("\n")
        : "";
    const requestHttpVersion =
      typeof entry?.request?.httpVersion === "string" && entry.request.httpVersion
        ? entry.request.httpVersion
        : "HTTP/?";
    const responseHeaders =
      Array.isArray(entry?.response?.headers) && entry.response.headers.length > 0
        ? entry.response.headers
            .map((header) => `${header.name}: ${header.value}`)
            .join("\n")
        : "";
    const responseHttpVersion =
      typeof entry?.response?.httpVersion === "string" && entry.response.httpVersion
        ? entry.response.httpVersion
        : "HTTP/?";
    const requestBody =
      typeof entry?.request?.postData?.text === "string" ? entry.request.postData.text : "";
    addProxyTrafficEntry({
      id: proxyEntryId,
      ts: Date.now(),
      type: isWsTraffic ? "websocket" : "http",
      method: isWsTraffic ? "WS" : method,
      url: rawUrl,
      path,
      hasQuery,
      status,
      statusText,
      mimeType,
      durationMs,
      requestHttpVersion,
      requestHeaders,
      requestBody,
      responseHttpVersion,
      responseHeaders,
      responseBody: ""
    });
    if (!isWsTraffic) {
      try {
        entry.getContent((content) => {
          updateProxyTrafficEntry(proxyEntryId, {
            responseBody: typeof content === "string" ? content : ""
          });
        });
      } catch {}
    }
  }

  const likelyApi = isLikelyApiRequest(rawUrl, method, mimeType);
  if (!proxyOn && !likelyApi) return;

  const sanitizedUrl = sanitizeDiscoveredUrl(rawUrl);
  const group = likelyApi
    ? normalizeDiscoveredGroup(inferGroupFromEndpointUrl(sanitizedUrl))
    : "Proxy Capture";
  const added = mergeDiscoveredEndpoints([
    {
      id: crypto.randomUUID(),
      url: sanitizedUrl,
      method,
      group,
      confidence: proxyOn && !likelyApi ? 0.68 : 0.72,
      reason: proxyOn
        ? "Captured from proxy-mode runtime traffic while navigating the app."
        : "Captured from manual runtime network traffic."
    }
  ]);
  if (added > 0) {
    scheduleRuntimeDiscoveredRender();
  }
});

window.addEventListener("beforeunload", () => {
  saveWorkspaceSnapshot();
});

setActivePage("site-setup");
render();

