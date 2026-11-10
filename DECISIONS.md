# REALITY LAYERS — ARCHITECTURAL & DESIGN DECISIONS

## 1. Client-Server Architecture for AI Calls
- **Decision**: All `@google/genai` SDK operations are executed inside `server.ts` rather than directly in the client bundle.
- **Rationale**: Keeps `GEMINI_API_KEY` secure and unexposed; allows central rate-limiting, error shielding, response parsing, and timeout management.
- **Alternatives Considered**: Direct browser SDK invocation.
- **Rejected Because**: Direct browser invocation exposes API keys in network traffic and client source maps, violating security guidelines.

## 2. Interactive Coordinate Overlay vs. Pure Text
- **Decision**: Gemini is constrained via `responseSchema` to output `{ x: number, y: number }` percentage coordinates (bounded between 10% and 90%) for each identified visible component.
- **Rationale**: Enables interactive pins directly over the user's photograph, transforming a static reading experience into a spatial exploration tool.
- **Alternatives Considered**: Bounding box SVG polygons or Canvas image slicing.
- **Rejected Because**: Point pins with pulse rings are lightweight, scale fluidly across responsive mobile screens (Samsung Galaxy 360px–412px widths), and do not suffer from aspect ratio distortion.

## 3. Graceful Resilience vs. Hard 500 Failures
- **Decision**: When the Gemini API experiences 503 high demand or network timeout, the backend automatically returns a calibrated kinematic reference dataset with an explicit banner (`isFallback: true`, notice: `"Gemini 3.8 Vision is experiencing high cloud demand..."`).
- **Rationale**: Prevents users from getting stuck on a dead screen or seeing raw stack traces. The complete application flow (pins, deep dive, What-If lab, local storage) remains fully testable and functional.
- **Alternatives Considered**: Failing with 500 error and displaying an alert.
- **Rejected Because**: Cloud service spikes are transient; blocking the user completely destroys the experience.

## 4. Dual Explanation Model (Beginner & Technical)
- **Decision**: Every identified component contains both a `beginner` (intuitive analogies) and a `technical` (materials, kinematics, engineering physics) explanation, switchable with a single toggle.
- **Rationale**: Satisfies both curious students/hobbyists and experienced engineers/mechanics without cluttering the screen.

## 5. Explicit Submit Button vs. Silent Auto-Submit
- **Decision**: Keep auto-trigger on capture for speed, but add a prominent, high-contrast, thumb-friendly **`ANALYZE OBJECT (SUBMIT)`** button alongside **`RETAKE`**.
- **Rationale**: Solves user disorientation where captured frames appeared frozen with only a `RETAKE` button. Users retain explicit agency to trigger, retry, or re-shoot.

## 6. Pending Decisions for Future Versions
- **Offline Machine Learning**: Investigate integrating WebAssembly/TensorFlow.js or MediaPipe for local client-side edge detection before calling Gemini.
- **CAD/3D Integration**: Potential Three.js / STL viewer integration when the user explores mechanical components in the What If? Lab.
