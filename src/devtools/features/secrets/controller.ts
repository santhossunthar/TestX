import type { SecretEntry, SecretPlacement } from "../core/domain";

interface SecretsElements {
  secretDomainInput: HTMLInputElement;
  useCurrentSiteDomainBtn: HTMLButtonElement;
  secretKeyInput: HTMLInputElement;
  secretValueInput: HTMLInputElement;
  secretPlacementInput: HTMLSelectElement;
  secretEnabledInput: HTMLInputElement;
  saveSecretBtn: HTMLButtonElement;
  cancelSecretEditBtn: HTMLButtonElement;
  secretsStatus: HTMLDivElement;
  secretsList: HTMLDivElement;
}

interface CreateSecretsFeatureOptions {
  initialSecrets: SecretEntry[];
  elements: SecretsElements;
  getCurrentInspectedUrl: () => Promise<string>;
  persistSecrets: (secrets: SecretEntry[]) => void;
  onSecretsChanged: () => void;
}

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

const secretMatchesHost = (pattern: string, host: string): boolean => {
  if (pattern === "*") return true;
  const normalizedPattern = normalizeDomainPattern(pattern);
  const normalizedHost = host.toLowerCase();
  if (normalizedPattern.startsWith("*.")) {
    const suffix = normalizedPattern.slice(2);
    return normalizedHost === suffix || normalizedHost.endsWith(`.${suffix}`);
  }
  return normalizedHost === normalizedPattern;
};

export const createSecretsFeature = ({
  initialSecrets,
  elements,
  getCurrentInspectedUrl,
  persistSecrets,
  onSecretsChanged
}: CreateSecretsFeatureOptions) => {
  let secretEntries = initialSecrets.slice();
  let editingSecretId: string | null = null;

  const resetSecretForm = () => {
    editingSecretId = null;
    elements.secretDomainInput.value = "";
    elements.secretKeyInput.value = "";
    elements.secretValueInput.value = "";
    elements.secretPlacementInput.value = "header";
    elements.secretEnabledInput.checked = true;
    elements.saveSecretBtn.textContent = "Add Secret";
  };

  const renderSecretsList = () => {
    if (secretEntries.length === 0) {
      elements.secretsList.innerHTML = `<div class="helper-text">No secrets configured.</div>`;
      return;
    }
    elements.secretsList.innerHTML = secretEntries
      .map(
        (secret) => `<div class="endpoint-item" data-secret-id="${secret.id}">
    <div class="endpoint-item-head">
      <span class="endpoint-method">${secret.placement.toUpperCase()}</span>
      <span class="endpoint-url">${secret.domainPattern} :: ${secret.key}</span>
    </div>
    <div class="helper-text">Value: •••••••• | ${secret.enabled ? "Enabled" : "Disabled"}</div>
    <div class="inline">
      <button type="button" data-secret-action="edit" data-secret-id="${secret.id}">Edit</button>
      <button type="button" data-secret-action="delete" data-secret-id="${secret.id}">Delete</button>
    </div>
  </div>`
      )
      .join("");
  };

  const applySecretsToRequest = (
    url: string,
    headersInput: Record<string, string>
  ): { url: string; headers: Record<string, string> } => {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return { url, headers: headersInput };
    }

    const headers = { ...headersInput };
    const host = parsed.hostname.toLowerCase();
    secretEntries
      .filter((secret) => secret.enabled && secretMatchesHost(secret.domainPattern, host))
      .forEach((secret) => {
        if (secret.placement === "header") {
          if (!(secret.key in headers)) {
            headers[secret.key] = secret.value;
          }
        } else if (!parsed.searchParams.has(secret.key)) {
          parsed.searchParams.set(secret.key, secret.value);
        }
      });

    return { url: parsed.toString(), headers };
  };

  const setSecrets = (entries: SecretEntry[]) => {
    secretEntries = entries.slice();
    resetSecretForm();
    renderSecretsList();
  };

  const getSecrets = (): SecretEntry[] => secretEntries.slice();

  elements.useCurrentSiteDomainBtn.addEventListener("click", async () => {
    const inspected = await getCurrentInspectedUrl();
    if (!inspected) return;
    try {
      elements.secretDomainInput.value = new URL(inspected).hostname.toLowerCase();
    } catch {}
  });

  elements.secretsList.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const button = target.closest("button[data-secret-action]") as HTMLButtonElement | null;
    if (!button) return;
    const id = button.dataset.secretId;
    if (!id) return;
    const secret = secretEntries.find((item) => item.id === id);
    if (!secret) return;

    if (button.dataset.secretAction === "delete") {
      secretEntries = secretEntries.filter((item) => item.id !== id);
      if (editingSecretId === id) {
        resetSecretForm();
      }
      persistSecrets(secretEntries);
      renderSecretsList();
      onSecretsChanged();
      elements.secretsStatus.textContent = "Secret deleted.";
      return;
    }

    editingSecretId = id;
    elements.secretDomainInput.value = secret.domainPattern;
    elements.secretKeyInput.value = secret.key;
    elements.secretValueInput.value = secret.value;
    elements.secretPlacementInput.value = secret.placement;
    elements.secretEnabledInput.checked = secret.enabled;
    elements.saveSecretBtn.textContent = "Update Secret";
    elements.secretsStatus.textContent = "Editing selected secret.";
  });

  elements.saveSecretBtn.addEventListener("click", () => {
    const domainPattern = normalizeDomainPattern(elements.secretDomainInput.value);
    const key = elements.secretKeyInput.value.trim();
    const value = elements.secretValueInput.value;
    const placement: SecretPlacement = elements.secretPlacementInput.value === "query" ? "query" : "header";
    const enabled = elements.secretEnabledInput.checked;

    if (!domainPattern || !key || !value) {
      elements.secretsStatus.textContent = "Domain, key, and value are required.";
      return;
    }

    if (editingSecretId) {
      secretEntries = secretEntries.map((secret) =>
        secret.id === editingSecretId ? { ...secret, domainPattern, key, value, placement, enabled } : secret
      );
      elements.secretsStatus.textContent = "Secret updated.";
    } else {
      const duplicate = secretEntries.find(
        (secret) =>
          secret.domainPattern === domainPattern &&
          secret.key.toLowerCase() === key.toLowerCase() &&
          secret.placement === placement
      );
      if (duplicate) {
        secretEntries = secretEntries.map((secret) =>
          secret.id === duplicate.id ? { ...secret, value, enabled } : secret
        );
        elements.secretsStatus.textContent = "Existing secret updated.";
      } else {
        secretEntries.push({
          id: crypto.randomUUID(),
          domainPattern,
          key,
          value,
          placement,
          enabled
        });
        elements.secretsStatus.textContent = "Secret added.";
      }
    }

    persistSecrets(secretEntries);
    resetSecretForm();
    renderSecretsList();
    onSecretsChanged();
  });

  elements.cancelSecretEditBtn.addEventListener("click", () => {
    resetSecretForm();
    elements.secretsStatus.textContent = "Secret edit canceled.";
  });

  return {
    applySecretsToRequest,
    renderSecretsList,
    resetSecretForm,
    setSecrets,
    getSecrets
  };
};
