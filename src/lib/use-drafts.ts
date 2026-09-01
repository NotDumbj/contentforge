"use client";

// NOTE: Currently using browser-only client-side persistence (localStorage).
// A real database / backend API integration is a future step.

import { useState, useEffect, useCallback } from "react";
import { INITIAL_DRAFTS, type Draft } from "./drafts";

const STORAGE_KEY = "contentforge:drafts";
const SYNC_EVENT = "contentforge:drafts-updated";

function getStoredDrafts(): Draft[] {
  if (typeof window === "undefined") {
    return INITIAL_DRAFTS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DRAFTS));
      return INITIAL_DRAFTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_DRAFTS;
  } catch (error) {
    console.error("Failed to read drafts from localStorage:", error);
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
  const [drafts, setDrafts] = useState<Draft[]>(() => INITIAL_DRAFTS);
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshDrafts = useCallback(() => {
    setDrafts(getStoredDrafts());
  }, []);

  useEffect(() => {
    refreshDrafts();
    setIsLoaded(true);

    const handleSync = () => refreshDrafts();
    window.addEventListener(SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener(SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [refreshDrafts]);

  const getDraft = useCallback(
    (id: string): Draft | undefined => {
      return drafts.find((d) => d.id === id);
    },
    [drafts]
  );

  const createDraft = useCallback(
    (data: Omit<Draft, "id" | "updatedAt">): Draft => {
      const current = getStoredDrafts();
      const newDraft: Draft = {
        ...data,
        id: `d_${Date.now()}`,
        updatedAt: new Date().toISOString().split("T")[0],
      };
      const updated = [newDraft, ...current];
      saveStoredDrafts(updated);
      setDrafts(updated);
      return newDraft;
    },
    []
  );

  const updateDraft = useCallback((id: string, updates: Partial<Draft>): void => {
    const current = getStoredDrafts();
    const updated = current.map((d) => {
      if (d.id !== id) return d;
      return {
        ...d,
        ...updates,
        updatedAt: new Date().toISOString().split("T")[0],
      };
    });
    saveStoredDrafts(updated);
    setDrafts(updated);
  }, []);

  const deleteDraft = useCallback((id: string): void => {
    const current = getStoredDrafts();
    const updated = current.filter((d) => d.id !== id);
    saveStoredDrafts(updated);
    setDrafts(updated);
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
