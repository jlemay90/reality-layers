import React from 'react';
import { Camera, Sparkles, FlaskConical, ArrowRight, Zap, Eye, Cog, Compass } from 'lucide-react';
import { DEMO_OBJECTS } from '../data/demoObjects';

interface HomeScreenProps {
  onStartExplore: () => void;
  onEnterWhatIf: () => void;
  onLoadDemo: (demoId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartExplore,
  onEnterWhatIf,
  onLoadDemo,
}) => {
  const engineDemo = DEMO_OBJECTS[0];

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-120px)] px-4 py-6 max-w-lg mx-auto text-center hud-grid">
      {/* Reticle Badge */}
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono-tech mb-6 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
        <span>MULTIMODAL PHYSICAL WORLD INTERFACE</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase font-sans mb-3 leading-tight">
        THE WORLD HAS LAYERS.{' '}
        <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-violet-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,240,255,0.3)]">
          UNCOVER THEM.
        </span>
      </h1>

      {/* Supporting Text */}
      <p className="text-sm sm:text-base text-cyan-100/80 font-mono-tech tracking-wide mb-8">
        Point. Discover. Understand. Reimagine.
      </p>

      {/* Hero Visual Card / Interactive Hologram Preview */}
      <div className="w-full relative mb-8 rounded-2xl overflow-hidden border border-cyan-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-4 shadow-[0_0_30px_rgba(0,240,255,0.12)]">
        {/* Hologram Corner Brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>

        {/* Engine cross-section thumbnail preview */}
        <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-950 border border-slate-800 flex items-center justify-center group cursor-pointer"
             onClick={() => onLoadDemo(engineDemo.id)}>
          <img
            src={engineDemo.imageSvg}
            alt="Demo Engine Cross Section"
            className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
          />

          {/* Interactive marker callouts simulation */}
          <div className="absolute top-[20%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-400 text-[10px] font-mono-tech text-cyan-300 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span>Spark Ignition: 25kV</span>
          </div>

          <div className="absolute bottom-[25%] left-[53%] -translate-x-1/2 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-violet-950/90 border border-violet-400 text-[10px] font-mono-tech text-violet-300 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
            <span>Crank Kinematics</span>
          </div>

          {/* Overlay CTA */}
          <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[0.5px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs font-mono-tech flex items-center space-x-1">
              <span>EXPLORE THIS MODEL</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Demonstration quick action bar */}
        <div className="mt-3 flex items-center justify-between text-left">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-mono-tech uppercase text-cyan-400 font-bold">
                BUILT-IN MECHANICAL SYSTEM
              </span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-900/60 text-cyan-300 font-mono-tech">
                READY
              </span>
            </div>
            <p className="text-xs font-medium text-slate-300">
              4-Stroke Overhead Cam Internal Combustion Engine
            </p>
          </div>
          <button
            onClick={() => onLoadDemo(engineDemo.id)}
            className="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono-tech hover:bg-cyan-900/60 active:scale-95 transition-all flex items-center space-x-1"
          >
            <span>Launch</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Action Buttons (Primary & Secondary) */}
      <div className="w-full space-y-3 mb-8">
        {/* Primary Action: EXPLORE SOMETHING */}
        <button
          onClick={onStartExplore}
          className="w-full relative group overflow-hidden py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 text-slate-950 font-bold text-base font-mono-tech tracking-wider uppercase transition-all duration-200 shadow-[0_0_25px_rgba(0,240,255,0.4)] active:scale-95 flex items-center justify-center space-x-2"
        >
          <Camera className="w-5 h-5 text-slate-950 group-hover:scale-110 transition-transform" />
          <span>EXPLORE SOMETHING</span>
          <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Secondary Action: ENTER THE WHAT IF? LAB */}
        <button
          onClick={onEnterWhatIf}
          className="w-full py-3.5 px-6 rounded-xl bg-slate-900/90 border border-violet-500/40 hover:border-violet-400/80 text-violet-300 font-semibold text-sm font-mono-tech tracking-wider uppercase transition-all duration-200 shadow-[0_0_15px_rgba(139,92,246,0.15)] active:scale-95 flex items-center justify-center space-x-2"
        >
          <FlaskConical className="w-4 h-4 text-violet-400" />
          <span>ENTER THE WHAT IF? LAB</span>
        </button>
      </div>

      {/* Core Capability Pillars */}
      <div className="grid grid-cols-3 gap-2 w-full text-left">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <Eye className="w-4 h-4 text-cyan-400 mb-2" />
          <div>
            <h4 className="text-xs font-semibold text-slate-200 font-mono-tech">VISION SCAN</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              Pinpoints components & maps physical coordinates.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <Cog className="w-4 h-4 text-amber-400 mb-2" />
          <div>
            <h4 className="text-xs font-semibold text-slate-200 font-mono-tech">DEEP DIVE</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              Beginner & technical explanations + failure modes.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <Sparkles className="w-4 h-4 text-violet-400 mb-2" />
          <div>
            <h4 className="text-xs font-semibold text-slate-200 font-mono-tech">WHAT IF? LAB</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              Conceptual modifications & tradeoff matrices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
