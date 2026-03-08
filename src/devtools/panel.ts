import { load as loadYaml } from "js-yaml";

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
const siteStatus = document.querySelector<HTMLDivElement>("#siteStatus");
const testEndpointsList = document.querySelector<HTMLDivElement>("#testEndpointsList");
const manageEndpointsList = document.querySelector<HTMLDivElement>("#manageEndpointsList");
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
  !siteStatus ||
  !testEndpointsList ||
  !manageEndpointsList ||
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
  !devRefreshBtn ||
  !themeToggleEl ||
  !themeIconEl ||
  navItems.length === 0 ||
  pages.length === 0
) {
  throw new Error("Panel DOM failed to initialize.");
}

type Theme = "light" | "dark";
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
type AiProvider = "openai" | "anthropic" | "groq" | "custom";
type AuthMode = "signin" | "signup";

interface ApiGroup {
  id: string;
  name: string;
}

interface ApiRoute {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  groupId: string | null;
  headers: string;
  body: string;
}

interface AppState {
  groups: ApiGroup[];
  routes: ApiRoute[];
  selectedRouteId: string | null;
}

interface ImportedRoute {
  name: string;
  method: HttpMethod;
  url: string;
  groupName: string | null;
}

interface AiSettings {
  provider: AiProvider;
  endpoint: string;
  model: string;
  rememberKeyInSession: boolean;
  oneTimeKeyMode: boolean;
  allowUnsafeEndpoint: boolean;
  autoClearMinutes: number;
  privacyMode: boolean;
  allowSensitiveContext: boolean;
}

interface WorkflowStep {
  name?: string;
  routeId?: string;
  routeName?: string;
  method?: HttpMethod;
  url?: string;
  headers?: Record<string, string> | string;
  body?: unknown;
  assertStatus?: number | number[];
}

interface WorkflowPlan {
  goal?: string;
  steps: WorkflowStep[];
}

interface DiscoveredEndpoint {
  id: string;
  url: string;
  method: HttpMethod;
  group: string;
  confidence?: number;
  reason?: string;
}

interface WorkspaceItem {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface WorkspaceSetup {
  siteBaseUrl: string;
  siteMaxPages: number;
  passiveDiscoveryEnabled: boolean;
}

const LEGACY_APP_STATE_KEY = "testx-api-state-v1";
const THEME_KEY = "testx-theme";
const AI_SETTINGS_KEY = "testx-ai-settings-v1";
const AI_SESSION_KEY = "testx-ai-session-key";
const AI_PERSISTENT_KEY = "testx-ai-persistent-key-v1";
const LEGACY_DISCOVERED_ENDPOINTS_KEY = "testx-discovered-endpoints-v1";
const WORKSPACES_KEY = "testx-workspaces-v1";
const ACTIVE_WORKSPACE_KEY = "testx-active-workspace-v1";
const DEFAULT_WORKSPACE_NAME = "Default Workspace";

const ALLOWED_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];
const METHOD_SET = new Set(ALLOWED_METHODS);
const AI_PROVIDER_PRESETS: Record<Exclude<AiProvider, "custom">, { endpoint: string; model: string }> = {
  openai: { endpoint: "https://api.openai.com/v1/chat/completions", model: "gpt-4o-mini" },
  anthropic: { endpoint: "https://api.anthropic.com/v1/messages", model: "claude-3-5-haiku-latest" },
  groq: { endpoint: "https://api.groq.com/openai/v1/chat/completions", model: "llama-3.3-70b-versatile" }
};

const defaultAppState = (): AppState => ({ groups: [], routes: [], selectedRouteId: null });

const workspaceStateKey = (workspaceId: string) => `testx-workspace-${workspaceId}-state-v1`;
const workspaceDiscoveredKey = (workspaceId: string) => `testx-workspace-${workspaceId}-discovered-v1`;
const workspaceSetupKey = (workspaceId: string) => `testx-workspace-${workspaceId}-setup-v1`;

const parseStateRaw = (raw: string | null): AppState => {
  if (!raw) return defaultAppState();
  try {
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      groups: Array.isArray(parsed.groups) ? parsed.groups : [],
      routes: Array.isArray(parsed.routes) ? parsed.routes : [],
      selectedRouteId: typeof parsed.selectedRouteId === "string" ? parsed.selectedRouteId : null
    };
  } catch {
    return defaultAppState();
  }
};

const normalizeStoredGroup = (value: string): string => {
  const trimmed = value.trim();
  return trimmed || "General";
};

const parseDiscoveredRaw = (raw: string | null): DiscoveredEndpoint[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const unique = new Map<string, DiscoveredEndpoint>();
    parsed.forEach((item) => {
      if (!item || typeof item !== "object") return;
      const endpoint = item as Partial<DiscoveredEndpoint>;
      const url = typeof endpoint.url === "string" ? endpoint.url.trim() : "";
      if (!url) return;
      const methodCandidate = typeof endpoint.method === "string" ? endpoint.method.toUpperCase() : "GET";
      const method = METHOD_SET.has(methodCandidate as HttpMethod) ? (methodCandidate as HttpMethod) : "GET";
      const group = normalizeStoredGroup(typeof endpoint.group === "string" ? endpoint.group : "General");
      const key = `${method} ${url}`;
      unique.set(key, {
        id: typeof endpoint.id === "string" && endpoint.id ? endpoint.id : crypto.randomUUID(),
        url,
        method,
        group,
        confidence:
          typeof endpoint.confidence === "number" && Number.isFinite(endpoint.confidence)
            ? Math.max(0, Math.min(1, endpoint.confidence))
            : undefined,
        reason: typeof endpoint.reason === "string" ? endpoint.reason : undefined
      });
    });
    return Array.from(unique.values());
  } catch {
    return [];
  }
};

const readWorkspaces = (): WorkspaceItem[] => {
  const raw = localStorage.getItem(WORKSPACES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item) => {
        const ws = item as Partial<WorkspaceItem>;
        return {
          id: typeof ws.id === "string" && ws.id ? ws.id : crypto.randomUUID(),
          name: typeof ws.name === "string" && ws.name.trim() ? ws.name.trim() : "Workspace",
          createdAt: typeof ws.createdAt === "string" ? ws.createdAt : new Date().toISOString(),
          updatedAt: typeof ws.updatedAt === "string" ? ws.updatedAt : new Date().toISOString()
        };
      });
  } catch {
    return [];
  }
};

const saveWorkspaces = (items: WorkspaceItem[]) => {
  localStorage.setItem(WORKSPACES_KEY, JSON.stringify(items));
};

const createWorkspaceItem = (name: string): WorkspaceItem => {
  const now = new Date().toISOString();
  return { id: crypto.randomUUID(), name: name.trim(), createdAt: now, updatedAt: now };
};

const defaultWorkspaceSetup = (): WorkspaceSetup => ({
  siteBaseUrl: "",
  siteMaxPages: 6,
  passiveDiscoveryEnabled: false
});

const readWorkspaceSetup = (workspaceId: string): WorkspaceSetup => {
  const raw = localStorage.getItem(workspaceSetupKey(workspaceId));
  if (!raw) return defaultWorkspaceSetup();
  try {
    const parsed = JSON.parse(raw) as Partial<WorkspaceSetup>;
    return {
      siteBaseUrl: typeof parsed.siteBaseUrl === "string" ? parsed.siteBaseUrl : "",
      siteMaxPages:
        typeof parsed.siteMaxPages === "number" && Number.isFinite(parsed.siteMaxPages)
          ? Math.max(1, Math.min(30, Math.floor(parsed.siteMaxPages)))
          : 6,
      passiveDiscoveryEnabled: parsed.passiveDiscoveryEnabled === true
    };
  } catch {
    return defaultWorkspaceSetup();
  }
};

const saveWorkspaceSetup = (workspaceId: string, setup: WorkspaceSetup) => {
  localStorage.setItem(workspaceSetupKey(workspaceId), JSON.stringify(setup));
};

const initializeWorkspaces = (): { items: WorkspaceItem[]; activeId: string } => {
  let items = readWorkspaces();
  if (items.length === 0 || !items.some((item) => item.name.toLowerCase() === DEFAULT_WORKSPACE_NAME.toLowerCase())) {
    const defaultWorkspace = createWorkspaceItem(DEFAULT_WORKSPACE_NAME);
    items = [defaultWorkspace, ...items];
    saveWorkspaces(items);
  }

  const defaultWorkspace = items.find(
    (item) => item.name.toLowerCase() === DEFAULT_WORKSPACE_NAME.toLowerCase()
  )!;
  const activeId = defaultWorkspace.id;
  localStorage.setItem(ACTIVE_WORKSPACE_KEY, activeId);

  const scopedStateKey = workspaceStateKey(activeId);
  const scopedDiscoveredKey = workspaceDiscoveredKey(activeId);
  let migratedLegacy = false;
  if (!localStorage.getItem(scopedStateKey)) {
    const legacyStateRaw = localStorage.getItem(LEGACY_APP_STATE_KEY);
    if (legacyStateRaw) {
      localStorage.setItem(scopedStateKey, legacyStateRaw);
      migratedLegacy = true;
    }
  }
  if (!localStorage.getItem(scopedDiscoveredKey)) {
    const legacyDiscoveredRaw = localStorage.getItem(LEGACY_DISCOVERED_ENDPOINTS_KEY);
    if (legacyDiscoveredRaw) {
      localStorage.setItem(scopedDiscoveredKey, legacyDiscoveredRaw);
      migratedLegacy = true;
    }
  }
  if (migratedLegacy) {
    localStorage.removeItem(LEGACY_APP_STATE_KEY);
    localStorage.removeItem(LEGACY_DISCOVERED_ENDPOINTS_KEY);
  }

  return { items, activeId };
};

const workspaceBoot = initializeWorkspaces();
let workspaces: WorkspaceItem[] = workspaceBoot.items;
let currentWorkspaceId = workspaceBoot.activeId;

const readState = (): AppState => {
  return parseStateRaw(localStorage.getItem(workspaceStateKey(currentWorkspaceId)));
};

const readDiscoveredEndpoints = (): DiscoveredEndpoint[] => {
  return parseDiscoveredRaw(localStorage.getItem(workspaceDiscoveredKey(currentWorkspaceId)));
};

const saveDiscoveredEndpoints = () => {
  localStorage.setItem(workspaceDiscoveredKey(currentWorkspaceId), JSON.stringify(discoveredEndpoints));
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

const readAiSettings = (): AiSettings => {
  const raw = localStorage.getItem(AI_SETTINGS_KEY);
  if (!raw) {
    return {
      provider: "openai",
      endpoint: "https://api.openai.com/v1/chat/completions",
      model: "gpt-4o-mini",
      rememberKeyInSession: false,
      oneTimeKeyMode: false,
      allowUnsafeEndpoint: false,
      autoClearMinutes: 15,
      privacyMode: true,
      allowSensitiveContext: false
    };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AiSettings>;
    const provider =
      parsed.provider === "openai" ||
      parsed.provider === "anthropic" ||
      parsed.provider === "groq" ||
      parsed.provider === "custom"
        ? parsed.provider
        : "openai";
    const defaultPreset = provider === "custom" ? AI_PROVIDER_PRESETS.openai : AI_PROVIDER_PRESETS[provider];
    return {
      provider,
      endpoint:
        typeof parsed.endpoint === "string" && parsed.endpoint.trim()
          ? parsed.endpoint
          : defaultPreset.endpoint,
      model:
        typeof parsed.model === "string" && parsed.model.trim() ? parsed.model : defaultPreset.model,
      rememberKeyInSession: parsed.rememberKeyInSession === true,
      oneTimeKeyMode: parsed.oneTimeKeyMode === true,
      allowUnsafeEndpoint: parsed.allowUnsafeEndpoint === true,
      autoClearMinutes:
        typeof parsed.autoClearMinutes === "number" && Number.isFinite(parsed.autoClearMinutes)
          ? Math.max(1, Math.floor(parsed.autoClearMinutes))
          : 15,
      privacyMode: parsed.privacyMode !== false,
      allowSensitiveContext: parsed.allowSensitiveContext === true
    };
  } catch {
    return {
      provider: "openai",
      endpoint: "https://api.openai.com/v1/chat/completions",
      model: "gpt-4o-mini",
      rememberKeyInSession: false,
      oneTimeKeyMode: false,
      allowUnsafeEndpoint: false,
      autoClearMinutes: 15,
      privacyMode: true,
      allowSensitiveContext: false
    };
  }
};

let aiSettings = readAiSettings();

const saveState = () => {
  localStorage.setItem(workspaceStateKey(currentWorkspaceId), JSON.stringify(state));
};

const saveAiSettings = () => {
  localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(aiSettings));
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

const getPersistentApiKey = (): string => {
  const value = localStorage.getItem(AI_PERSISTENT_KEY);
  return typeof value === "string" ? value : "";
};

const setPersistentApiKey = (key: string) => {
  localStorage.setItem(AI_PERSISTENT_KEY, key);
};

const clearPersistentApiKey = () => {
  localStorage.removeItem(AI_PERSISTENT_KEY);
};

const PROVIDER_HOST_ALLOWLIST: Record<Exclude<AiProvider, "custom">, string[]> = {
  openai: ["api.openai.com"],
  anthropic: ["api.anthropic.com"],
  groq: ["api.groq.com"]
};

const isEndpointAllowed = (provider: AiProvider, endpoint: string, allowUnsafe: boolean): boolean => {
  try {
    const url = new URL(endpoint);
    if (url.protocol !== "https:") return false;
    if (allowUnsafe) return true;
    if (provider === "custom") return false;
    const allowedHosts = PROVIDER_HOST_ALLOWLIST[provider];
    return allowedHosts.includes(url.hostname.toLowerCase());
  } catch {
    return false;
  }
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

const normalizeBaseSiteUrl = (raw: string): string => {
  const parsed = new URL(raw);
  return parsed.origin;
};

const getWorkspaceSetupFromInputs = (): WorkspaceSetup => ({
  siteBaseUrl: siteBaseUrlInput.value.trim(),
  siteMaxPages: Math.max(1, Math.min(30, Number.parseInt(siteMaxPagesInput.value || "6", 10) || 6)),
  passiveDiscoveryEnabled: passiveDiscoveryEnabledInput.checked
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
    `Site: ${setup.siteBaseUrl || "Not set"}`,
    `Passive: ${setup.passiveDiscoveryEnabled ? "On" : "Off"}`
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
  const setup = readWorkspaceSetup(workspaceId);
  siteBaseUrlInput.value = setup.siteBaseUrl || "";
  siteMaxPagesInput.value = String(setup.siteMaxPages || 6);
  passiveDiscoveryEnabledInput.checked = setup.passiveDiscoveryEnabled;
  editingDiscoveredEndpointId = null;
  currentWorkflow = null;
  aiWorkflowPreview.textContent = "";
  renderWorkspaceOptions();
  renderDiscoveredEndpoints();
  render();
};

const clearWorkspaceData = (workspaceId: string) => {
  localStorage.setItem(workspaceStateKey(workspaceId), JSON.stringify(defaultAppState()));
  localStorage.setItem(workspaceDiscoveredKey(workspaceId), JSON.stringify([]));
  localStorage.setItem(workspaceSetupKey(workspaceId), JSON.stringify(defaultWorkspaceSetup()));
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

const parseHeaders = (raw: string): Record<string, string> => {
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

const normalizeHeaders = (headers: WorkflowStep["headers"]): Record<string, string> => {
  if (!headers) return {};
  if (typeof headers === "string") return parseHeaders(headers);
  const out: Record<string, string> = {};
  Object.entries(headers).forEach(([k, v]) => {
    out[k] = String(v);
  });
  return out;
};

const extractJsonObject = (raw: string): string => {
  const first = raw.indexOf("{");
  const last = raw.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) {
    throw new Error("AI did not return a JSON object.");
  }
  return raw.slice(first, last + 1);
};

const joinUrl = (base: string, path: string): string => {
  if (!base) return path;
  if (/^https?:\/\//i.test(path)) return path;
  const left = base.endsWith("/") ? base.slice(0, -1) : base;
  const right = path.startsWith("/") ? path : `/${path}`;
  return `${left}${right}`;
};

const detectBaseUrl = (spec: Record<string, unknown>): string => {
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

const parseSpecText = (raw: string): Record<string, unknown> => {
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

const normalizeDiscoveredGroup = (value: string): string => {
  const trimmed = value.trim();
  return trimmed || "General";
};

const inferGroupFromEndpointUrl = (url: string): string => {
  const value = url.toLowerCase();
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
  const init: RequestInit = { method, headers: headersInput };
  const allowsBody = !["GET", "DELETE", "HEAD", "OPTIONS"].includes(method);
  if (allowsBody && bodyInput.trim()) {
    init.body = bodyInput;
  }

  const started = performance.now();
  const res = await fetch(url, init);
  const elapsed = performance.now() - started;
  const headersObj: Record<string, string> = {};
  res.headers.forEach((value, key) => {
    headersObj[key] = value;
  });
  const text = await res.text();

  return { res, elapsed, headersObj, text };
};

const redactText = (value: string): string =>
  value
    .replace(/(authorization\s*:\s*bearer\s+)[^\s"']+/gi, "$1[REDACTED]")
    .replace(/(api[_-]?key|token|secret|password)\s*[:=]\s*([^\s,"']+)/gi, "$1=[REDACTED]");

const sanitizeUrlForAi = (rawUrl: string): string => {
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

const ensureAiRequestAllowed = (): { apiKey: string; isAnthropic: boolean } => {
  const apiKey = aiApiKeyMemory.trim();
  if (!aiSettings.endpoint.trim() || !aiSettings.model.trim() || !apiKey) {
    throw new Error("Fill AI endpoint, model, and API key first.");
  }
  if (!isEndpointAllowed(aiSettings.provider, aiSettings.endpoint, aiSettings.allowUnsafeEndpoint)) {
    throw new Error(
      "Endpoint blocked. Use HTTPS and a trusted provider endpoint, or enable unsafe endpoint override."
    );
  }
  return { apiKey, isAnthropic: aiSettings.provider === "anthropic" };
};

const callAiForJson = async (systemPrompt: string, userPayload: Record<string, unknown>) => {
  const { apiKey, isAnthropic } = ensureAiRequestAllowed();
  const userContent = JSON.stringify(userPayload, null, 2);
  const payload = isAnthropic
    ? {
        model: aiSettings.model,
        max_tokens: 1400,
        temperature: 0.2,
        system: systemPrompt,
        messages: [{ role: "user", content: userContent }]
      }
    : {
        model: aiSettings.model,
        temperature: 0.2,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ]
      };

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (isAnthropic) {
    headers["x-api-key"] = apiKey;
    headers["anthropic-version"] = "2023-06-01";
  } else {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const response = await fetch(aiSettings.endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`LLM call failed: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    content?: Array<{ type?: string; text?: string }>;
  };
  const content = isAnthropic
    ? data.content?.find((item) => item.type === "text")?.text
    : data.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("LLM response does not include message content.");
  }

  return JSON.parse(extractJsonObject(content)) as Record<string, unknown>;
};

const discoverLinksFromHtml = (html: string, baseUrl: string): { links: string[]; candidates: string[] } => {
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
    /(https?:\/\/[^\s"'`<>]+|\/(?:api|v1|v2|v3|graphql|rest)[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]*)/gi;
  const scriptText = Array.from(doc.querySelectorAll("script"))
    .map((script) => script.textContent || "")
    .join("\n");
  const combined = `${html}\n${scriptText}`;
  let match: RegExpExecArray | null;
  while ((match = candidateRegex.exec(combined)) !== null) {
    const raw = match[1];
    try {
      const normalized = raw.startsWith("http") ? new URL(raw).toString() : new URL(raw, baseUrl).toString();
      candidates.add(normalized);
    } catch {}
  }

  return { links: Array.from(links), candidates: Array.from(candidates) };
};

const scoreCandidateUrl = (rawUrl: string): number => {
  const value = rawUrl.toLowerCase();
  let score = 0;
  if (/supabase\.co/.test(value)) score += 80;
  if (/(api|graphql|rest\/v\d+|functions\/v\d+|auth\/v\d+|storage\/v\d+)/.test(value)) score += 50;
  if (/(\/v1\/|\/v2\/|\/v3\/|\/rpc\/|\/edge\/|\/function)/.test(value)) score += 30;
  if (/(firebase|hasura|stripe|auth0|clerk|postgrest)/.test(value)) score += 25;
  if (/[?&](apikey|token|auth|project|anon)=/i.test(rawUrl)) score += 10;
  if (/\.css($|\?)/.test(value) || /\.png($|\?)/.test(value) || /\.jpg($|\?)/.test(value)) score -= 40;
  return score;
};

const prioritizeCandidates = (candidates: string[], limit: number): string[] =>
  candidates
    .slice()
    .sort((a, b) => scoreCandidateUrl(b) - scoreCandidateUrl(a))
    .slice(0, limit);

const extractHeuristicEndpointsFromCandidates = (candidates: string[]): DiscoveredEndpoint[] => {
  const out = new Map<string, DiscoveredEndpoint>();

  candidates.forEach((rawUrl) => {
    let parsed: URL;
    try {
      parsed = new URL(rawUrl);
    } catch {
      return;
    }

    const value = parsed.toString().toLowerCase();
    const looksLikeApi =
      /supabase\.co/.test(value) ||
      /(\/api\/|\/graphql|\/rest\/v\d+|\/functions\/v\d+|\/auth\/v\d+|\/storage\/v\d+|\/rpc\/)/.test(value);
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

const sanitizeDiscoveredUrl = (rawUrl: string): string => {
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

const isLikelyApiRequest = (url: string, method: HttpMethod, mimeType: string): boolean => {
  const value = url.toLowerCase();
  if (/(api|graphql|rest\/v\d+|auth\/v\d+|functions\/v\d+|storage\/v\d+|rpc\/|oauth|token|session|login|signup|register)/.test(value)) {
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
          if (/api|graphql|rest\\/v\\d+|functions\\/v\\d+|auth\\/v\\d+|storage\\/v\\d+|supabase\\.co/i.test(name)) {
            out.add(name);
          }
        });
      } catch {}
      try {
        const html = document.documentElement ? document.documentElement.outerHTML : "";
        const regex = /(https?:\\/\\/[^\\s"'<>]+|\\/[a-zA-Z0-9\\-._~:/?#[\\]@!$&'()*+,;=%]+)/g;
        let m;
        while ((m = regex.exec(html)) !== null) {
          const raw = m[1];
          if (!raw) continue;
          if (/api|graphql|rest\\/v\\d+|functions\\/v\\d+|auth\\/v\\d+|storage\\/v\\d+|supabase\\.co/i.test(raw)) {
            try {
              const full = raw.startsWith("http") ? new URL(raw).toString() : new URL(raw, window.location.origin).toString();
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
  const parsed = (await callAiForJson(systemPrompt, {
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

  const parsed = await callAiForJson(systemPrompt, {
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
  const confidence =
    typeof endpoint.confidence === "number" ? ` (${Math.round(endpoint.confidence * 100)}%)` : "";
  const reason = endpoint.reason ? `\n${endpoint.reason}` : "";
  return `<div class="endpoint-item">
    <div class="endpoint-item-head">
      <span class="endpoint-method">${endpoint.method}${confidence}</span>
      <span class="endpoint-url">${endpoint.url}</span>
    </div>
    <div class="helper-text">Group: ${endpoint.group}${reason || ""}</div>
  </div>`;
};

const renderTestEndpointsList = () => {
  if (discoveredEndpoints.length === 0) {
    testEndpointsList.innerHTML = `<div class="helper-text">No discovered endpoints yet.</div>`;
    return;
  }
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
        <div class="helper-text">Group: ${endpoint.group}${endpoint.reason ? `\n${endpoint.reason}` : ""}</div>
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
  renderManageEndpointsList();
  renderManageGroupOptions();
  renderWorkspaceAnalytics();
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
  editingDiscoveredEndpointId = null;
  const setup = defaultWorkspaceSetup();
  siteBaseUrlInput.value = setup.siteBaseUrl;
  siteMaxPagesInput.value = String(setup.siteMaxPages);
  passiveDiscoveryEnabledInput.checked = setup.passiveDiscoveryEnabled;
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
resetManagedEndpointForm();
syncAuthModeInputs();
authModeSelect.addEventListener("change", syncAuthModeInputs);
renderWorkspaceOptions();
workspaceSelect.value = currentWorkspaceId;
const initialSetup = readWorkspaceSetup(currentWorkspaceId);
siteBaseUrlInput.value = initialSetup.siteBaseUrl || siteBaseUrlInput.value;
siteMaxPagesInput.value = String(initialSetup.siteMaxPages || 6);
passiveDiscoveryEnabledInput.checked = initialSetup.passiveDiscoveryEnabled;

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
  if (!passiveDiscoveryEnabledInput.checked) return;
  const rawUrl = entry?.request?.url;
  if (!rawUrl || typeof rawUrl !== "string") return;
  const methodCandidate = (entry?.request?.method || "GET").toUpperCase();
  const method = METHOD_SET.has(methodCandidate as HttpMethod) ? (methodCandidate as HttpMethod) : "GET";
  const mimeType =
    typeof entry?.response?.content?.mimeType === "string" ? entry.response.content.mimeType : "";
  if (!isLikelyApiRequest(rawUrl, method, mimeType)) return;

  const sanitizedUrl = sanitizeDiscoveredUrl(rawUrl);
  const group = normalizeDiscoveredGroup(inferGroupFromEndpointUrl(sanitizedUrl));
  const added = mergeDiscoveredEndpoints([
    {
      id: crypto.randomUUID(),
      url: sanitizedUrl,
      method,
      group,
      confidence: 0.72,
      reason: "Captured from manual runtime network traffic."
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
