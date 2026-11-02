# EduBridge Outstanding Issues and Technical Considerations
**Document Version:** 1.0.0  
**Date:** November 2, 2026  
**Author:** Antigravity Engineering & QA Team  
**Scope:** Inventory of Platform Boundaries, External Dependencies, and Future Enhancements

---

## 1. Overview

While all functional workflows, user role permissions, layout adjustments, and UI requirements have been verified and confirmed operational, certain technical constraints stem from external browser APIs, offline sandboxing, and operating system variations.

This document details these items, explains their underlying technical causes, and provides recommended strategic solutions for future milestone releases.

---

## 2. Inventory of Considerations & Outstanding Items

### 2.1. Offline Local Heuristics vs. Cloud LLM Inference
- **Status:** Operational with Graceful Fallback
- **Description:**  
  The EduBridge Question Solver and Interactive Digital Classroom support both live Cloud AI providers (Google Gemini API, OpenAI GPT, Anthropic Claude) and local mock heuristics. When deployed in strictly offline or air-gapped environments without an active Internet connection or a local Ollama daemon, the platform automatically falls back to deterministic curriculum knowledge bases.
- **Underlying Cause:**  
  Advanced natural language understanding and multi-step math problem derivation benefit from large language models that require either network connectivity to LLM APIs or substantial local GPU/VRAM hardware to execute local quantized weights.
- **Recommended Solution:**  
  For future releases targeting completely offline institutional deployments, package a lightweight client-side WebAssembly inference engine (e.g., **Transformers.js** with ONNX runtime or **WebLLM** using WebGPU) to execute compact 1B–3B parameter models directly within the browser without external network requests.

---

### 2.2. Cross-Platform Web Speech API Voice Variations
- **Status:** Operational with Platform-Dependent Timbre
- **Description:**  
  The audio listening feature utilizes the standard browser `window.speechSynthesis` (Web Speech API). While audio playback functions cleanly without errors across all modern browsers, the quality, naturalness, and accent of the synthesizer depend on the operating system installed voices (e.g., macOS *Samantha/Alex*, Windows *David/Mark*, iOS *Siri Voice*, Android/Linux default voices).
- **Underlying Cause:**  
  Browsers delegate speech synthesis directly to the host operating system's native TTS subsystem.
- **Recommended Solution:**  
  Introduce an optional toggle in User Preferences allowing users to choose between native OS Web Speech (instant, zero network cost, low latency) and an optional neural cloud voice API (such as Google Cloud Text-to-Speech or ElevenLabs) for institutions requiring consistent studio-grade educational voice narration.

---

### 2.3. Microphone Audio Input in Sandboxed or Headless Environments
- **Status:** Handled via Graceful Fallback
- **Description:**  
  When testing audio speech recognition in headless automated browser runs or in virtualized sandboxes lacking physical audio capture devices, the browser returns a `not-allowed` or `service-not-allowed` exception for `webkitSpeechRecognition`.
- **Underlying Cause:**  
  The browser security sandbox requires explicit user gestures and physical hardware audio devices to grant microphone access.
- **Recommended Solution:**  
  EduBridge already implements an automatic fallback to manual text input when speech recognition is unavailable. Continue to display clear permission troubleshooting prompts if a user clicks the microphone button in an unsupported or permission-blocked browser context.

---

### 2.4. Cross-Tab Session State Synchronization
- **Status:** Operational
- **Description:**  
  Active sessions and role switching are managed via reactive application state backed by `StorageService` (`localStorage['edubridge_active_user_id_v1']`). If an administrator opens multiple tabs and switches between `Admin` in Tab 1 and `Student` in Tab 2, both tabs will reflect the newly selected active user upon page refresh or storage event dispatch.
- **Underlying Cause:**  
  Local storage is scoped per browser origin rather than per browser tab.
- **Recommended Solution:**  
  For environments where administrators frequently evaluate multiple roles concurrently in side-by-side tabs, support an optional `sessionStorage` mode or tab-specific session tokens so each tab can maintain an isolated role identity.

---

## 3. Summary of Resolution Roadmap

| Priority | Item | Recommended Action | Target Phase |
| :---: | :--- | :--- | :--- |
| **Low** | WebLLM In-Browser Inference | Integrate WebGPU-accelerated local models for complete air-gapped zero-cloud operation. | Phase 3 (Offline Enterprise) |
| **Medium** | Neural Voice Synthesis | Provide optional neural TTS provider integration for standardized voice timbre. | Phase 2.5 (Accessibility Expansion) |
| **Low** | Isolated Multi-Tab Sessions | Enable optional tab-isolated session storage for rapid multi-role testing. | Phase 2.5 (Developer Tooling) |
| **Low** | Microphone Hardware Diagnostics | Add pre-flight audio input diagnostics modal before initiating voice exam speaking sections. | Phase 2.5 (Exam Suite) |

