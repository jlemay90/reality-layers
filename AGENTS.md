# Reality Layers — agent operating instructions (proposed; review before merging)

## Canonical continuity rule
The reusable App Continuity & Multi-Agent Handoff skill is held in the owner's private repository:
`jlemay90/j-god-agent/.agents/skills/app-continuity/SKILL.md` (v1.0, commit `a983463a153b6215150509b084325b10c1`).
An agent with permission should read it directly; if it cannot access the private source, request its content. Never claim this file auto-installs a skill in any model.

For this application, start by reading PROJECT-OVERVIEW.md, ARCHITECTURE.md, DECISIONS.md, CHANGELOG.md, KNOWN-ISSUES.md, TEST-REPORT.md and AGENT-HANDOFF.md, then inspect actual source and Git refs. Preserve original intent, previous stable *only if verified*, and current work as recoverable Git refs. Use one repository, an agent-specific branch, and a reviewable PR. Do not merge or deploy without owner approval. Update living handoff and change history when making changes.

## 2026-11-09 GitHub inspection (ChatGPT; source-backed; no code changes)
- GitHub repository: https://github.com/jlemay90/reality-layers
- At inspection the GitHub default branch was `main`, HEAD `a4983490cbb23ce5dac56cb8aa070b3db17f4297`, with an earlier initial commit `2f94d289421c4b13b5f58552fb245ae55092dced`.
- GitHub returned **only** `refs/heads/main` from the refs endpoint. The documentation instead claims `master`, tags `ORIGINAL`, `PREVIOUS`, `CURRENT`, and commits `19e1c06` / `2669280`. Those references were **not verified in this remote repo**. They might refer to a local AI Studio repository; do not call them GitHub backups or overwrite the claims without investigating.
- Repository visibility at inspection was **public**, despite the owner's earlier preference for private. Do not commit actual API keys, personal images, sensitive records or credentials. Owner should decide/confirm visibility separately.
- Server source (`server.ts`) on `main` catches failed AI vision analysis and returns `DEMO_OBJECTS[0]` as a fallback, even when the supplied image is not that demo. It sets `isFallback: true`, but the user could still see engine-specific components for a steering-wheel photo. This violates the intent to distinguish observed from simulated content. Recommended *proposal*: for arbitrary-photo failures return a typed analysis-unavailable state with retry/demo choices, never object-specific sample results presented as an analysis of the uploaded image. Test with a non-engine input and unavailable Gemini API.
- Documentation claims mobile-camera and live AI tests passed. Those are reports from the prior agent, **not** independently reproduced in this GitHub-only audit.

## Next agent's minimal safe task
1. Verify HEAD, branches/tags, history and actual build/test state.
2. Reproduce the image-analysis failure path, assess whether fallback is misleading, and propose the smallest robust fix.
3. Preserve the last genuinely tested version before coding. Use a new branch, do not overwrite `main`.
4. Test image upload/camera and fail/retry/demo on actual mobile hardware when available; clearly separate simulated runs.
5. Update canonical project documents and handoff with verified Git SHAs and test evidence.
6. Keep the owner informed and request approval before merging or deployment.

This file is agent guidance only; it is NOT a claim that code has been fixed, versions tagged, ChatGPT native skills installed, or app hardware testing completed.
