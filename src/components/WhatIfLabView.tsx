import React, { useState } from 'react';
import {
  FlaskConical,
  Sparkles,
  Zap,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  GitBranch,
  Beaker,
  Bookmark,
  Share2,
  ChevronDown,
} from 'lucide-react';
import { AnalysisResult, WhatIfHypothesis } from '../types/reality';
import { DEMO_OBJECTS } from '../data/demoObjects';

interface WhatIfLabViewProps {
  currentAnalysis: AnalysisResult | null;
  selectedComponentHint?: string;
  onSaveHypothesis: (hypothesis: WhatIfHypothesis) => void;
}

export const WhatIfLabView: React.FC<WhatIfLabViewProps> = ({
  currentAnalysis,
  selectedComponentHint,
  onSaveHypothesis,
}) => {
  // If no object is active, default to the 4-stroke engine demo
  const fallbackDemo = DEMO_OBJECTS[0];
  const activeAnalysis = currentAnalysis || fallbackDemo.analysis;

  const [targetComponent, setTargetComponent] = useState<string>(
    selectedComponentHint || 'Entire Assembly'
  );
  const [modificationPrompt, setModificationPrompt] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [currentHypothesis, setCurrentHypothesis] = useState<WhatIfHypothesis | null>(
    fallbackDemo.presetHypotheses[0]
  );
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const presetInspirations = [
    'What if this used ceramic bearings instead of steel?',
    'Could this mechanism be made more efficient with camless solenoid actuation?',
    'What happens if we double the gear ratio or compression ratio?',
    'Could these components be rearranged into an axial layout for compactness?',
    'What if we replaced mechanical linkage with direct electromagnetic drive?',
    'Design an ultra-lightweight generative lattice version of this assembly.',
  ];

  const handleRunSimulation = async (promptToUse?: string) => {
    const text = promptToUse || modificationPrompt;
    if (!text.trim()) return;

    setIsSimulating(true);
    setIsSaved(false);

    try {
      const response = await fetch('/api/what-if-experiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objectName: activeAnalysis.objectName,
          targetComponent,
          modificationPrompt: text,
          context: {
            category: activeAnalysis.category,
            components: activeAnalysis.components.map(c => ({
              name: c.name,
              category: c.category,
              purpose: c.purpose,
            })),
            principles: activeAnalysis.mechanicalPrinciples,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.details || 'Failed to simulate what-if hypothesis');
      }

      setCurrentHypothesis(data.data);
    } catch (err: any) {
      console.error('What-if error:', err);
      // Fallback to preset
      setCurrentHypothesis(fallbackDemo.presetHypotheses[0]);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSave = () => {
    if (currentHypothesis) {
      onSaveHypothesis(currentHypothesis);
      setIsSaved(true);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] max-w-lg mx-auto p-3 overflow-y-auto space-y-3">
      {/* Lab Header Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-violet-950/60 to-slate-900 border border-violet-500/30 text-left shadow-[0_0_20px_rgba(139,92,246,0.15)]">
        <div className="flex items-center space-x-2 text-violet-400 text-[10px] font-mono-tech uppercase font-bold mb-1">
          <FlaskConical className="w-4 h-4 text-violet-400 animate-pulse" />
          <span>WHAT IF? INVENTION LABORATORY</span>
        </div>
        <h2 className="text-base font-extrabold text-slate-100 font-sans">
          Reimagine Physical Architecture
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Explore radical modifications, alternative thermodynamic cycles, new materials, and conceptual tradeoffs.
        </p>
      </div>

      {/* Target Selector & Prompt Formulation */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-left space-y-3">
        {/* Active System Indicator */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono-tech text-slate-400 uppercase text-[10px]">
            ACTIVE PHYSICAL SYSTEM:
          </span>
          <span className="font-mono-tech text-cyan-300 font-bold truncate max-w-[200px]">
            {activeAnalysis.objectName}
          </span>
        </div>

        {/* Target Component Dropdown */}
        <div>
          <label className="block text-[10px] font-mono-tech uppercase text-slate-400 font-bold mb-1">
            TARGET SUBSYSTEM OR COMPONENT
          </label>
          <select
            value={targetComponent}
            onChange={e => setTargetComponent(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs text-cyan-200 font-mono-tech focus:outline-none focus:border-cyan-400"
          >
            <option value="Entire Assembly">Entire Mechanical Assembly</option>
            {activeAnalysis.components.map(comp => (
              <option key={comp.id} value={comp.name}>
                {comp.name} ({comp.category})
              </option>
            ))}
          </select>
        </div>

        {/* Quick Inspiration Chips */}
        <div>
          <span className="text-[10px] font-mono-tech text-slate-400 uppercase mb-1 block">
            INSPIRATION PROMPTS:
          </span>
          <div className="flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
            {presetInspirations.map((insp, i) => (
              <button
                key={i}
                onClick={() => {
                  setModificationPrompt(insp);
                  handleRunSimulation(insp);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-violet-950/60 border border-slate-700 hover:border-violet-500/40 text-[10px] font-mono-tech text-violet-300 whitespace-nowrap active:scale-95 transition-all"
              >
                {insp}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input Formulation */}
        <div>
          <label className="block text-[10px] font-mono-tech uppercase text-slate-400 font-bold mb-1">
            PROPOSE YOUR MODIFICATION
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={modificationPrompt}
              onChange={e => setModificationPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRunSimulation()}
              placeholder="e.g., What if this used magnetic levitation bearings?"
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 font-mono-tech focus:outline-none focus:border-violet-400"
            />
            <button
              onClick={() => handleRunSimulation()}
              disabled={isSimulating || !modificationPrompt.trim()}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs font-mono-tech uppercase tracking-wider disabled:opacity-50 active:scale-95 transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] flex items-center space-x-1 shrink-0"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>SIMULATE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading Simulation Animation */}
      {isSimulating && (
        <div className="p-8 rounded-2xl bg-slate-900/90 border border-violet-500/40 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full border-2 border-violet-400/40 border-t-violet-400 animate-spin flex items-center justify-center mb-3">
            <FlaskConical className="w-6 h-6 text-violet-400 animate-pulse" />
          </div>
          <h3 className="text-sm font-bold font-mono-tech text-violet-300 uppercase tracking-wider mb-1">
            SYNTHESIZING CONCEPT ARCHITECTURE
          </h3>
          <p className="text-xs text-slate-400 font-mono-tech">
            Evaluating thermodynamic tradeoffs, kinematic feasibility, and testing protocols...
          </p>
        </div>
      )}

      {/* Structured Lab Results */}
      {!isSimulating && currentHypothesis && (
        <div className="space-y-3 text-left">
          {/* Speculative Design Legal & Engineering Disclosure */}
          <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[10px] font-mono-tech flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">SPECULATIVE DESIGN NOTICE: </span>
              {currentHypothesis.speculativeNotice}
            </div>
          </div>

          {/* Concept Header Card */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-violet-500/30 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono-tech text-violet-400 uppercase tracking-wider font-bold">
                  INVENTION CONCEPT
                </span>
                <h3 className="text-base font-bold text-slate-100 font-sans mt-0.5">
                  {currentHypothesis.conceptTitle}
                </h3>
                <p className="text-[11px] font-mono-tech text-slate-400">
                  Target: {currentHypothesis.targetComponent}
                </p>
              </div>

              {/* Save concept button */}
              <button
                onClick={handleSave}
                className={`p-2 rounded-xl border transition-all active:scale-95 ${
                  isSaved
                    ? 'bg-violet-500/20 border-violet-400 text-violet-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-violet-400'
                }`}
                title="Save concept to discoveries"
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              {currentHypothesis.overview}
            </p>

            {/* Mechanics Explanation */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <h4 className="text-[10px] font-mono-tech uppercase text-cyan-400 font-bold mb-1">
                MECHANICAL & PHYSICAL REASONING
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {currentHypothesis.mechanicsExplanation}
              </p>
            </div>
          </div>

          {/* Tradeoffs Matrix */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h4 className="text-xs font-mono-tech uppercase text-slate-300 font-bold flex items-center space-x-1.5">
              <GitBranch className="w-4 h-4 text-cyan-400" />
              <span>TRADEOFFS & IMPACT METRICS</span>
            </h4>

            {/* Impact Metric Gauges */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-cyan-500/20 text-center">
                <span className="text-[9px] font-mono-tech text-slate-400 block uppercase">
                  EFFICIENCY
                </span>
                <span className="text-xs font-bold font-mono-tech text-cyan-300 capitalize">
                  {currentHypothesis.tradeoffs.efficiencyImpact}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/20 text-center">
                <span className="text-[9px] font-mono-tech text-slate-400 block uppercase">
                  DURABILITY
                </span>
                <span className="text-xs font-bold font-mono-tech text-amber-300 capitalize">
                  {currentHypothesis.tradeoffs.durabilityImpact}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-violet-500/20 text-center">
                <span className="text-[9px] font-mono-tech text-slate-400 block uppercase">
                  COMPLEXITY
                </span>
                <span className="text-xs font-bold font-mono-tech text-violet-300 capitalize">
                  {currentHypothesis.tradeoffs.complexityImpact}
                </span>
              </div>
            </div>

            {/* Pros & Cons Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {/* Pros */}
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <span className="text-[10px] font-mono-tech uppercase text-emerald-400 font-bold block mb-1.5 flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  <span>ADVANTAGES (PROS)</span>
                </span>
                <ul className="text-xs text-emerald-200/90 space-y-1 list-disc list-inside">
                  {currentHypothesis.tradeoffs.pros.map((pro, i) => (
                    <li key={i}>{pro}</li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30">
                <span className="text-[10px] font-mono-tech uppercase text-rose-400 font-bold block mb-1.5 flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  <span>CHALLENGES & RISKS (CONS)</span>
                </span>
                <ul className="text-xs text-rose-200/90 space-y-1 list-disc list-inside">
                  {currentHypothesis.tradeoffs.cons.map((con, i) => (
                    <li key={i}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Conceptual Schematic Flow */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
            <h4 className="text-xs font-mono-tech uppercase text-cyan-300 font-bold">
              CONCEPTUAL SCHEMATIC FLOW
            </h4>

            <div className="space-y-2">
              {currentHypothesis.schematicFlow.map(step => (
                <div
                  key={step.step}
                  className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800"
                >
                  <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 text-[10px] font-mono-tech text-cyan-300 flex items-center justify-center font-bold shrink-0 mt-0.5">
                    {step.step}
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200 font-mono-tech">
                      {step.title}
                    </h5>
                    <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Proposed Validation Experiments */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/20 space-y-2.5">
            <h4 className="text-xs font-mono-tech uppercase text-cyan-400 font-bold flex items-center space-x-1.5">
              <Beaker className="w-4 h-4 text-cyan-400" />
              <span>PROPOSED NEXT VALIDATION EXPERIMENTS</span>
            </h4>

            <div className="space-y-2">
              {currentHypothesis.proposedExperiments.map((exp, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5"
                >
                  <h5 className="text-xs font-bold text-slate-100 font-mono-tech">
                    {exp.title}
                  </h5>
                  <div className="text-[11px] text-slate-300">
                    <span className="text-slate-500 font-mono-tech uppercase">Procedure: </span>
                    {exp.procedure}
                  </div>
                  <div className="text-[11px] text-cyan-300">
                    <span className="text-cyan-500 font-mono-tech uppercase">Expected Metric: </span>
                    {exp.expectedOutcome}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
