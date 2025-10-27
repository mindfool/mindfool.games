# MindFool.Games

**A mindful mobile game for focus and calm through traditional attention practices.**

---

## Overview

MindFool.Games is an Android-first mobile game that brings ancient attention practices (breathing meditation, walking meditation, mindful counting) into a modern, playful format. Each session is 2-10 minutes, perfect for daily mental resets.

**Platform:** React Native (Expo) → Android, with PWA support via React Native Web

---

## Features (MVP)

✅ **Balloon Breathing** - Sync your breath with a calming animated circle
✅ **Pre/Post Check-in** - Track your mental state before and after each session
✅ **Progress Tracking** - See how much calmer you feel after each game
✅ **Session History** - Review past sessions and your calm improvement over time

---

## Tech Stack

- **Framework:** Expo SDK 54 + TypeScript
- **Navigation:** Expo Router
- **Animation:** react-native-skia
- **Styling:** NativeWind (Tailwind)
- **State:** Zustand
- **Storage:** AsyncStorage
- **Audio:** expo-av

---

## Getting Started

### Prerequisites
- Node.js 20.16+ (current: warnings about 20.15, upgrade recommended)
- npm or yarn
- Expo CLI
- Android device or emulator

### Installation

\`\`\`bash
# Clone the repo
git clone https://github.com/mindfool/mindfool.games.git
cd mindfool.games

# Install dependencies
npm install --legacy-peer-deps

# Start the development server
npm start

# Run on Android
npm run android
\`\`\`

---

## Project Structure

\`\`\`
mindfool.games/
├── app/                          # Expo Router screens
│   ├── index.tsx                # Home screen
│   ├── game.tsx                 # Game session
│   └── post-game.tsx            # Post-session reflection
│
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── BreathingCircle.tsx
│   │   ├── CalmSlider.tsx
│   │   └── DeltaDisplay.tsx
│   │
│   ├── stores/                  # Zustand state management
│   │   ├── sessionStore.ts
│   │   └── historyStore.ts
│   │
│   ├── services/                # Business logic
│   │   ├── audioService.ts
│   │   ├── storageService.ts
│   │   └── breathTimer.ts
│   │
│   ├── constants/               # Design tokens & constants
│   │   ├── tokens.ts
│   │   └── sounds.ts
│   │
│   └── types/                   # TypeScript definitions
│
└── assets/
    └── sounds/                  # Audio files
\`\`\`

---

## Documentation

📋 **Specifications:** [mindfool.games-spec-docs](https://github.com/mindfool/mindfool.games-spec-docs)

The spec repo contains:
- Product vision and MVP scope
- Detailed feature specifications
- Technical architecture
- Design system guidelines
- Implementation roadmap

---

## Development Status

**Current Phase:** MVP Development
**Focus:** Balloon Breathing mini-game + Check-in system
**Target:** Alpha testing in 5 weeks

---

## Roadmap

- **v0.1 (MVP):** Balloon Breathing + Check-in system
- **v0.2:** Walking Meditation + Number Bubbles modes
- **v0.3:** Gong Listening + Counting Ladder modes
- **v0.4:** Body Sweep unlock + Adaptive suggestions
- **v1.0:** Full 6-mode experience → Play Store launch

---

## Contributing

This project is currently in early development. Contributions welcome after MVP release.

---

## License

TBD

---

## Links

- **Specs Repo:** [github.com/mindfool/mindfool.games-spec-docs](https://github.com/mindfool/mindfool.games-spec-docs)
- **Organization:** [github.com/mindfool](https://github.com/mindfool)

---

Built with mindfulness 🌿
