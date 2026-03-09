import type { InspectorEvent } from "../shared/types";

export class EventBuffer {
  private readonly eventsByTab = new Map<number, InspectorEvent[]>();

  constructor(private readonly maxEventsPerTab: number) {}

  get(tabId: number): InspectorEvent[] {
    return this.eventsByTab.get(tabId) ?? [];
  }

  push(tabId: number, event: InspectorEvent): void {
    const events = this.eventsByTab.get(tabId) ?? [];
    events.push(event);
    if (events.length > this.maxEventsPerTab) {
      events.splice(0, events.length - this.maxEventsPerTab);
    }
    this.eventsByTab.set(tabId, events);
  }
}
