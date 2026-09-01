"use client";

// NOTE: Currently using browser-only client-side persistence (localStorage).
// A real database / backend API integration is a future step.

import { useSyncExternalStore, useCallback } from "react";
import { INITIAL_DRAFTS, type Draft } from "./drafts";

const STORAGE_KEY = "contentforge:drafts";
const SYNC_EVENT = "contentforge:drafts-updated";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(SYNC_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(SYNC_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getStoredDraftsRaw(): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      const initialJson = JSON.stringify(INITIAL_DRAFTS);
      localStorage.setItem(STORAGE_KEY, initialJson);
      return initialJson;
    }
    return raw;
  } catch {
    return "";
  }
}

function parseDrafts(raw: string): Draft[] {
  if (!raw) return INITIAL_DRAFTS;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_DRAFTS;
  } catch {
    return INITIAL_DRAFTS;
  }
}

function saveStoredDrafts(nextDrafts: Draft[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDrafts));
    window.dispatchEvent(new Event(SYNC_EVENT));
  } catch (error) {
    console.error("Failed to write drafts to localStorage:", error);
  }
}

export function useDrafts() {
  const rawString = useSyncExternalStore(subscribe, getStoredDraftsRaw, () => "");
  const drafts = parseDrafts(rawString);
  const isLoaded = typeof window !== "undefined";

  const getDraft = useCallback(
    (id: string): Draft | undefined => {
      return drafts.find((d) => d.id === id);
    },
    [drafts]
  );

  const createDraft = useCallback(
    (data: Omit<Draft, "id" | "updatedAt">): Draft => {
      const current = parseDrafts(getStoredDraftsRaw());
      const newDraft: Draft = {
        ...data,
        id: `d_${Date.now()}`,
        updatedAt: new Date().toISOString().split("T")[0],
      };
      const updated = [newDraft, ...current];
      saveStoredDrafts(updated);
      return newDraft;
    },
    []
  );

  const updateDraft = useCallback((id: string, updates: Partial<Draft>): void => {
    const current = parseDrafts(getStoredDraftsRaw());
    const updated = current.map((d) => {
      if (d.id !== id) return d;
      return {
        ...d,
        ...updates,
        updatedAt: new Date().toISOString().split("T")[0],
      };
    });
    saveStoredDrafts(updated);
  }, []);

  const deleteDraft = useCallback((id: string): void => {
    const current = parseDrafts(getStoredDraftsRaw());
    const updated = current.filter((d) => d.id !== id);
    saveStoredDrafts(updated);
  }, []);

  return {
    drafts,
    isLoaded,
    getDraft,
    createDraft,
    updateDraft,
    deleteDraft,
  };
}
