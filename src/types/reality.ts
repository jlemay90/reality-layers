/**
 * Reality Layers - Core Domain Types
 */

export interface ComponentCoordinate {
  x: number; // percentage 0-100 from left
  y: number; // percentage 0-100 from top
}

export interface RealityComponent {
  id: string;
  name: string;
  category: 'structural' | 'motion' | 'power' | 'control' | 'fluid' | 'fastener' | 'sensor' | 'interface' | 'thermal';
  position: ComponentCoordinate;
  purpose: string;
  howItWorks: {
    beginner: string;
    technical: string;
  };
  relationship: string;
  failureSymptoms: string[];
  materialOrSpec?: string;
  status: 'visible' | 'inferred';
}

export interface MechanicalPrinciple {
  title: string;
  summary: string;
  scientificLaw: string;
  practicalApplication: string;
}

export interface ComponentInteraction {
  from: string;
  to: string;
  type: 'mechanical' | 'electrical' | 'thermal' | 'fluid' | 'information';
  description: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  objectName: string;
  confidence: number; // 0 to 1
  confidenceLevel: 'high' | 'medium' | 'low';
  category: 'mechanical' | 'electronic' | 'vehicle' | 'optical' | 'industrial' | 'everyday' | 'aerospace';
  summary: string;
  visibleObservations: string[]; // Explicitly visible in the photo
  inferredInternals: string[]; // Hypothesized internal mechanisms
  components: RealityComponent[];
  mechanicalPrinciples: MechanicalPrinciple[];
  interactions: ComponentInteraction[];
  interestingFacts: string[];
  possibleImprovements: string[];
  suggestedQuestions: string[];
  imageUrl: string;
  isDemo?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  relatedComponentId?: string;
}

export interface WhatIfHypothesis {
  id: string;
  timestamp: number;
  prompt: string;
  targetComponent: string;
  conceptTitle: string;
  overview: string;
  mechanicsExplanation: string;
  tradeoffs: {
    pros: string[];
    cons: string[];
    efficiencyImpact: 'significantly higher' | 'moderately higher' | 'neutral' | 'lower';
    durabilityImpact: 'increased' | 'stable' | 'compromised' | 'critical risk';
    complexityImpact: 'simple' | 'moderate' | 'complex' | 'extreme';
  };
  schematicFlow: {
    step: number;
    title: string;
    description: string;
  }[];
  proposedExperiments: {
    title: string;
    procedure: string;
    expectedOutcome: string;
  }[];
  speculativeNotice: string;
}

export interface SavedDiscovery {
  id: string;
  timestamp: number;
  title: string;
  objectName: string;
  imageUrl: string;
  analysis: AnalysisResult;
  chatHistory: ChatMessage[];
  hypotheses: WhatIfHypothesis[];
  notes?: string;
}
