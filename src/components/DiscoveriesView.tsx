import React, { useState } from 'react';
import {
  Bookmark,
  Trash2,
  FileDown,
  ArrowRight,
  ExternalLink,
  Layers,
  FlaskConical,
  Clock,
  Sparkles,
  Camera,
  Check,
} from 'lucide-react';
import { SavedDiscovery, AnalysisResult } from '../types/reality';

interface DiscoveriesViewProps {
  discoveries: SavedDiscovery[];
  onSelectDiscovery: (discovery: SavedDiscovery) => void;
  onDeleteDiscovery: (id: string) => void;
  onExploreNew: () => void;
}

export const DiscoveriesView: React.FC<DiscoveriesViewProps> = ({
  discoveries,
  onSelectDiscovery,
  onDeleteDiscovery,
  onExploreNew,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleExportMarkdown = (discovery: SavedDiscovery) => {
    const report = `# REALITY LAYERS: DISCOVERY REPORT
Object: ${discovery.objectName}
Category: ${discovery.analysis.category}
Identified: ${new Date(discovery.timestamp).toLocaleString()}
Confidence: ${Math.round(discovery.analysis.confidence * 100)}% (${discovery.analysis.confidenceLevel})

## Summary
${discovery.analysis.summary}

## Visible Observations
${discovery.analysis.visibleObservations.map(o => `- ${o}`).join('\n')}

## Inferred Internal Mechanisms
${discovery.analysis.inferredInternals.map(i => `- ${i}`).join('\n')}

## Identified Components (${discovery.analysis.components.length})
${discovery.analysis.components
  .map(
    c =>
      `### ${c.name} (${c.category.toUpperCase()})
- Purpose: ${c.purpose}
- How It Works (Beginner): ${c.howItWorks.beginner}
- How It Works (Technical): ${c.howItWorks.technical}
- Failure Symptoms: ${c.failureSymptoms.join(', ')}`
  )
  .join('\n\n')}

## Mechanical & Scientific Principles
${discovery.analysis.mechanicalPrinciples
  .map(p => `### ${p.title}\n${p.summary}\nLaw: ${p.scientificLaw}\nApplication: ${p.practicalApplication}`)
  .join('\n\n')}

## What If? Inventions (${discovery.hypotheses?.length || 0})
${(discovery.hypotheses || [])
  .map(
    h =>
      `### ${h.conceptTitle}
Target: ${h.targetComponent}
Prompt: ${h.prompt}
${h.overview}
Notice: ${h.speculativeNotice}`
  )
  .join('\n\n')}
`;

    const blob = new Blob([report], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reality-layers-${discovery.objectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] max-w-lg mx-auto p-3 overflow-y-auto space-y-3">
      {/* Header Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-left">
        <div className="flex items-center space-x-2 text-cyan-400 text-[10px] font-mono-tech uppercase font-bold mb-1">
          <Bookmark className="w-4 h-4 text-cyan-400" />
          <span>LOCAL DISCOVERY ARCHIVE</span>
        </div>
        <h2 className="text-base font-extrabold text-slate-100 font-sans">
          Saved Systems & Inventions ({discoveries.length})
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Access your physical dissection logs, follow-up chats, and What If? inventions.
        </p>
      </div>

      {/* Empty State */}
      {discoveries.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
            <Bookmark className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-bold text-slate-300 font-mono-tech uppercase">
            NO DISCOVERIES SAVED YET
          </h4>
          <p className="text-xs text-slate-400 max-w-xs">
            Photograph a physical object, examine its components in Deep Dive, or run an invention in the What If? Lab to save it here.
          </p>
          <button
            onClick={onExploreNew}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs font-mono-tech uppercase tracking-wider flex items-center space-x-2 shadow-[0_0_15px_rgba(0,240,255,0.3)] active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>EXPLORE SOMETHING</span>
          </button>
        </div>
      ) : (
        /* Saved Discoveries List */
        <div className="space-y-3">
          {discoveries.map(item => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all text-left space-y-3 shadow-md"
            >
              {/* Top Row: Thumbnail + Info */}
              <div
                className="flex items-start space-x-3 cursor-pointer group"
                onClick={() => onSelectDiscovery(item)}
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.objectName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5 text-[10px] font-mono-tech text-cyan-400 uppercase">
                    <span>{item.analysis.category}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1 text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 truncate font-sans group-hover:text-cyan-300 transition-colors">
                    {item.objectName}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1 text-[11px] font-mono-tech text-slate-400">
                    <span className="flex items-center space-x-1 text-cyan-300">
                      <Layers className="w-3 h-3" />
                      <span>{item.analysis.components.length} components</span>
                    </span>
                    {item.hypotheses && item.hypotheses.length > 0 && (
                      <span className="flex items-center space-x-1 text-violet-300">
                        <FlaskConical className="w-3 h-3" />
                        <span>{item.hypotheses.length} inventions</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Open, Export, Delete */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => onSelectDiscovery(item)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono-tech hover:bg-cyan-900/60 active:scale-95 flex items-center space-x-1"
                >
                  <span>Open Deep Dive</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleExportMarkdown(item)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-300 hover:bg-slate-700 active:scale-95"
                    title="Export Markdown Report"
                  >
                    <FileDown className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteDiscovery(item.id)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 active:scale-95"
                    title="Delete saved item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
