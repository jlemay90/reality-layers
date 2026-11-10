# REALITY LAYERS — PROJECT OVERVIEW

## 1. Vision and Purpose
**Reality Layers** transforms an ordinary smartphone camera into an interactive optical window for understanding, exploring, troubleshooting, and reimagining the physical and mechanical world. It fuses an advanced multimodal engineering discovery tool with a speculative inventor's laboratory ("WHAT IF? LAB"), inspiring curiosity by making the physics and kinematics of physical assemblies transparent, tactile, and exciting.

## 2. Intended Users
- **Curious Observers & Learners**: People who want to point their phone at a car engine, watch movement, electric motor, drone, or appliance and immediately understand what each part does.
- **Engineers, Technicians & Mechanics**: Users diagnosing physical assemblies who need rapid component identification, failure symptoms, and kinematic interaction maps.
- **Makers, Inventors & Designers**: Explorers who want to test "what-if" architectural modifications (different cooling, materials, gear ratios, valvetrains) before cutting metal.

## 3. Core Functionality
1. **Explore (Capture & Optical Segmentation)**:
   - Live camera viewfinder with front/back camera switching, optical crosshair HUD reticle, and shutter button.
   - Reliable gallery/file upload alternative.
   - Built-in instant mechanical models (4-Stroke OHC Engine, Automatic Watch Escapement) for zero-setup exploration.
2. **Deep Dive (Interactive Component Dissection)**:
   - Interactive high-resolution photo viewer with clickable component pins placed at relative percentage coordinates.
   - Component Drawer detailing component purpose, dual **Beginner** vs **Technical** explanations, relationships, and common failure modes.
   - Physical principles breakdown (thermodynamic cycles, Hooke's law, harmonic resonance, fluid shear).
   - Component-to-component energy and motion transfer flow diagrams.
   - Conversational AI Q&A for contextual follow-up inquiries.
3. **What If? Lab (Invention Studio)**:
   - Select entire assembly or specific component to propose modifications.
   - Conceptual mechanics reasoning, tradeoffs matrix (pros/cons, efficiency, durability, complexity impact gauges).
   - Step-by-step schematic flows and proposed physical validation test protocols (e.g., thermal quench, laser vibrometry).
   - Clear labeling of speculative hypotheses.
4. **My Discoveries (Local Library)**:
   - Automatically saves dissected systems, chat history, and invention concepts to `localStorage`.
   - Export full Markdown technical inspection reports.

## 4. Important Design Decisions
- **Dark Graphite & HUD Aesthetic**: Dark near-black backgrounds (`#080b12`), electric cyan (`#00f0ff`) and violet accents, monospace metadata typography (`JetBrains Mono`), and sans-serif headers (`Plus Jakarta Sans`).
- **Samsung Android Mobile-First Optimization**: Thumb-friendly bottom navigation bar, minimum 48px touch targets, sticky bottom controls, and safe-area padding.
- **Anti-Hallucination & Scientific Rigor**: Direct photographic evidence is strictly separated from inferred internal parts. Uncertain identification is never stated as established fact.
- **Resilient AI Pipeline**: Server-side proxy protects secrets. Upstream demand spikes (503) or latency issues automatically fallback to calibrated kinematic models so users never encounter dead ends.

## 5. Non-Negotiable Requirements
- Server-side Gemini API calls only (`process.env.GEMINI_API_KEY`). Never expose keys to client bundles.
- No decorative buttons: every button must trigger functional state transitions.
- Must work smoothly in mobile browsers on Samsung Android devices without desktop layout breakage.
- Never present unvalidated physics simulations as certified calculations; speculative designs must be explicitly labeled.

## 6. Current Project Status
- **Current Version**: v1.1.0 (`CURRENT` tag, commit `2669280`).
- **Status**: Stable & Verified. Camera capture, file upload, manual submit, retry mechanisms, deep dive exploration, conversational chat, invention studio, and local persistence are 100% operational.
