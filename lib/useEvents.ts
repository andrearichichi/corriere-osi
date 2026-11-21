"use client";
import { useCallback } from "react";
import type { EventName, TrackedEvent } from "./events";
import { useStoredState } from "./store";

export function useEventLog(key: string) {
  const [events, setEvents, reset] = useStoredState<TrackedEvent[]>(`events:${key}`, []);
  const track = useCallback(
    (name: EventName, at: string, props: TrackedEvent["props"] = {}) =>
      setEvents((ev) => [...ev, { id: (ev.at(-1)?.id ?? 0) + 1, name, at, props }]),
    [setEvents],
  );
  return { events, track, reset };
}
