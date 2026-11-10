# REALITY LAYERS — KNOWN ISSUES & LIMITATIONS

## 1. Upstream Gemini API Spikes (HTTP 503 / High Demand)
- **Status**: Mitigated via resilient fallback & timeout in v1.1.0.
- **Severity**: Low (Gracefully handled).
- **Description**: Google Gemini `gemini-3.8-flash` occasionally returns `503 UNAVAILABLE` during global traffic spikes.
- **Mitigation/Workaround**:
  - `server.ts` automatically retries once after 800ms.
  - If still unavailable or timed out after 15 seconds, returns a calibrated kinematic reference dataset with an explicit banner (`isFallback: true`).
  - Users also have the built-in demo engine accessible at any time.

## 2. In-App Browser Camera Permission (iFrame / WebView Sandbox)
- **Status**: Mitigated via file upload alternative.
- **Severity**: Low.
- **Description**: When running inside sandboxed iframes or restricted webviews without explicit `allow="camera"` attributes, `navigator.mediaDevices.getUserMedia` may throw `NotAllowedError`.
- **Mitigation/Workaround**: The app automatically catches this and displays the `SELECT IMAGE FILE` option, allowing users to take a photo using their mobile OS native camera or select a photo from gallery.

## 3. Very Large Image Payloads (>20MB)
- **Status**: Monitored.
- **Severity**: Low.
- **Description**: Smartphone cameras taking raw 108MP photos can produce huge base64 strings if not downsampled.
- **Mitigation/Workaround**:
  - Client-side canvas capture compresses frames to JPEG quality 0.88.
  - Express server body limit is configured to `50mb`.
  - Future improvement: Add client-side canvas downsampling for raw file uploads before sending to backend.

## 4. Speculative Nature of What-If Lab
- **Status**: By Design / Disclosed.
- **Severity**: Informational.
- **Description**: The What If? Lab provides conceptual engineering hypotheses and proposed experiments, not certified FEA/CFD stress calculations.
- **Mitigation/Workaround**: Prominently labeled with a warning banner: *"Hypothetical conceptual exploration. Real implementation requires detailed physical CAD modeling and validated FEA/CFD simulation."*
