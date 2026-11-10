import { SavedDiscovery, AnalysisResult, ChatMessage, WhatIfHypothesis } from '../types/reality';

const STORAGE_KEY = 'reality_layers_discoveries_v1';

export function getSavedDiscoveries(): SavedDiscovery[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load saved discoveries:', e);
    return [];
  }
}

export function saveDiscovery(
  analysis: AnalysisResult,
  chatHistory: ChatMessage[] = [],
  hypotheses: WhatIfHypothesis[] = [],
  notes?: string
): SavedDiscovery {
  const existing = getSavedDiscoveries();
  const existingIndex = existing.findIndex(d => d.analysis.id === analysis.id);

  const discoveryItem: SavedDiscovery = {
    id: existingIndex >= 0 ? existing[existingIndex].id : 'discovery-' + Date.now(),
    timestamp: Date.now(),
    title: analysis.objectName,
    objectName: analysis.objectName,
    imageUrl: analysis.imageUrl,
    analysis,
    chatHistory,
    hypotheses,
    notes,
  };

  let updated: SavedDiscovery[];
  if (existingIndex >= 0) {
    updated = [...existing];
    updated[existingIndex] = discoveryItem;
  } else {
    updated = [discoveryItem, ...existing];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save discovery to localStorage:', e);
  }

  return discoveryItem;
}

export function deleteDiscovery(id: string): SavedDiscovery[] {
  const existing = getSavedDiscoveries();
  const filtered = existing.filter(d => d.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to delete discovery:', e);
  }
  return filtered;
}
