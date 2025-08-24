
# Curio Critters - Educational RPG Game

Curio Critters is an educational RPG game that makes K-12 learning addictive and fun. The game integrates Diablo II-style progression, Fluvsies-inspired pet care, stealth learning frameworks, and epic adventures covering core subjects.

## Features

- **Pet Care**: Nurture cute critters through feeding, playing, and training
- **RPG Adventures**: Embark on quests that teach math, science, history, and more
- **Stealth Learning**: Educational content hidden in gameplay
- **Progress Tracking**: Adaptive difficulty based on performance
- **PWA Support**: Installable on Amazon Fire Tablet and other devices

## Getting Started

**Note**: The repository has been updated with the full implementation. For QA and testing, clone this branch and follow the installation instructions below.

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lxsolutions/curio-critters.git
   cd curio-critters
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5179` (port may vary)

### For Amazon Fire Tablet QA Testing

The app is optimized for tablet testing and can be accessed via WiFi or public URL.

#### Option 1: Local HTTP Server Access
1. Start the HTTP server in the project root:
   ```bash
   cd /workspace/curio-critters
   python -m http.server 50468
   ```
2. Get the local IP address:
   ```bash
   hostname -I | awk '{print $1}'
   ```
3. Open Silk Browser on your Amazon Fire Tablet
4. Navigate to `http://<local_ip>:50468` (replace `<local_ip>` with your server's IP)
5. Add the app to home screen for PWA installation

#### Testing Instructions
1. **Login**: Test kid login with username and grade selection (stores in localStorage)
2. **Pet Care**: Navigate to pet care section, try feed/play buttons that trigger learning mini-games
3. **Quests**: Complete educational quests with trivia questions from various subjects
4. **Offline Mode**: Disconnect WiFi and verify functionality persists (localStorage + service worker caching)
5. **PWA Installation**: Add to home screen in Silk Browser for standalone app experience

#### Verification Steps
- ✅ Kid login works and stores data locally
- ✅ Pet care mini-games trigger educational content
- ✅ Quests present subject-specific questions with rewards
- ✅ Offline mode maintains progress and functionality
- ✅ PWA installs correctly on Amazon Fire Tablet

## 🎮 Full Educational RPG Implementation

This branch contains the complete revolutionary educational gaming system:

### 🐉 Live Demo Servers
- **Pet Care Game**: `python3 -m http.server 56929 --bind 0.0.0.0` in `game_demo/`
- **RPG Adventure**: `python3 -m http.server 53413 --bind 0.0.0.0` in `rpg_game/`

### 🏆 Revolutionary Features
- Diablo II-style progression system
- Complete stealth learning framework
- Fluvsies-inspired pet care interface
- Hidden K-12 curriculum in epic adventures
- Addictive mechanics that make kids beg to learn

### 📚 Documentation
- `STEALTH_LEARNING.md` - Framework for invisible education
- `RPG_PROGRESSION_SYSTEM.md` - Diablo II-style advancement
- `FLUVSIES_INSPIRED_DESIGN.md` - Pet care game principles
- `GAME_DESIGN.md` - Technical architecture

**This is education disguised as the most engaging game ever created! 🎯**

