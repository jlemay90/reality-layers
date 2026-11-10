import React from 'react';
import { Layers, Cpu, Sparkles, Bookmark } from 'lucide-react';

interface HeaderProps {
  hasApiKey: boolean;
  savedCount: number;
  onOpenDiscoveries: () => void;
  onResetHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  hasApiKey,
  savedCount,
  onOpenDiscoveries,
  onResetHome,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0d14]/90 backdrop-blur-md border-b border-cyan-500/20 px-3 py-2.5 transition-all">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* Brand identity */}
        <button
          onClick={onResetHome}
          className="flex items-center space-x-2 text-left group transition-transform active:scale-95"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-400/40 text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.25)]">
            <Layers className="w-4 h-4 text-cyan-400 animate-pulse" />
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-300"></div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-black tracking-widest text-slate-100 font-mono-tech uppercase">
                REALITY<span className="text-cyan-400">LAYERS</span>
              </span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono-tech">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono-tech tracking-tight">
              MULTIMODAL DISCOVERY LAB
            </p>
          </div>
        </button>

        {/* Status & Saved Counter */}
        <div className="flex items-center space-x-2">
          {/* Status badge */}
          <div className="hidden sm:flex items-center space-x-1 px-2 py-1 rounded-md bg-slate-900/80 border border-slate-700/50 text-[10px] font-mono-tech">
            {hasApiKey ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-emerald-400">GEMINI 3.8 VISION</span>
              </>
            ) : (
              <>
                <Cpu className="w-3 h-3 text-cyan-400" />
                <span className="text-cyan-300">DEMO LAB MODE</span>
              </>
            )}
          </div>

          {/* Discoveries bookmark button */}
          <button
            onClick={onOpenDiscoveries}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-cyan-500/25 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 transition-colors text-xs font-mono-tech active:scale-95"
            title="View saved discoveries"
          >
            <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-semibold text-cyan-400">
              {savedCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
