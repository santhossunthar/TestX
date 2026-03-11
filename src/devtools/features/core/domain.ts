export type Theme = "light" | "dark";
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
export type AiProvider = "openai" | "anthropic" | "groq" | "custom";
export type AuthMode = "signin" | "signup";
export type SecretPlacement = "header" | "query";

export interface ApiGroup {
  id: string;
  name: string;
}

export interface ApiRoute {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  groupId: string | null;
  headers: string;
  body: string;
}

export interface AppState {
  groups: ApiGroup[];
  routes: ApiRoute[];
  selectedRouteId: string | null;
}

export interface ImportedRoute {
  name: string;
  method: HttpMethod;
  url: string;
  groupName: string | null;
}

export interface AiSettings {
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

export interface WorkflowStep {
  name?: string;
  routeId?: string;
  routeName?: string;
  method?: HttpMethod;
  url?: string;
  headers?: Record<string, string> | string;
  body?: unknown;
  assertStatus?: number | number[];
}

export interface WorkflowPlan {
  goal?: string;
  steps: WorkflowStep[];
}

export interface DiscoveredEndpoint {
  id: string;
  url: string;
  method: HttpMethod;
  group: string;
  confidence?: number;
  reason?: string;
}

export interface RepeaterEntry {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  headers: string;
  body: string;
  responseMeta?: string;
  responseBody?: string;
  flowSteps?: RepeaterFlowStep[];
  activeFlowIndex?: number;
}

export interface RepeaterFlowStep {
  requestMethod: HttpMethod;
  requestUrl: string;
  requestHeaders: string;
  requestBody: string;
  responseStatus: number;
  responseStatusText: string;
  responseHeaders: string;
  responseBody: string;
  elapsedMs: number;
}

export interface SecretEntry {
  id: string;
  domainPattern: string;
  key: string;
  value: string;
  placement: SecretPlacement;
  enabled: boolean;
}

export interface EndpointTestResult {
  endpointId: string;
  status?: number;
  elapsedMs?: number;
  summary: string;
  error?: string;
}

export interface WorkspaceItem {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceSetup {
  siteBaseUrl: string;
  siteMaxPages: number;
  passiveDiscoveryEnabled: boolean;
  proxyDiscoveryEnabled: boolean;
}

export const ALLOWED_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];
export const METHOD_SET = new Set(ALLOWED_METHODS);

export const AI_PROVIDER_PRESETS: Record<Exclude<AiProvider, "custom">, { endpoint: string; model: string }> = {
  openai: { endpoint: "https://api.openai.com/v1/chat/completions", model: "gpt-4o-mini" },
  anthropic: { endpoint: "https://api.anthropic.com/v1/messages", model: "claude-3-5-haiku-latest" },
  groq: { endpoint: "https://api.groq.com/openai/v1/chat/completions", model: "llama-3.3-70b-versatile" }
};

export const defaultAppState = (): AppState => ({ groups: [], routes: [], selectedRouteId: null });

export const defaultWorkspaceSetup = (): WorkspaceSetup => ({
  siteBaseUrl: "",
  siteMaxPages: 6,
  passiveDiscoveryEnabled: false,
  proxyDiscoveryEnabled: false
});
