# Curio Critters 🐾

A comprehensive homeschool education system for children ages 4-9, delivered through an engaging creature-based learning adventure. This isn't just an educational game—it's a complete curriculum replacement that uses AI-powered personalized learning, creature evolution mechanics, and story-driven progression to deliver a full K-4 education that meets or exceeds traditional schooling standards.

## 🎯 Project Overview

**Goal**: Create a legally compliant, comprehensive homeschool solution that completely replaces traditional schooling through engaging, creature-driven learning.

**Target Age**: 4-9 years old (K-4 curriculum)
**Platform**: Android (Flutter) with offline-first design
**Backend**: Firebase with local caching and sync
**AI Integration**: OpenAI API for dynamic curriculum generation
**Standards**: Common Core Math/ELA, NGSS Science alignment
**Legal Compliance**: Full homeschool documentation and reporting

## 🏗️ Architecture

### Core Modules

1. **Flutter Frontend** - Main game interface and user interactions
2. **Creature System** - Virtual pet mechanics, growth, and personality
3. **AI Content Engine** - OpenAI integration for personalized learning
4. **Mini-Games Engine** - Modular educational games
5. **Firebase Backend** - User data, progress tracking, content storage
6. **Parent Dashboard** - Progress monitoring and parental controls

### Project Structure

```
curio_critters/
├── lib/
│   ├── main.dart                    # App entry point
│   ├── core/                        # Core utilities and constants
│   │   ├── constants/
│   │   │   ├── app_constants.dart
│   │   │   ├── game_constants.dart
│   │   │   └── colors.dart
│   │   ├── utils/
│   │   │   ├── validators.dart
│   │   │   └── helpers.dart
│   │   └── services/
│   │       └── dependency_injection.dart
│   ├── models/                      # Data models
│   │   ├── creature.dart
│   │   ├── user.dart
│   │   ├── mini_game.dart
│   │   ├── learning_content.dart
│   │   └── progress.dart
│   ├── services/                    # Business logic services
│   │   ├── ai_content_service.dart
│   │   ├── firebase_service.dart
│   │   ├── creature_service.dart
│   │   ├── game_service.dart
│   │   └── audio_service.dart
│   ├── screens/                     # UI screens
│   │   ├── splash/
│   │   ├── onboarding/
│   │   ├── home/
│   │   ├── creature/
│   │   ├── mini_games/
│   │   └── parent_dashboard/
│   ├── widgets/                     # Reusable UI components
│   │   ├── creature_widget.dart
│   │   ├── mini_game_widgets/
│   │   ├── common/
│   │   └── animations/
│   └── providers/                   # State management
│       ├── creature_provider.dart
│       ├── user_provider.dart
│       ├── game_provider.dart
│       └── content_provider.dart
├── assets/                          # Game assets
│   ├── images/
│   │   ├── creatures/
│   │   ├── backgrounds/
│   │   └── ui/
│   ├── sounds/
│   └── animations/
├── test/                           # Unit and widget tests
└── integration_test/               # Integration tests
```

## 🎮 Game Features

### Core Gameplay
- **Creature Adoption**: Kids choose and name their virtual pet
- **Creature Care**: Feed, play, and interact with creatures
- **Growth System**: Creatures evolve based on learning progress
- **Personalized Learning**: AI-generated content based on child's level and interests

### Educational Mini-Games
- **Math Adventures**: Number recognition, counting, basic arithmetic
- **Word Wizards**: Letter recognition, phonics, vocabulary building
- **Science Explorers**: Basic science concepts, nature exploration
- **Creative Corner**: Drawing, storytelling, pattern recognition

### Parent Features
- **Progress Dashboard**: Track learning milestones and time spent
- **Content Controls**: Adjust difficulty and content preferences
- **Reports**: Weekly/monthly progress summaries
- **Safe Environment**: No ads, secure data handling

## 🛠️ Technical Stack

- **Frontend**: Flutter 3.x
- **State Management**: Provider
- **Backend**: Firebase (Firestore, Auth, Storage)
- **AI Integration**: OpenAI API
- **Audio**: flutter_sound
- **Animations**: Lottie, Flutter built-in animations
- **Testing**: flutter_test, integration_test

## 🚀 Development Phases

### Phase 1: Core Foundation
- [x] Project setup and architecture
- [ ] Basic creature system
- [ ] Firebase integration
- [ ] Simple mini-game framework

### Phase 2: AI Integration
- [ ] OpenAI API integration
- [ ] Content generation system
- [ ] Personalization engine

### Phase 3: Game Features
- [ ] Complete mini-games suite
- [ ] Creature evolution system
- [ ] Audio and animations

### Phase 4: Parent Dashboard
- [ ] Progress tracking
- [ ] Parental controls
- [ ] Reporting system

### Phase 5: Polish & Launch
- [ ] UI/UX refinement
- [ ] Performance optimization
- [ ] Testing and QA
- [ ] App store preparation

## 🎨 Design Principles

- **Child-Friendly**: Large buttons, simple navigation, colorful interface
- **Gender-Inclusive**: Diverse creatures and characters
- **Accessibility**: Support for different abilities and learning styles
- **Safe**: No external links, secure data handling, parental oversight
- **Engaging**: Rewards, achievements, and positive reinforcement

## 📱 Getting Started

1. Install Flutter SDK
2. Clone the repository
3. Run `flutter pub get`
4. Set up Firebase project
5. Configure OpenAI API key
6. Run `flutter run`

## 🔐 Environment Setup

Create a `.env` file with:
```
OPENAI_API_KEY=your_openai_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.