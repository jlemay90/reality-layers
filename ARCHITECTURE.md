# REALITY LAYERS — ARCHITECTURE DOCUMENTATION

## 1. Framework & Technologies
- **Client Frontend**: React 19 (TypeScript, Hooks, functional components), Vite 8.
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` and `@import "tailwindcss";` in `src/index.css`. Custom HUD grids, animations, and typography (`JetBrains Mono` + `Plus Jakarta Sans`).
- **Icons**: `lucide-react` (clean, technical stroke iconography).
- **Animation**: CSS keyframe scanlines and motion indicators (`motion` library available).
- **Backend Server**: Full-stack Node.js Express server (`server.ts`) running with TypeScript via `tsx`. Vite middleware is mounted in development; static production assets served from `dist`.
- **Multimodal AI**: `@google/genai` TypeScript SDK (server-side only, model `gemini-3.8-flash`).

## 2. Project Structure
```text
/
├── index.html                      # HTML entry with viewport, SEO meta, webfonts
├── metadata.json                   # AI Studio applet capabilities and permissions
├── package.json                    # Dependencies, dev/start scripts
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite config with React and Tailwind plugins
├── server.ts                       # Express backend proxy with Gemini vision & chat
├── src/
│   ├── main.tsx                    # React client entry point
│   ├── App.tsx                     # Main state orchestrator & top-level view router
│   ├── index.css                   # Global Tailwind imports & HUD scanner keyframes
│   ├── types/
│   │   └── reality.ts              # Domain types (AnalysisResult, Component, WhatIf, etc.)
│   ├── data/
│   │   └── demoObjects.ts          # Curated offline reference models (Engine, Watch)
│   ├── utils/
│   │   └── storage.ts              # LocalStorage repository for discoveries
│   └── components/
│       ├── Header.tsx              # Top HUD telemetry and discoveries count
│       ├── BottomNav.tsx           # Mobile-first 4-tab navigation (Samsung optimized)
│       ├── HomeScreen.tsx          # First-use landing screen & headline
│       ├── ExploreCamera.tsx       # Viewfinder, file upload, scanner HUD & Submit bar
│       ├── DeepDiveView.tsx        # Interactive marker pins, dual explanations, Q&A
│       ├── WhatIfLabView.tsx       # Invention studio, tradeoff matrix, test plans
│       └── DiscoveriesView.tsx     # Saved archive, JSON/Markdown export, manager
└── [DOCUMENTATION]
    ├── PROJECT-OVERVIEW.md
    ├── ARCHITECTURE.md
    ├── CHANGELOG.md
    ├── DECISIONS.md
    ├── KNOWN-ISSUES.md
    ├── AGENT-HANDOFF.md
    └── TEST-REPORT.md
```

## 3. Data Flow
1. **Acquisition**: User takes photo via camera viewfinder (`canvas.toDataURL`) or uploads image file (`FileReader.readAsDataURL`).
2. **Preview & Confirmation**: User reviews photo. A prominent **`ANALYZE OBJECT (SUBMIT)`** button allows triggering analysis or retaking.
3. **Multimodal API Request**: Client POSTs `{ imageBase64, mimeType }` to `/api/analyze-reality`.
4. **Backend Ingestion & Cleansing**: `server.ts` safely extracts the raw base64 string, validates the effective MIME type, and constructs the inline data payload.
5. **AI Reasoning**: Gemini 3.8 Flash evaluates the image under a strict engineering schema (`responseSchema`), returning structured JSON with coordinates, dual explanations, and failure symptoms.
6. **Resilience & Timeout Handling**: Wrapped in `withTimeout(..., 15000)`. If Gemini is unavailable (503) or times out, calibrated baseline layers are returned with a status banner.
7. **Exploration**: State transitions to `DeepDiveView`, rendering pins over the image at `x, y` percentages.
8. **Follow-Up & Invention**: User asks questions (`/api/chat-reality`) or pushes components to `/api/what-if-experiment`.
9. **Persistence**: Discoveries, chats, and hypotheses are saved to `localStorage` under `reality_layers_discoveries_v1`.

## 4. AI Integrations
- **Model**: `gemini-3.8-flash` (via modern `@google/genai` SDK).
- **Telemetry**: Required `User-Agent: aistudio-build` header applied in `httpOptions`.
- **System Instructions**:
  - Enforce strict separation between visible observations and inferred internal components.
  - Require both beginner-friendly analogies and technical engineering specifications.
  - Require realistic coordinates between 10% and 90% for pin overlay.
  - Propose physical validation experiments rather than claiming simulated certainty.

## 5. Security & Privacy Considerations
- **Zero Client-Side Secrets**: `GEMINI_API_KEY` is accessed solely via `process.env.GEMINI_API_KEY` on the Node.js backend.
- **Camera Permissions**: Declared in `metadata.json` (`"requestFramePermissions": ["camera"]`). Gracefully handles denial or iframe blocking by presenting image upload.
- **Local Isolation**: Discoveries are stored in the user's browser `localStorage` without third-party analytics or external telemetry.
