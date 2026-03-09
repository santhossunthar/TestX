import {
  AI_PROVIDER_PRESETS,
  METHOD_SET,
  defaultAppState,
  defaultWorkspaceSetup,
  type AiProvider,
  type AiSettings,
  type AppState,
  type DiscoveredEndpoint,
  type HttpMethod,
  type SecretEntry,
  type WorkspaceItem,
  type WorkspaceSetup
} from "./domain";

const LEGACY_APP_STATE_KEY = "testx-api-state-v1";
const LEGACY_DISCOVERED_ENDPOINTS_KEY = "testx-discovered-endpoints-v1";
const WORKSPACES_KEY = "testx-workspaces-v1";
export const ACTIVE_WORKSPACE_KEY = "testx-active-workspace-v1";
const DEFAULT_WORKSPACE_NAME = "Default Workspace";
const SECRETS_KEY_PREFIX = "testx-workspace-";
const AI_SETTINGS_KEY = "testx-ai-settings-v1";
export const AI_SESSION_KEY = "testx-ai-session-key";
export const AI_PERSISTENT_KEY = "testx-ai-persistent-key-v1";
export const THEME_KEY = "testx-theme";

const workspaceStateKey = (workspaceId: string) => `testx-workspace-${workspaceId}-state-v1`;
const workspaceDiscoveredKey = (workspaceId: string) => `testx-workspace-${workspaceId}-discovered-v1`;
const workspaceSetupKey = (workspaceId: string) => `testx-workspace-${workspaceId}-setup-v1`;
const workspaceSecretsKey = (workspaceId: string) => `${SECRETS_KEY_PREFIX}${workspaceId}-secrets-v1`;
const workspaceRequestHeadersKey = (workspaceId: string) => `testx-workspace-${workspaceId}-request-headers-v1`;

const normalizeStoredGroup = (value: string): string => {
  const trimmed = value.trim();
  return trimmed || "General";
};

const normalizeDomainPattern = (raw: string): string => {
  const value = raw.trim().toLowerCase();
  if (!value) return "";
  if (value === "*") return "*";
  if (value.startsWith("http://") || value.startsWith("https://")) {
    try {
      return new URL(value).hostname.toLowerCase();
    } catch {
      return "";
    }
  }
  return value.replace(/^(\*\.)?www\./, (match) => (match.startsWith("*.") ? "*." : ""));
};

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
      unique.set(`${method} ${url}`, {
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

export const readWorkspaces = (): WorkspaceItem[] => {
  const raw = localStorage.getItem(WORKSPACES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item) => {
        const workspace = item as Partial<WorkspaceItem>;
        return {
          id: typeof workspace.id === "string" && workspace.id ? workspace.id : crypto.randomUUID(),
          name:
            typeof workspace.name === "string" && workspace.name.trim() ? workspace.name.trim() : "Workspace",
          createdAt: typeof workspace.createdAt === "string" ? workspace.createdAt : new Date().toISOString(),
          updatedAt: typeof workspace.updatedAt === "string" ? workspace.updatedAt : new Date().toISOString()
        };
      });
  } catch {
    return [];
  }
};

export const saveWorkspaces = (items: WorkspaceItem[]) => {
  localStorage.setItem(WORKSPACES_KEY, JSON.stringify(items));
};

export const createWorkspaceItem = (name: string): WorkspaceItem => {
  const now = new Date().toISOString();
  return { id: crypto.randomUUID(), name: name.trim(), createdAt: now, updatedAt: now };
};

export const initializeWorkspaces = (): { items: WorkspaceItem[]; activeId: string } => {
  let items = readWorkspaces();
  if (items.length === 0 || !items.some((item) => item.name.toLowerCase() === DEFAULT_WORKSPACE_NAME.toLowerCase())) {
    const defaultWorkspace = createWorkspaceItem(DEFAULT_WORKSPACE_NAME);
    items = [defaultWorkspace, ...items];
    saveWorkspaces(items);
  }

  const defaultWorkspace = items.find(
    (item) => item.name.toLowerCase() === DEFAULT_WORKSPACE_NAME.toLowerCase()
  );
  if (!defaultWorkspace) {
    throw new Error("Default workspace initialization failed.");
  }

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

export const readWorkspaceState = (workspaceId: string): AppState =>
  parseStateRaw(localStorage.getItem(workspaceStateKey(workspaceId)));

export const saveWorkspaceState = (workspaceId: string, state: AppState) => {
  localStorage.setItem(workspaceStateKey(workspaceId), JSON.stringify(state));
};

export const readWorkspaceDiscoveredEndpoints = (workspaceId: string): DiscoveredEndpoint[] =>
  parseDiscoveredRaw(localStorage.getItem(workspaceDiscoveredKey(workspaceId)));

export const saveWorkspaceDiscoveredEndpoints = (workspaceId: string, endpoints: DiscoveredEndpoint[]) => {
  localStorage.setItem(workspaceDiscoveredKey(workspaceId), JSON.stringify(endpoints));
};

export const readWorkspaceSetup = (workspaceId: string): WorkspaceSetup => {
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
      passiveDiscoveryEnabled: parsed.passiveDiscoveryEnabled === true,
      proxyDiscoveryEnabled: parsed.proxyDiscoveryEnabled === true
    };
  } catch {
    return defaultWorkspaceSetup();
  }
};

export const saveWorkspaceSetup = (workspaceId: string, setup: WorkspaceSetup) => {
  localStorage.setItem(workspaceSetupKey(workspaceId), JSON.stringify(setup));
};

export const readWorkspaceSecrets = (workspaceId: string): SecretEntry[] => {
  const raw = localStorage.getItem(workspaceSecretsKey(workspaceId));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item) => {
        const secret = item as Partial<SecretEntry>;
        return {
          id: typeof secret.id === "string" && secret.id ? secret.id : crypto.randomUUID(),
          domainPattern: normalizeDomainPattern(
            typeof secret.domainPattern === "string" ? secret.domainPattern : ""
          ),
          key: typeof secret.key === "string" ? secret.key.trim() : "",
          value: typeof secret.value === "string" ? secret.value : "",
          placement: secret.placement === "query" ? "query" : "header",
          enabled: secret.enabled !== false
        };
      })
      .filter((item) => Boolean(item.domainPattern && item.key && item.value));
  } catch {
    return [];
  }
};

export const saveWorkspaceSecrets = (workspaceId: string, secrets: SecretEntry[]) => {
  localStorage.setItem(workspaceSecretsKey(workspaceId), JSON.stringify(secrets));
};

export const clearWorkspaceSecrets = (workspaceId: string) => {
  localStorage.setItem(workspaceSecretsKey(workspaceId), JSON.stringify([]));
};

export const readWorkspaceRequestHeaders = (workspaceId: string): Record<string, string> => {
  const raw = localStorage.getItem(workspaceRequestHeadersKey(workspaceId));
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const headersByEndpoint: Record<string, string> = {};
    Object.entries(parsed).forEach(([key, value]) => {
      if (typeof value === "string") {
        headersByEndpoint[key] = value;
      }
    });
    return headersByEndpoint;
  } catch {
    return {};
  }
};

export const saveWorkspaceRequestHeaders = (workspaceId: string, headersByEndpoint: Record<string, string>) => {
  localStorage.setItem(workspaceRequestHeadersKey(workspaceId), JSON.stringify(headersByEndpoint));
};

export const clearWorkspaceRequestHeaders = (workspaceId: string) => {
  localStorage.setItem(workspaceRequestHeadersKey(workspaceId), JSON.stringify({}));
};

const defaultAiSettingsForProvider = (provider: AiProvider): AiSettings => {
  const defaultPreset = provider === "custom" ? AI_PROVIDER_PRESETS.openai : AI_PROVIDER_PRESETS[provider];
  return {
    provider,
    endpoint: defaultPreset.endpoint,
    model: defaultPreset.model,
    rememberKeyInSession: false,
    oneTimeKeyMode: false,
    allowUnsafeEndpoint: false,
    autoClearMinutes: 15,
    privacyMode: true,
    allowSensitiveContext: false
  };
};

export const readAiSettings = (): AiSettings => {
  const raw = localStorage.getItem(AI_SETTINGS_KEY);
  if (!raw) {
    return defaultAiSettingsForProvider("openai");
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
    const defaults = defaultAiSettingsForProvider(provider);
    return {
      provider,
      endpoint: typeof parsed.endpoint === "string" && parsed.endpoint.trim() ? parsed.endpoint : defaults.endpoint,
      model: typeof parsed.model === "string" && parsed.model.trim() ? parsed.model : defaults.model,
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
    return defaultAiSettingsForProvider("openai");
  }
};

export const saveAiSettings = (settings: AiSettings) => {
  localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(settings));
};

export const getPersistentApiKey = (): string => {
  const value = localStorage.getItem(AI_PERSISTENT_KEY);
  return typeof value === "string" ? value : "";
};

export const setPersistentApiKey = (key: string) => {
  localStorage.setItem(AI_PERSISTENT_KEY, key);
};

export const clearPersistentApiKey = () => {
  localStorage.removeItem(AI_PERSISTENT_KEY);
};
