# Contributing to Elimu AI

Thank you for your interest in contributing to Elimu AI! This project is part of the [AbiliLife](https://github.com/AbiliLife/AbiliLife-frontend) ecosystem and aims to make education accessible for all learners.

---

## CURRENT STATUS

**Project Phase:** Phase 4 Complete (December 2025)  
**Accepting Contributions:** Starting Phase 5 (January 2026)  
**Maintainer:** Solo developer (AbiliLife founder)

---

## WAYS TO CONTRIBUTE

### 1. Report Bugs
Found a bug? Please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Device & OS version

### 2. Suggest Features
Have an idea? We'd love to hear it! Please:
- Check existing issues first
- Explain the use case
- Describe how it helps PWDs or learners
- Consider accessibility implications

### 3. Improve Documentation
Help make our docs clearer:
- Fix typos or unclear explanations
- Add tutorials or guides
- Translate docs to Swahili, or other languages
- Create video walkthroughs

### 4. Add Translations
Help us reach more learners:
- UI text translations
- Sample document translations
- Voice preference defaults for your language

### 5. Test & Provide Feedback
- Test on your device (iOS/Android)
- Try with assistive technologies (VoiceOver, TalkBack)
- Report UX issues or confusion
- Suggest improvements

---

## GETTING STARTED

### Prerequisites
- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (or physical device with Expo Go)
- Google Gemini API key (free tier available)

### Setup Steps
```bash
# 1. Fork the repository
# (Click "Fork" button on GitHub)

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/elimu-ai-app
cd elimu-ai-app

# 3. Install dependencies
npm install

# 4. Create .env file
cp .env.example .env
# Add your EXPO_PUBLIC_GEMINI_API_KEY

# 5. Start development server
npx expo start

# 6. Create a feature branch
git checkout -b feature/your-feature-name
```

---

## DEVELOPMENT GUIDLINES

### A) Code Style
- **TypeScript:** All new code must be TypeScript
- **Formatting:** We use Prettier (run `npm run format`)
- **Linting:** ESLint must pass (run `npm run lint`)
- **Naming:** Use camelCase for variables, PascalCase for components

### B) Component Guidelines
```typescript
// ✅ Good: Typed props, clear names
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  // Implementation
}

// ❌ Bad: Untyped, unclear
export function Btn(props: any) {
  // Implementation
}
```

### C) Accessibility Requirements
Every contribution MUST consider accessibility:
- All interactive elements have accessibility labels
- Color contrast ratio ≥ 4.5:1 (WCAG AA)
- Support for screen readers (VoiceOver, TalkBack)
- Keyboard navigation (where applicable)
- Font scaling respects user preferences

### D) Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):
```bash
feat: add personal notes feature
fix: resolve dark mode toggle bug
docs: update API documentation
refactor: simplify audio playback logic
test: add unit tests for flashcards
chore: update dependencies
```

---

## TESTING

### A) Manual Testing Checklist
Before submitting a PR, test:
- [ ] Works on iOS (simulator or device)
- [ ] Works on Android (emulator or device)
- [ ] Dark mode looks correct
- [ ] All font sizes render properly (Small/Medium/Large)
- [ ] Screen reader announces elements correctly
- [ ] No console errors or warnings
- [ ] Handles errors gracefully (network issues, invalid input)

### B) Unit Tests (Coming in Phase 5)
```bash
npm run test
npm run test:watch
npm run test:coverage
```

---

## SUBMITTING A PULL REQUEST

### A) PR Checklist
- [ ] Code follows style guidelines
- [ ] Commits follow conventional commit format
- [ ] All tests pass
- [ ] Documentation updated (if needed)
- [ ] Accessibility requirements met
- [ ] PR description explains changes clearly
- [ ] Screenshots included (for UI changes)

### B) PR Template
```markdown
## Description
Brief summary of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
How was this tested?

## Screenshots
(If applicable)

## Accessibility
How does this impact accessibility?

## Checklist
- [ ] Code follows guidelines
- [ ] Tests pass
- [ ] Docs updated
```

---

## CODE REVIEW PROCESS

1. **Automated Checks:** CI/CD runs linting, type checking, tests
2. **Maintainer Review:** I'll review within 2-3 days
3. **Feedback:** May request changes or clarifications
4. **Approval:** Once approved, I'll merge the PR
5. **Recognition:** Contributors listed in CONTRIBUTORS.md

---

## LEARNING RESOURCES

### 1. React Native & Expo
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### 2. Accessibility
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Expo Accessibility](https://docs.expo.dev/guides/accessibility/)

### 3. Google Gemini AI
- [Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- [Multimodal Guide](https://ai.google.dev/gemini-api/docs/document-processing)

---

## COMMUNITY GUIDELINES

### Code of Conduct
- Be respectful and inclusive
- Focus on accessibility and user needs
- Welcome beginners and provide helpful feedback
- No harassment, discrimination, or hate speech
- Assume good intentions

### Communication
- **GitHub Issues:** Bug reports, feature requests
- **Discussions:** General questions, ideas
- **Pull Requests:** Code contributions with clear descriptions

---

## CONTRIBUTION TYPES

We value all contributions:

| Type | Examples | Recognition |
|------|----------|-------------|
| Bug Fixes | Fix crashes, UI issues | Listed in release notes |
| Features | New study tools, integrations | Listed in CONTRIBUTORS.md |
| Docs | Guides, translations | Mentioned in docs |
| Testing | Report bugs, test PRs | Thank you in issues |
| Ideas | Feature suggestions | Credited in implementation |

---

## PRIORITY AREAS (Phase 5)

Need help with:
1. **Personal Notes Feature** - Rich text editor integration
2. **Study Streak Tracking** - Gamification logic
3. **Analytics Integration** - Firebase setup
4. **Accessibility Audit** - VoiceOver/TalkBack testing
5. **Translations** - Swahili, French UI text
6. **Performance** - Bundle size optimization
7. **Unit Tests** - Jest test coverage

See [docs/PHASE_5_TODO.md](docs/PHASE_5_TODO.md) for details.

---

## RECOGNITION 

All contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation
- Thanked in commit messages

**Top contributors may be invited to join the AbiliLife Learn team!**

---

## QESTIONS?

- **Technical:** Open a GitHub Discussion
- **Security:** Email muthokaelikeli@gmail.com / abililifekenya@gmail.com (when available)
- **General:** Comment on relevant issues

---

## LICENSE

By contributing, you agree that your contributions will be licensed under the MIT License.

---

<div align="center">
  <sub>Thank you for helping make education accessible for all!</sub>
</div>
