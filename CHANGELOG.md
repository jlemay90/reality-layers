# REALITY LAYERS — CHANGELOG

## [1.1.0] - 2026-11-09 (Commit `2669280`, Tag `CURRENT`)

### Fixed
- **Missing Submit/Analyze Button**:
  - Replaced single `RETAKE PHOTO` button with a two-action bar: prominent cyan-glowing `ANALYZE OBJECT (SUBMIT)` primary button and `RETAKE` secondary button.
  - Added target preview indicator (`IMAGE CAPTURED // READY`) so the user clearly knows the photo is ready for analysis.
- **Unreliable Transition & Invisible Scanning State**:
  - Added local analyzing state and multi-step telemetry timer in `ExploreCamera.tsx`.
  - Laser scanline animation, rotating reticle, and sequential status indicators (`Layer 1: Optical Segmentation`, `Layer 2: Kinematic Geometry`, `Layer 3: Gemini Reasoning`) now trigger immediately upon capture or submit.
- **Runtime Error & Endpoint Hanging**:
  - Replaced brittle regex with safe comma-slice base64 parser in `server.ts` to support all MIME types and data URLs with parameters.
  - Implemented `withTimeout(..., 15000)` wrapper around Gemini calls to prevent server hanging when upstream APIs experience network spikes or high latency.
  - Added automatic single retry with 800ms backoff.
  - Added graceful fallback handling: if Gemini API returns 503 (`UNAVAILABLE`), 429 (`RESOURCE_EXHAUSTED`), or timeout, a structured calibrated reference analysis is returned with a transparent status notice rather than an unhandled 500 error.
- **Actionable Error Recovery**:
  - Replaced raw JSON error output in frontend with user-friendly notices featuring `RETRY ANALYSIS` and `TRY DEMO ENGINE` buttons.
- **Git Version Control**:
  - Initialized Git repository with `ORIGINAL`, `PREVIOUS`, and `CURRENT` tags.

### Added
- Permanent project documentation suite: `PROJECT-OVERVIEW.md`, `ARCHITECTURE.md`, `CHANGELOG.md`, `DECISIONS.md`, `KNOWN-ISSUES.md`, `AGENT-HANDOFF.md`, and `TEST-REPORT.md`.

---

## [1.0.0] - 2026-11-09 (Commit `19e1c06`, Tags `ORIGINAL`, `PREVIOUS`)

### Initial Release
- Mobile-first web app with 4 primary tabs: `EXPLORE`, `DEEP DIVE`, `WHAT IF? LAB`, `SAVED`.
- Camera viewfinder with environment/user flip and image file upload.
- Express server proxy with `@google/genai` model `gemini-3.8-flash`.
- Interactive photograph viewer with clickable component markers at percentage coordinates.
- Dual explanation modes: Beginner and Technical.
- What If? Lab invention studio with tradeoffs matrix and test protocols.
- Built-in demonstration models (4-Stroke OHC Engine, Mechanical Automatic Watch).
- Local persistence using browser `localStorage` and Markdown report exporter.
