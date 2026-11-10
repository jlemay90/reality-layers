import React from 'react';
import { Camera, SearchCheck, FlaskConical, Bookmark } from 'lucide-react';

export type TabType = 'explore' | 'deepdive' | 'whatif' | 'discoveries';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  hasActiveAnalysis: boolean;
  savedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  hasActiveAnalysis,
  savedCount,
}) => {
  const tabs = [
    {
      id: 'explore' as TabType,
      label: 'EXPLORE',
      icon: Camera,
      badge: null,
      description: 'Camera & Scan',
    },
    {
      id: 'deepdive' as TabType,
      label: 'DEEP DIVE',
      icon: SearchCheck,
      badge: hasActiveAnalysis ? 'Active' : null,
      description: 'Components & Physics',
    },
    {
      id: 'whatif' as TabType,
      label: 'WHAT IF? LAB',
      icon: FlaskConical,
      badge: null,
      description: 'Invention Studio',
    },
    {
      id: 'discoveries' as TabType,
      label: 'SAVED',
      icon: Bookmark,
      badge: savedCount > 0 ? String(savedCount) : null,
      description: 'Saved Discoveries',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#080b12]/95 backdrop-blur-lg border-t border-cyan-500/20 pb-[max(env(safe-area-inset-bottom),8px)] pt-1 px-2">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 active:scale-90 ${
                isActive
                  ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent'
              }`}
            >
              {/* Active top neon indicator line */}
              {isActive && (
                <span className="absolute -top-1 w-6 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f0ff]"></span>
              )}

              {/* Icon with potential notification badge */}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-cyan-400 stroke-[2.2]' : 'stroke-[1.7]'
                  }`}
                />
                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-2 text-[9px] px-1 py-0.2 rounded-full font-mono-tech leading-none ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-violet-600 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] mt-1 font-mono-tech tracking-wider uppercase transition-colors ${
                  isActive ? 'font-bold text-cyan-300' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
