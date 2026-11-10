/**
 * REALITY LAYERS
 * Physical World Discovery Tool & Invention Laboratory
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { ExploreCamera } from './components/ExploreCamera';
import { DeepDiveView } from './components/DeepDiveView';
import { WhatIfLabView } from './components/WhatIfLabView';
import { DiscoveriesView } from './components/DiscoveriesView';
import { AnalysisResult, SavedDiscovery, WhatIfHypothesis } from './types/reality';
import { DEMO_OBJECTS } from './data/demoObjects';
import { getSavedDiscoveries, saveDiscovery, deleteDiscovery } from './utils/storage';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<TabType>('explore');
  const [isFirstUse, setIsFirstUse] = useState<boolean>(true);

  // Analysis State
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzingStep, setAnalyzingStep] = useState<string>('');
  const [whatIfTargetHint, setWhatIfTargetHint] = useState<string>('Entire Assembly');

  // Discoveries Storage State
  const [savedDiscoveries, setSavedDiscoveries] = useState<SavedDiscovery[]>([]);
  const [isCurrentSaved, setIsCurrentSaved] = useState<boolean>(false);

  // System Status
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);

  // Check backend server status and initialize saved discoveries on mount
  useEffect(() => {
    // Load local discoveries
    const stored = getSavedDiscoveries();
    if (stored.length === 0) {
      // Seed with initial demo engine so user has an example discovery in the archive
      const initialEngineDemo = DEMO_OBJECTS[0];
      const initialSaved = saveDiscovery(
        initialEngineDemo.analysis,
        [],
        initialEngineDemo.presetHypotheses,
        'Initial baseline reference: Single-cylinder internal combustion mechanical cutaway.'
      );
      setSavedDiscoveries([initialSaved]);
    } else {
      setSavedDiscoveries(stored);
    }

    // Ping server
    fetch('/api/status')
      .then(res => res.json())
      .then(data => {
        setHasApiKey(Boolean(data.hasApiKey));
      })
      .catch(err => {
        console.warn('Status check notice:', err);
      });
  }, []);

  // Update saved status whenever activeAnalysis changes
  useEffect(() => {
    if (activeAnalysis) {
      const exists = savedDiscoveries.some(d => d.analysis.id === activeAnalysis.id);
      setIsCurrentSaved(exists);
    } else {
      setIsCurrentSaved(false);
    }
  }, [activeAnalysis, savedDiscoveries]);

  // Handler: When an image is analyzed (from camera or file)
  const handleImageAnalyzed = (result: AnalysisResult) => {
    setActiveAnalysis(result);
    setIsAnalyzing(false);
    setIsFirstUse(false);
    setCurrentTab('deepdive');
  };

  // Handler: When user selects a demo object
  const handleSelectDemo = (demoId: string) => {
    const demo = DEMO_OBJECTS.find(d => d.id === demoId) || DEMO_OBJECTS[0];
    setActiveAnalysis(demo.analysis);
    setIsFirstUse(false);
    setCurrentTab('deepdive');
  };

  // Handler: When user proposes a component to take to What If? Lab
  const handleSendToWhatIf = (componentName: string) => {
    setWhatIfTargetHint(componentName);
    setIsFirstUse(false);
    setCurrentTab('whatif');
  };

  // Handler: Save active discovery
  const handleSaveActiveDiscovery = () => {
    if (!activeAnalysis) return;
    const matchingDemo = DEMO_OBJECTS.find(d => d.analysis.id === activeAnalysis.id);
    const hypotheses = matchingDemo ? matchingDemo.presetHypotheses : [];
    const saved = saveDiscovery(activeAnalysis, [], hypotheses);

    setSavedDiscoveries(getSavedDiscoveries());
    setIsCurrentSaved(true);
  };

  // Handler: Save hypothesis from What-If Lab
  const handleSaveHypothesis = (hypothesis: WhatIfHypothesis) => {
    if (!activeAnalysis) {
      // Use fallback engine demo analysis
      const demo = DEMO_OBJECTS[0];
      const saved = saveDiscovery(demo.analysis, [], [hypothesis]);
      setSavedDiscoveries(getSavedDiscoveries());
      return;
    }

    const existingDiscovery = savedDiscoveries.find(d => d.analysis.id === activeAnalysis.id);
    const existingHypotheses = existingDiscovery?.hypotheses || [];
    const updatedHypotheses = [
      hypothesis,
      ...existingHypotheses.filter(h => h.id !== hypothesis.id),
    ];

    saveDiscovery(activeAnalysis, existingDiscovery?.chatHistory || [], updatedHypotheses);
    setSavedDiscoveries(getSavedDiscoveries());
  };

  // Handler: Delete saved discovery
  const handleDeleteDiscovery = (id: string) => {
    const updated = deleteDiscovery(id);
    setSavedDiscoveries(updated);
  };

  // Handler: Select saved discovery to inspect
  const handleSelectSavedDiscovery = (discovery: SavedDiscovery) => {
    setActiveAnalysis(discovery.analysis);
    setIsFirstUse(false);
    setCurrentTab('deepdive');
  };

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Top HUD Header */}
      <Header
        hasApiKey={hasApiKey}
        savedCount={savedDiscoveries.length}
        onOpenDiscoveries={() => {
          setIsFirstUse(false);
          setCurrentTab('discoveries');
        }}
        onResetHome={() => {
          setIsFirstUse(true);
          setCurrentTab('explore');
        }}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 overflow-x-hidden">
        {/* First Use Hero Home Screen */}
        {isFirstUse ? (
          <HomeScreen
            onStartExplore={() => {
              setIsFirstUse(false);
              setCurrentTab('explore');
            }}
            onEnterWhatIf={() => {
              setIsFirstUse(false);
              setCurrentTab('whatif');
            }}
            onLoadDemo={demoId => handleSelectDemo(demoId)}
          />
        ) : (
          <>
            {/* Tab: EXPLORE */}
            {currentTab === 'explore' && (
              <ExploreCamera
                onImageAnalyzed={handleImageAnalyzed}
                onSelectDemo={handleSelectDemo}
                isAnalyzing={isAnalyzing}
                analyzingStep={analyzingStep}
              />
            )}

            {/* Tab: DEEP DIVE */}
            {currentTab === 'deepdive' && (
              activeAnalysis ? (
                <DeepDiveView
                  analysis={activeAnalysis}
                  onSendToWhatIf={handleSendToWhatIf}
                  onSaveDiscovery={handleSaveActiveDiscovery}
                  isSaved={isCurrentSaved}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] p-6 text-center max-w-sm mx-auto">
                  <p className="text-xs font-mono-tech text-slate-400 mb-4">
                    No active object in memory. Capture a real object or choose a mechanical demo.
                  </p>
                  <button
                    onClick={() => handleSelectDemo('demo-engine')}
                    className="px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs font-mono-tech uppercase tracking-wider active:scale-95 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                  >
                    LOAD 4-STROKE ENGINE DEMO
                  </button>
                </div>
              )
            )}

            {/* Tab: WHAT IF? LAB */}
            {currentTab === 'whatif' && (
              <WhatIfLabView
                currentAnalysis={activeAnalysis}
                selectedComponentHint={whatIfTargetHint}
                onSaveHypothesis={handleSaveHypothesis}
              />
            )}

            {/* Tab: DISCOVERIES */}
            {currentTab === 'discoveries' && (
              <DiscoveriesView
                discoveries={savedDiscoveries}
                onSelectDiscovery={handleSelectSavedDiscovery}
                onDeleteDiscovery={handleDeleteDiscovery}
                onExploreNew={() => {
                  setIsFirstUse(false);
                  setCurrentTab('explore');
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Samsung Mobile Thumb-friendly Bottom Navigation Bar */}
      <BottomNav
        currentTab={isFirstUse ? 'explore' : currentTab}
        onChangeTab={tab => {
          setIsFirstUse(false);
          setCurrentTab(tab);
        }}
        hasActiveAnalysis={Boolean(activeAnalysis)}
        savedCount={savedDiscoveries.length}
      />
    </div>
  );
}
