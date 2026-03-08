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
const aiEndpointInput = document.querySelector<HTMLInputElement>("#aiEndpointInput");
const aiModelInput = document.querySelector<HTMLInputElement>("#aiModelInput");
const aiApiKeyInput = document.querySelector<HTMLInputElement>("#aiApiKeyInput");
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

const themeToggleEl = document.querySelector<HTMLButtonElement>("#themeToggle");
const themeIconEl = document.querySelector<HTMLSpanElement>("#themeIcon");

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
  !aiEndpointInput ||
  !aiModelInput ||
  !aiApiKeyInput ||
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
  !themeToggleEl ||
  !themeIconEl
) {
  throw new Error("Panel DOM failed to initialize.");
}

type Theme = "light" | "dark";
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

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
  endpoint: string;
  model: string;
  apiKey: string;
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

const APP_STATE_KEY = "testx-api-state-v1";
const THEME_KEY = "testx-theme";
const AI_SETTINGS_KEY = "testx-ai-settings-v1";

const ALLOWED_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];
const METHOD_SET = new Set(ALLOWED_METHODS);

const readState = (): AppState => {
  const raw = localStorage.getItem(APP_STATE_KEY);
  if (!raw) return { groups: [], routes: [], selectedRouteId: null };

  try {
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      groups: Array.isArray(parsed.groups) ? parsed.groups : [],
      routes: Array.isArray(parsed.routes) ? parsed.routes : [],
      selectedRouteId: typeof parsed.selectedRouteId === "string" ? parsed.selectedRouteId : null
    };
  } catch {
    return { groups: [], routes: [], selectedRouteId: null };
  }
};

let state: AppState = readState();
let currentWorkflow: WorkflowPlan | null = null;

const readAiSettings = (): AiSettings => {
  const raw = localStorage.getItem(AI_SETTINGS_KEY);
  if (!raw) {
    return {
      endpoint: "https://api.openai.com/v1/chat/completions",
      model: "gpt-4o-mini",
      apiKey: ""
    };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AiSettings>;
    return {
      endpoint:
        typeof parsed.endpoint === "string" && parsed.endpoint.trim()
          ? parsed.endpoint
          : "https://api.openai.com/v1/chat/completions",
      model: typeof parsed.model === "string" && parsed.model.trim() ? parsed.model : "gpt-4o-mini",
      apiKey: typeof parsed.apiKey === "string" ? parsed.apiKey : ""
    };
  } catch {
    return {
      endpoint: "https://api.openai.com/v1/chat/completions",
      model: "gpt-4o-mini",
      apiKey: ""
    };
  }
};

let aiSettings = readAiSettings();

const saveState = () => {
  localStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
};

const saveAiSettings = () => {
  localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(aiSettings));
};

const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
  const switchTo = theme === "dark" ? "light" : "dark";
  const label = `Switch to ${switchTo} mode`;
  themeToggleEl.setAttribute("aria-label", label);
  themeToggleEl.setAttribute("title", label);
  themeIconEl.textContent = "\u{1F4A1}";
  themeIconEl.dataset.state = theme === "dark" ? "on" : "off";
  localStorage.setItem(THEME_KEY, theme);
};

let currentTheme: Theme = getInitialTheme();
applyTheme(currentTheme);

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

const routeSummary = () =>
  state.routes.map((route) => ({
    id: route.id,
    name: route.name,
    method: route.method,
    url: route.url,
    group: state.groups.find((g) => g.id === route.groupId)?.name ?? "Ungrouped"
  }));

const requestAiWorkflow = async (userPrompt: string): Promise<WorkflowPlan> => {
  if (!aiSettings.endpoint.trim() || !aiSettings.model.trim() || !aiSettings.apiKey.trim()) {
    throw new Error("Fill AI endpoint, model, and API key first.");
  }

  const systemPrompt =
    "You generate API testing workflows. Return only JSON object: {\"goal\":string,\"steps\":[{\"name\":string,\"routeId\":string,\"routeName\":string,\"method\":string,\"url\":string,\"headers\":object,\"body\":string|object,\"assertStatus\":number|number[]}]}. Use routeId or routeName whenever possible. Keep steps executable.";

  const payload = {
    model: aiSettings.model,
    temperature: 0.2,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: JSON.stringify(
          {
            prompt: userPrompt,
            availableRoutes: routeSummary()
          },
          null,
          2
        )
      }
    ]
  };

  const response = await fetch(aiSettings.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${aiSettings.apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`LLM call failed: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("LLM response does not include message content.");
  }

  const parsed = JSON.parse(extractJsonObject(content)) as Partial<WorkflowPlan>;
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

aiEndpointInput.value = aiSettings.endpoint;
aiModelInput.value = aiSettings.model;
aiApiKeyInput.value = aiSettings.apiKey;
aiWorkflowPreview.textContent = "";

saveAiSettingsBtn.addEventListener("click", () => {
  aiSettings = {
    endpoint: aiEndpointInput.value.trim(),
    model: aiModelInput.value.trim(),
    apiKey: aiApiKeyInput.value.trim()
  };
  saveAiSettings();
  aiStatus.textContent = "AI settings saved locally in this DevTools panel.";
});

planAiWorkflowBtn.addEventListener("click", async () => {
  const prompt = aiPromptInput.value.trim();
  if (!prompt) {
    aiStatus.textContent = "Enter a prompt describing the workflow.";
    return;
  }

  aiSettings = {
    endpoint: aiEndpointInput.value.trim(),
    model: aiModelInput.value.trim(),
    apiKey: aiApiKeyInput.value.trim()
  };
  saveAiSettings();
  aiStatus.textContent = "Generating workflow...";
  aiWorkflowPreview.textContent = "";

  try {
    currentWorkflow = await requestAiWorkflow(prompt);
    aiWorkflowPreview.textContent = JSON.stringify(currentWorkflow, null, 2);
    aiStatus.textContent = `Workflow ready with ${currentWorkflow.steps.length} step(s).`;
  } catch (error) {
    currentWorkflow = null;
    const message = error instanceof Error ? error.message : String(error);
    aiStatus.textContent = `AI workflow generation failed: ${message}`;
  }
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

render();
