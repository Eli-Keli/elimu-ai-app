# 📘 Elimu AI — Accessible Education Assistant

**Elimu AI** is a modular, accessibility-first learning companion designed to make educational content universally consumable. Built with **Expo** and **React Native**, it empowers learners—especially persons with disabilities (PWDs) by instantly transforming complex study materials into accessible formats: simplified summaries, audio explanations, and visual aids.

> **Vision:** Elimu AI is designed to eventually function as a core micro-service within the **AbiliLife Learn Ecosystem**, providing an adaptive learning layer for the broader [AbiliLife](https://github.com/AbiliLife/AbiliLife-frontend) super-app.

---

## Key Features

*   **Smart Document Processing**
    *   Upload PDFs or images (Lecture notes, textbooks, handouts).
    *   Extract raw text for processing.
*   **Adaptive AI Pipeline** (Current: Scaffolding/Stubs)
    *   **Simplify:** Converts complex academic language into plain, easy-to-understand text.
    *   **Audify:** Generates audio narrations for visual impairment support.
    *   **Visualize:** Creates descriptions for visual learning aids (infographics, timelines).
*   **Accessibility First**
    *   High-contrast UI foundation.
    *   Screen-reader optimized structure.
    *   Planned support for dyslexia-friendly typefaces.
*   **Cross-Platform**
    *   Native performance on iOS and Android via Expo.

---

## 🏗️ Architecture

The project follows a modular, scalable structure separating UI, state, and the internal AI logic.

```text
elimu-ai-app/
├── app/                     # Expo Router Pages
│   ├── _layout.tsx          # Root layout & navigation
│   ├── index.tsx            # Home/Welcome screen
│   ├── upload.tsx           # Document picker interface
│   ├── reader.tsx           # Document viewer & AI trigger
│   ├── results.tsx          # AI output display
│   └── settings.tsx         # Accessibility preferences
├── src/
│   ├── ai/                  # AI Processing Module
│   │   ├── index.ts         # Main orchestrator (processDocument)
│   │   ├── extract/         # Text extraction logic
│   │   │   └── extractText.ts
│   │   ├── adapt/           # Content adaptation logic
│   │   │   ├── simplifyText.ts
│   │   │   ├── audioConvert.ts
│   │   │   └── visualAids.ts
│   │   └── models/          # LLM Integration (Gemini)
│   │       └── gemini.ts
│   ├── components/          # Reusable UI components
│   │   └── Button.tsx
│   └── theme/               # Design system tokens
│       └── colors.ts
└── package.json
```

---

## AI Pipeline

The core of Elimu AI is the `src/ai` module, which orchestrates the transformation of content.

**Current Status:** *Scaffolding & Stubs (v0.1)*

1.  **Orchestration (`src/ai/index.ts`)**
    *   The `processDocument(uri)` function serves as the main entry point.
    *   It manages the flow of data between extraction, adaptation, and generation steps.

2.  **Extraction (`src/ai/extract/`)**
    *   `extractText.ts`: Handles OCR and text parsing from local file URIs.

3.  **Adaptation (`src/ai/adapt/`)**
    *   `simplifyText.ts`: Rewrites content for cognitive accessibility.
    *   `audioConvert.ts`: Prepares text-to-speech synthesis or generates audio file references.
    *   `visualAids.ts`: Generates prompts for diagrams or visual summaries.

4.  **Models (`src/ai/models/`)**
    *   `gemini.ts`: Interface for Google's Gemini 1.5 Flash model (to be integrated).

---

## Tech Stack

*   **Framework:** React Native (Expo Managed Workflow)
*   **Navigation:** Expo Router
*   **Language:** TypeScript
*   **Styling:** StyleSheet (Native) with Themed Constants
*   **AI/LLM:** Google Gemini CLI (Planned integration)

---

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Eli-Keli/elimu-ai-app.git
    cd elimu-ai-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Gemini API (Required for AI features)**
    ```bash
    # Create .env file from template
    cp .env.example .env
    
    # Get your API key from: https://makersuite.google.com/app/apikey
    # Add to .env file:
    EXPO_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
    ```

4.  **Test Gemini Integration (Optional)**
    ```bash
    npx ts-node test-gemini.ts
    ```

5.  **Start the development server**
    ```bash
    npx expo start
    ```

6.  **Run on device**
    *   Download the **Expo Go** app on iOS or Android.
    *   Scan the QR code shown in the terminal.

## 📚 Documentation

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Complete system design and module breakdown
- **[ROADMAP_V0.2.md](docs/ROADMAP_V0.2.md)** - Actionable next steps for v0.2 development
- **[QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md)** - Developer quick reference guide
- **[ANALYSIS_SUMMARY.md](docs/ANALYSIS_SUMMARY.md)** - Project analysis and improvements summary
- **[DEPENDENCIES.md](docs/DEPENDENCIES.md)** - Official packages and documentation links

---

## 🗺️ Roadmap

### Phase A: Foundation (✅ Completed)
*   [x] Project initialization (Expo + TypeScript).
*   [x] Basic navigation routing (Home -> Upload -> Reader).
*   [x] UI scaffolding.

### Phase B: AI Scaffolding (✅ Completed)
*   [x] Define AI module architecture (`src/ai`).
*   [x] Implement production-ready stub functions with types.
*   [x] Add comprehensive error handling and logging.
*   [x] Create TypeScript interfaces for entire pipeline.
*   [x] Upgrade all AI functions with async patterns.
*   [x] Connect reader screen to results with state management.

### Phase C: Intelligence Integration (🚀 In Progress - v0.2)
*   [x] **Phase 1 Complete**: Real Gemini API integration with retry logic
*   [x] Text simplification with Gemini 2.5 Flash
*   [x] Image generation with Gemini Nano Banana
*   [x] Comprehensive error handling and logging
*   [ ] **Phase 2 (Next)**: Implement real text extraction from PDFs with native modules
*   [ ] **Phase 3**: Generate actual simplified summaries end-to-end
*   [ ] **Phase 4**: Add audio generation with expo-speech
*   [ ] **Phase 5**: Complete image generation pipeline
*   [ ] **Phase 6**: Implement save and share functionality
*   [ ] **Phase 7**: Full integration testing
*   [ ] **Phase 8**: Polish and documentation

**See [`docs/ROADMAP_V0.2.md`](docs/ROADMAP_V0.2.md) for detailed implementation plan.**  
**See [`docs/PHASE_1_COMPLETE.md`](docs/PHASE_1_COMPLETE.md) for Phase 1 completion report.**

### Phase D: Ecosystem Integration
*   [ ] Align UI with AbiliLife design system.
*   [ ] Prepare module for integration into AbiliLife Learn.

---

## 🤝 Contributing

We welcome contributions that advance accessible education technology!
Please open an issue to discuss major changes or submit a Pull Request for fixes.

## 📄 License

This project is licensed under the [MIT License](LICENSE).