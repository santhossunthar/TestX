export class PanelPortRegistry {
  private readonly portsByTab = new Map<number, chrome.runtime.Port>();

  register(tabId: number, port: chrome.runtime.Port): void {
    this.portsByTab.set(tabId, port);
  }

  get(tabId: number): chrome.runtime.Port | undefined {
    return this.portsByTab.get(tabId);
  }

  unregister(tabId: number): void {
    this.portsByTab.delete(tabId);
  }
}
