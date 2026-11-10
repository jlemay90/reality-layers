import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Info,
  CheckCircle,
  AlertTriangle,
  Send,
  MessageSquare,
  FlaskConical,
  Bookmark,
  Share2,
  ChevronRight,
  Maximize2,
  Minimize2,
  ExternalLink,
  BookOpen,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import {
  AnalysisResult,
  RealityComponent,
  ChatMessage,
} from '../types/reality';

interface DeepDiveViewProps {
  analysis: AnalysisResult;
  onSendToWhatIf: (componentName: string) => void;
  onSaveDiscovery: () => void;
  isSaved: boolean;
}

export const DeepDiveView: React.FC<DeepDiveViewProps> = ({
  analysis,
  onSendToWhatIf,
  onSaveDiscovery,
  isSaved,
}) => {
  // State
  const [selectedComponentId, setSelectedComponentId] = useState<string>(
    analysis.components[0]?.id || ''
  );
  const [explanationMode, setExplanationMode] = useState<'beginner' | 'technical'>('beginner');
  const [activeTab, setActiveTab] = useState<'components' | 'principles' | 'interactions' | 'chat'>('components');
  const [markerFilter, setMarkerFilter] = useState<'all' | 'visible' | 'inferred'>('all');

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `I've mapped the mechanical layers of this **${analysis.objectName}**. Tap any component pin or choose a question below to explore its physical engineering.`,
      timestamp: Date.now(),
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState<string>('');
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);

  const selectedComponent =
    analysis.components.find(c => c.id === selectedComponentId) ||
    analysis.components[0];

  // Filtered markers based on toggle
  const displayedComponents = analysis.components.filter(c => {
    if (markerFilter === 'visible') return c.status === 'visible';
    if (markerFilter === 'inferred') return c.status === 'inferred';
    return true;
  });

  // Handle asking chat question
  const handleAskQuestion = async (questionText: string) => {
    if (!questionText.trim()) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: questionText,
      timestamp: Date.now(),
      relatedComponentId: selectedComponent?.id,
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setIsSendingChat(true);

    try {
      const response = await fetch('/api/chat-reality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuestion: questionText,
          messages: [...chatMessages, userMsg],
          context: {
            objectName: analysis.objectName,
            category: analysis.category,
            components: analysis.components,
            mechanicalPrinciples: analysis.mechanicalPrinciples,
            visibleObservations: analysis.visibleObservations,
          },
        }),
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: 'assistant-' + Date.now(),
        role: 'assistant',
        content: data.reply || 'No response received from reality model.',
        timestamp: Date.now(),
      };
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setChatMessages(prev => [
        ...prev,
        {
          id: 'error-' + Date.now(),
          role: 'assistant',
          content: 'Unable to connect to reality engine. Check network connection.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsSendingChat(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] max-w-lg mx-auto pb-4 overflow-y-auto">
      {/* Top Banner: Object Identification & Confidence Header */}
      <div className="px-3 pt-2">
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-[0_0_20px_rgba(0,240,255,0.08)]">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-1.5 mb-0.5">
                <span className="text-[10px] font-mono-tech uppercase tracking-wider text-cyan-400 font-bold">
                  IDENTIFIED PHYSICAL SYSTEM
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono-tech ${
                    analysis.confidenceLevel === 'high'
                      ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                      : 'bg-amber-950 border border-amber-500/40 text-amber-300'
                  }`}
                >
                  {Math.round(analysis.confidence * 100)}% CONFIDENCE ({analysis.confidenceLevel.toUpperCase()})
                </span>
              </div>
              <h2 className="text-base font-extrabold text-slate-100 font-sans tracking-tight">
                {analysis.objectName}
              </h2>
            </div>

            {/* Save discovery button */}
            <button
              onClick={onSaveDiscovery}
              className={`p-2 rounded-xl border transition-all active:scale-95 ${
                isSaved
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-cyan-400'
              }`}
              title={isSaved ? 'Discovery saved' : 'Save discovery to library'}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
          </div>

          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            {analysis.summary}
          </p>

          {/* Uncertainty notice */}
          {analysis.confidenceLevel !== 'high' && (
            <div className="mt-2 text-[10px] text-amber-300/90 font-mono-tech flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
              <span>
                Object identification carries uncertainty. Internal mechanisms are inferred hypotheses.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Photo Viewer with Component Markers */}
      <div className="px-3 mt-3">
        <div className="relative w-full rounded-2xl overflow-hidden aspect-[16/10] bg-slate-950 border border-cyan-500/40 shadow-inner group">
          {/* Hologram Corner Accents */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400 z-20 pointer-events-none"></div>
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400 z-20 pointer-events-none"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400 z-20 pointer-events-none"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400 z-20 pointer-events-none"></div>

          {/* Object Image */}
          <img
            src={analysis.imageUrl}
            alt={analysis.objectName}
            className="w-full h-full object-cover"
          />

          {/* Interactive Marker Pins */}
          {displayedComponents.map((comp, idx) => {
            const isSelected = comp.id === selectedComponentId;
            const x = Math.min(Math.max(comp.position?.x ?? 50, 8), 92);
            const y = Math.min(Math.max(comp.position?.y ?? 50, 8), 92);

            return (
              <div
                key={comp.id}
                style={{ left: `${x}%`, top: `${y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
                onClick={() => {
                  setSelectedComponentId(comp.id);
                  setActiveTab('components');
                }}
              >
                {/* Marker Pulse Ring */}
                {isSelected && (
                  <div className="absolute inset-0 -m-2 rounded-full border-2 border-cyan-400 animate-pulse-ring pointer-events-none"></div>
                )}

                {/* Marker Target Pin */}
                <button
                  className={`relative flex items-center justify-center w-7 h-7 rounded-full font-mono-tech text-[10px] font-bold shadow-lg transition-transform active:scale-90 ${
                    isSelected
                      ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-400/30 scale-110 shadow-[0_0_15px_#00f0ff]'
                      : comp.status === 'inferred'
                      ? 'bg-violet-900/90 text-violet-200 border border-violet-400/60'
                      : 'bg-slate-900/90 text-cyan-300 border border-cyan-400/60 hover:bg-cyan-900/80'
                  }`}
                >
                  <span>{idx + 1}</span>
                </button>

                {/* Micro Label Bubble */}
                {isSelected && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-slate-950/95 border border-cyan-400 text-[9px] font-mono-tech text-cyan-300 shadow-xl pointer-events-none">
                    {comp.name}
                  </div>
                )}
              </div>
            );
          })}

          {/* Overlay Filter Pills */}
          <div className="absolute bottom-2 left-2 z-20 flex space-x-1">
            <button
              onClick={() => setMarkerFilter('all')}
              className={`px-2 py-0.5 rounded-full text-[9px] font-mono-tech transition-colors ${
                markerFilter === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-950/80 text-slate-300 border border-slate-700'
              }`}
            >
              ALL ({analysis.components.length})
            </button>
            <button
              onClick={() => setMarkerFilter('visible')}
              className={`px-2 py-0.5 rounded-full text-[9px] font-mono-tech transition-colors ${
                markerFilter === 'visible'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-950/80 text-slate-300 border border-slate-700'
              }`}
            >
              VISIBLE
            </button>
            <button
              onClick={() => setMarkerFilter('inferred')}
              className={`px-2 py-0.5 rounded-full text-[9px] font-mono-tech transition-colors ${
                markerFilter === 'inferred'
                  ? 'bg-violet-600 text-white font-bold'
                  : 'bg-slate-950/80 text-slate-300 border border-slate-700'
              }`}
            >
              INFERRED
            </button>
          </div>
        </div>
      </div>

      {/* Observation vs Inference Diagnostic Disclosure */}
      <div className="px-3 mt-2.5">
        <div className="grid grid-cols-2 gap-2 text-left">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-cyan-500/20">
            <div className="flex items-center space-x-1 text-cyan-400 text-[10px] font-mono-tech uppercase font-bold mb-1">
              <CheckCircle className="w-3 h-3" />
              <span>Visible Facts ({analysis.visibleObservations?.length || 0})</span>
            </div>
            <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
              {analysis.visibleObservations?.slice(0, 2).map((obs, i) => (
                <li key={i} className="line-clamp-2 leading-tight">
                  {obs}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-violet-500/20">
            <div className="flex items-center space-x-1 text-violet-400 text-[10px] font-mono-tech uppercase font-bold mb-1">
              <Layers className="w-3 h-3" />
              <span>Inferred Internals ({analysis.inferredInternals?.length || 0})</span>
            </div>
            <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
              {analysis.inferredInternals?.slice(0, 2).map((inf, i) => (
                <li key={i} className="line-clamp-2 leading-tight">
                  {inf}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Deep Dive Sub-Navigation Tabs */}
      <div className="px-3 mt-3">
        <div className="flex rounded-xl bg-slate-900/90 border border-slate-800 p-1">
          <button
            onClick={() => setActiveTab('components')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-mono-tech tracking-wider uppercase transition-colors ${
              activeTab === 'components'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            PARTS ({analysis.components.length})
          </button>
          <button
            onClick={() => setActiveTab('principles')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-mono-tech tracking-wider uppercase transition-colors ${
              activeTab === 'principles'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            PHYSICS
          </button>
          <button
            onClick={() => setActiveTab('interactions')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-mono-tech tracking-wider uppercase transition-colors ${
              activeTab === 'interactions'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            FLOW
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-mono-tech tracking-wider uppercase transition-colors flex items-center justify-center space-x-1 ${
              activeTab === 'chat'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>ASK AI</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Component Inspector */}
      {activeTab === 'components' && selectedComponent && (
        <div className="px-3 mt-3 space-y-3">
          {/* Component Selection Pills Carousel */}
          <div className="flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
            {analysis.components.map((comp, idx) => {
              const isSelected = comp.id === selectedComponentId;
              return (
                <button
                  key={comp.id}
                  onClick={() => setSelectedComponentId(comp.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono-tech whitespace-nowrap transition-all border active:scale-95 flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-slate-800 border border-slate-600 text-[10px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span>{comp.name}</span>
                </button>
              );
            })}
          </div>

          {/* Component Detail Card */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-left space-y-3 shadow-lg">
            {/* Header: Name, Category, Status Badge */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-[10px] font-mono-tech text-cyan-300 uppercase">
                    {selectedComponent.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase ${
                      selectedComponent.status === 'visible'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : 'bg-violet-950 text-violet-300 border border-violet-500/30'
                    }`}
                  >
                    {selectedComponent.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-100 font-sans">
                  {selectedComponent.name}
                </h3>
              </div>

              {/* Take to What-If Lab button */}
              <button
                onClick={() => onSendToWhatIf(selectedComponent.name)}
                className="px-2.5 py-1.5 rounded-xl bg-violet-950/80 border border-violet-500/40 text-violet-300 hover:bg-violet-900/80 text-[11px] font-mono-tech transition-all active:scale-95 flex items-center space-x-1"
                title="Propose modification in What If? Lab"
              >
                <FlaskConical className="w-3.5 h-3.5 text-violet-400" />
                <span>Reimagine</span>
              </button>
            </div>

            {/* Purpose */}
            <div>
              <h4 className="text-[10px] font-mono-tech uppercase text-cyan-400 tracking-wider font-bold mb-0.5">
                PRIMARY PURPOSE
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                {selectedComponent.purpose}
              </p>
            </div>

            {/* Beginner vs Technical Explanation Toggle */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono-tech uppercase text-slate-400 font-bold">
                  HOW IT WORKS
                </span>
                <div className="flex rounded-lg bg-slate-900 border border-slate-700 p-0.5">
                  <button
                    onClick={() => setExplanationMode('beginner')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono-tech transition-colors ${
                      explanationMode === 'beginner'
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Beginner
                  </button>
                  <button
                    onClick={() => setExplanationMode('technical')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono-tech transition-colors ${
                      explanationMode === 'technical'
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Technical
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {explanationMode === 'beginner'
                  ? selectedComponent.howItWorks.beginner
                  : selectedComponent.howItWorks.technical}
              </p>
            </div>

            {/* Relationship */}
            <div>
              <h4 className="text-[10px] font-mono-tech uppercase text-cyan-400 tracking-wider font-bold mb-0.5">
                SYSTEM RELATIONSHIP
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedComponent.relationship}
              </p>
            </div>

            {/* Failure Symptoms */}
            {selectedComponent.failureSymptoms && selectedComponent.failureSymptoms.length > 0 && (
              <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/20">
                <h4 className="text-[10px] font-mono-tech uppercase text-rose-400 tracking-wider font-bold mb-1 flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  <span>COMMON FAILURE MODES & WEAR SYMPTOMS</span>
                </h4>
                <ul className="text-xs text-rose-200/90 space-y-1 list-disc list-inside">
                  {selectedComponent.failureSymptoms.map((symptom, i) => (
                    <li key={i}>{symptom}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Ask Gemini Question about this Component */}
            <div className="pt-1 flex items-center justify-between border-t border-slate-800">
              <span className="text-[10px] font-mono-tech text-slate-400">
                Curious about this part?
              </span>
              <button
                onClick={() => {
                  setActiveTab('chat');
                  handleAskQuestion(`How exactly does the ${selectedComponent.name} work, and what happens when it wears out?`);
                }}
                className="text-[11px] font-mono-tech text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
              >
                <span>Ask AI about {selectedComponent.name.split(' ')[0]}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Underlying Principles */}
      {activeTab === 'principles' && (
        <div className="px-3 mt-3 space-y-3 text-left">
          <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30">
            <h3 className="text-xs font-mono-tech uppercase text-cyan-300 font-bold mb-1">
              PHYSICAL LAWS & MECHANICS
            </h3>
            <p className="text-xs text-slate-300">
              The foundational physics, thermodynamics, and kinematics making this system operate.
            </p>
          </div>

          {analysis.mechanicalPrinciples.map((principle, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2"
            >
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 text-[11px] font-mono-tech text-cyan-300 flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <h4 className="text-sm font-bold text-slate-100 font-sans">
                  {principle.title}
                </h4>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {principle.summary}
              </p>

              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px]">
                <span className="font-mono-tech text-cyan-400 font-semibold uppercase">
                  Scientific Law:{' '}
                </span>
                <span className="text-slate-300">{principle.scientificLaw}</span>
              </div>

              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px]">
                <span className="font-mono-tech text-violet-400 font-semibold uppercase">
                  Practical Application:{' '}
                </span>
                <span className="text-slate-300">{principle.practicalApplication}</span>
              </div>
            </div>
          ))}

          {/* Interesting Facts */}
          {analysis.interestingFacts && analysis.interestingFacts.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/20">
              <h4 className="text-xs font-mono-tech uppercase text-cyan-400 font-bold mb-2 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>INTERESTING ENGINEERING FACTS</span>
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                {analysis.interestingFacts.map((fact, i) => (
                  <li key={i}>{fact}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Component Interactions Flow */}
      {activeTab === 'interactions' && (
        <div className="px-3 mt-3 space-y-3 text-left">
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <h3 className="text-xs font-mono-tech uppercase text-cyan-300 font-bold mb-1">
              KINEMATIC & ENERGY TRANSFER FLOW
            </h3>
            <p className="text-xs text-slate-400">
              How motion, forces, fluids, and heat propagate through connected components.
            </p>
          </div>

          <div className="space-y-2">
            {analysis.interactions.map((interaction, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center space-x-2 text-xs font-mono-tech">
                  <span className="text-cyan-300 font-semibold">{interaction.from}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-violet-300 font-semibold">{interaction.to}</span>
                  <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 uppercase">
                    {interaction.type}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {interaction.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Conversational AI Follow-up Panel */}
      {activeTab === 'chat' && (
        <div className="px-3 mt-3 flex flex-col h-[400px]">
          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto space-y-2.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 mb-2">
            {chatMessages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-950/80 border border-cyan-500/30 text-slate-200 rounded-tl-none font-sans'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                <span className="text-[9px] text-slate-500 font-mono-tech mt-0.5 px-1">
                  {msg.role === 'user' ? 'You' : 'Reality Engine'}
                </span>
              </div>
            ))}

            {isSendingChat && (
              <div className="flex items-center space-x-2 text-xs text-cyan-400 font-mono-tech p-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
                <span>Gemini 3.8 physical reasoning in progress...</span>
              </div>
            )}
          </div>

          {/* Suggested Questions Chips */}
          {analysis.suggestedQuestions && analysis.suggestedQuestions.length > 0 && (
            <div className="mb-2">
              <span className="text-[9px] font-mono-tech text-slate-400 uppercase mb-1 block">
                SUGGESTED INQUIRIES:
              </span>
              <div className="flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
                {analysis.suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAskQuestion(q)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-[10px] font-mono-tech text-cyan-300 whitespace-nowrap active:scale-95 text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input Bar */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputQuestion}
              onChange={e => setInputQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAskQuestion(inputQuestion)}
              placeholder="Ask anything about how this machine works..."
              className="flex-1 px-3 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-slate-100 placeholder-slate-500 font-mono-tech focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={() => handleAskQuestion(inputQuestion)}
              disabled={isSendingChat || !inputQuestion.trim()}
              className="p-2.5 rounded-xl bg-cyan-500 text-slate-950 disabled:opacity-50 active:scale-95 transition-all shadow-[0_0_10px_rgba(0,240,255,0.3)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
