

# Elimu AI - Accessible Education for All

<p align="center">
      <img src="./assets/splash-icon.png" alt="Elimu AI Logo" width="200" />
</p>

> **Part of the AbiliLife Learn Ecosystem**  
> Making complex educational content accessible for every learner

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Expo SDK 54](https://img.shields.io/badge/Expo-SDK%2054-000020.svg?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini%20API-4285F4.svg?style=flat&logo=google&logoColor=white)](https://ai.google.dev/)

---

## 🌟 VISION

Elimu AI is designed as the **core learning micro-service** for **[AbiliLife](https://github.com/AbiliLife/AbiliLife-frontend)** - an early-stage startup building Africa's first super-app for persons with disabilities (PWDs).

**The AbiliLife Learn Module will empower:**
- Students with learning disabilities
- Visual/hearing impaired learners  
- Anyone who needs content simplified
- Schools serving diverse learning needs

**Elimu AI is the killer product** that makes AbiliLife Learn indispensable - transforming education accessibility across Kenya and beyond.

---

## WHAT IT DOES (5 Second Pitch)

**Upload a PDF or image -> Get simplified text + audio narration + visual aids + study tools**

**Perfect for:**
- Textbooks & lecture notes → Easy-to-understand summaries
- Complex topics → Grade-appropriate explanations (CBC-aligned)
- Reading difficulties → Listen instead of reading
- Visual learners → Diagrams, infographics, timelines
- Exam prep → Interactive flashcards & quizzes

---

## FEATURES (Phase 4 Complete - December 2025)

### A) Core Functionality
- **PDF/Image Upload** - Supports PDF, JPG, PNG, WebP, HEIC (up to 50MB)
- **AI Text Extraction** - Gemini multimodal API with automatic OCR
- **Smart Simplification** - Grade-level targeting (6th-12th grade)
- **Audio Narration** - 100+ system voices, speed control (0.5x-2.0x)
- **Visual Aids** - Auto-generated diagrams, timelines, infographics
- **Kenya CBC Aligned** - 5 sample documents matching national curriculum

### B) User Experience
- **Onboarding Flow** - 3-screen intro for first-time users
- **Splash Screen** - Professional animated intro
- **Display Theme** - Full light/dark theme support
- **Font Controls** - 3 size options (Small/Medium/Large)
- **Sample Documents** - Try without uploading (Biology, Math, History, Chemistry, Geography)
- **Recent History** - Quick access to last 5 processed documents
- **Processing Animation** - Step-by-step progress feedback

### C) Study Tools
- **Interactive Flashcards** - 3D flip animation, swipe navigation
- **Multiple Choice Quizzes** - Instant feedback, score tracking
- **Key Takeaways** - Auto-generated bullet point summaries
- **Save/Share** - Export to Files, Photos, Messages, WhatsApp

### D) Accessibility
- **Voice Filtering** - Filter by language (English / Swahili)
- **High Contrast Mode** - Enhanced readability
- **Adjustable Fonts** - Real-time text scaling
- **Persistent Settings** - Preferences saved across sessions
- **Screen Reader Support** - Accessibility labels throughout

---

## 🏗️ TECH STACK

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React Native + Expo SDK 54 | Cross-platform mobile framework |
| **Language** | TypeScript | Type safety & developer experience |
| **AI/ML** | Google Gemini Pro | Multimodal API (text, images, OCR) |
| **Audio** | Expo Speech | Device TTS (offline, 100+ voices) |
| **State** | React Context API | Theme, font size, language preferences |
| **Storage** | AsyncStorage | User settings, document history |
| **Animation** | React Native Reanimated | 3D flips, smooth transitions |
| **Markdown** | React Native Markdown Display | Rich text formatting |
| **Sharing** | Expo Sharing | System share sheet integration |

**Why This Stack?**
- **Expo** - Cross-platform with hot reload, no Xcode/Android Studio needed for development
- **Gemini AI** - Free tier (60 req/min), multimodal capabilities, OCR built-in
- **Device TTS** - Offline audio, zero API costs, 100+ voices
- **TypeScript** - Catch bugs before runtime, better IDE support

---

## 📚 DOCUMENTATION

### A) For Developers
- **[Architecture Guide](docs/ARCHITECTURE.md)** - System design, patterns, component structure
- **[Quick Reference](docs/QUICK_REFERENCE.md)** - Common commands, APIs, troubleshooting
- **[Dependencies](docs/DEPENDENCIES.md)** - Full package list with official documentation links
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute (Phase 5+)

### B) Implementation History
- **[Phase 1: Gemini API Integration](docs/PHASE_1_COMPLETE.md)** - Nov 2025
- **[Phase 2: PDF/Image Text Extraction](docs/PHASE_2_IMPLEMENTATION.md)** - Dec 2-16, 2025
- **[Phase 3: Audio Playback (TTS)](docs/PHASE_3_IMPLEMENTATION.md)** - Dec 16-18, 2025
- **[Phase 4: UI/UX Polish & Study Tools](docs/PHASE_4_IMPLEMENTATION.md)** - Dec 19-26, 2025 ✅ **CURRENT**
- **[Phase 5: Roadmap & Next Features](docs/PHASE_5_TODO.md)** - Planned for Jan 2026

### C) Feature Guides
- **[Study Tools Guide](docs/STUDY_TOOLS_GUIDE.md)** - How to use flashcards & quizzes
- **[CBC Curriculum Alignment](docs/CBC_ALIGNMENT_SUMMARY.md)** - Kenya education standards

---

## ROADMAP

### ✅ Phase 4 Complete (December 2025)
- Modern UI with onboarding & dark mode
- Interactive study tools (flashcards, quizzes)
- Full accessibility support (font controls, voice filtering)
- Save/share functionality
- **80% feature completion** (16/20 planned features)

### 🎯 Phase 5 (January 2026)
- Personal notes feature (markdown support)
- Study streak tracking (gamification)
- Analytics integration (Firebase)
- App Store / Playstore preparation (screenshots, demo video)
- Accessibility audit (VoiceOver, TalkBack testing)

### 🔮 Phase 6+ (2026)
- Cloud sync across devices
- Collaborative study groups
- AI tutor chat assistant
- OCR camera scanning (live text extraction)
- Multi-language content support (Swahili, French)
- Teacher dashboard (track student progress)
- AbiliLife Learn Integration (super-app ecosystem)

---

## 🌍 ABILILIFE INTEGRATION VISION

Elimu AI will serve as the **adaptive learning engine** within the broader AbiliLife ecosystem:

```
AbiliLife Super App (Vision)
├── AbiliLife Mobility (Accessible Transport)
├── AbiliLife Care (Medical Support & Wellness)
├── AbiliLife Access (Assistive Devices)
├── AbiliLife Work (Employment & Income Generation)
└── AbiliLife Learn (Education & Skills) ⭐
    ├── Elimu AI (Content Accessibility) ← YOU ARE HERE
    ├── Course Library (Video lessons, tutorials)
    ├── Peer Tutoring (Connect with mentors)
    └── Skill Certification (Verified credentials)
```

**Integration Points:**
- Shared user profiles & accessibility preferences
- Cross-module progress tracking
- Unified design system & navigation
- Social features (share notes, study groups)
- Gamification (badges, streaks, leaderboards)

**Why Elimu AI is the Killer Feature:**
- First-to-market in accessible education tech in Kenya
- Solves real pain points for PWDs in education
- Scalable across all AbiliLife Learn content
- Creates network effects (students share simplified content)

---

## PROJECT STATS

- **Development Time:** 2 month (November 2025 - January 2026)
- **Total Commits:** 40+ feature commits
- **Lines of Code:** 10,000+ (app + AI pipeline + docs)
- **Components:** 15 reusable UI components
- **Test Coverage:** Manual testing complete, unit tests planned (Phase 5)
- **Status:** ✅ Production-ready core features

---

## CONTRIBUTING

This is currently a solo project as part of the AbiliLife startup journey. **Contributions welcome after Phase 5!**

**Want to help?**
- Report bugs via [GitHub Issues](https://github.com/yourusername/elimu-ai-app/issues)
- Suggest features or improvements
- Improve documentation (translations, tutorials)
- Add support for your language (Swahili, French, Arabic planned)

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines (coming in Phase 5).

---

## LICENCE

MIT License - See [LICENSE](LICENSE) for details.

**TLDR:** Free to use, modify, and distribute. Attribution appreciated but not required.

---

## ACKNLOWLEDGEMENTS

- **Google Gemini API** - AI-powered multimodal content processing
- **Expo Team** - Amazing React Native framework with great DX
- **React Native Community** - Excellent open-source libraries
- **Kenya CBC** - Curriculum alignment guidance for educational content
- **AbiliLife Community** - Early testers and feedback providers

---

## CONTACTS & LINKS

**Project:** Elimu AI  
**Parent Company:** AbiliLife (Early-Stage Startup)  
**GitHub:** [@Eli-Keli](https://github.com/Eli-Keli)  
**AbiliLife Repo:** [github.com/AbiliLife/AbiliLife-frontend](https://github.com/AbiliLife/AbiliLife-frontend)

**Built with ❤️ for accessible education in Africa**

---

## 🎨 VISUAL IDENTITY

Logo and branding assets coming in Phase 5. See [docs/LOGO_PROMPTS.md](docs/LOGO_PROMPTS.md) for design concepts.

**Brand Colors:**
- Primary: `#5B47ED` (Education Purple)
- Accent: `#FF6B9D` (Warm Pink)
- Success: `#4CAF50` (Green)
- Background: `#F8F9FE` (Soft Blue)

---

<div align="center">
  <sub>Making education accessible, one document at a time.</sub>
</div>
