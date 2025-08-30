
# Curio Critters - Educational RPG Game

[![CI](https://github.com/lxsolutions/curio-critters/actions/workflows/ci.yml/badge.svg)](https://github.com/lxsolutions/curio-critters/actions/workflows/ci.yml) [![Release](https://img.shields.io/github/v/release/lxsolutions/curio-critters)](https://github.com/lxsolutions/curio-critters/releases)

Curio Critters is an educational RPG game that makes K-12 learning addictive and fun. The game integrates Diablo II-style progression, Fluvsies-inspired pet care, stealth learning frameworks, and epic adventures covering core subjects.

## Monorepo Structure

```
src/
  frontend/   # React + Vite + TailwindCSS PWA frontend
  backend/    # Node/Express + Prisma + SQLite backend
content/      # Normalized educational content packs (YAML format)
docs/         # Design documents and roadmap
archive/      # Non-canonical game implementations (archived)
```


## Features

- **Pet Care**: Nurture cute critters through feeding, playing, and training
- **RPG Adventures**: Embark on quests that teach math, science, history, and more
- **Stealth Learning**: Educational content hidden in gameplay
- **Progress Tracking**: Adaptive difficulty based on performance
- **PWA Support**: Installable on Amazon Fire Tablet and other devices
- **Real Sounds & Animations**: Immersive audio-visual experience
- **Offline Sync**: Progress saved locally when offline, syncs automatically
- **Parental Dashboard**: Track learning metrics and progress
- **Backend APIs**: RESTful services for data persistence

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lxsolutions/curio-critters.git
   cd curio-critters
   ```

2. Install frontend dependencies:
   ```bash
   cd src/frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd ../backend
   npm install
   ```

4. Initialize the database (runs automatically on first start):
   ```bash
   node db.js
   ```

### Quickstart

```bash
# Clone and install dependencies
git clone https://github.com/lxsolutions/curio-critters.git
cd curio-critters
npm install -g pnpm  # Recommended for dependency management
pnpm install --filter frontend --filter backend

# Start both services (use separate terminal windows)
cd src/backend && npm start  # Backend on port 56456
cd src/frontend && npm run dev --port 50390  # Frontend on port 50390
```

### Running the Application

1. Start the backend server:
   ```bash
   cd src/backend
   node server.js
   ```
   - Backend API will be available at `http://localhost:56456`

2. Start the frontend development server:
   ```bash
   cd ../frontend
   npm run dev --port 50390
   ```
   - Frontend will be available at `http://localhost:50390`

### Testing

1. Run unit tests:
   ```bash
   cd src/frontend
   npm test
   ```

2. Verify API endpoints:
   ```bash
   curl http://localhost:56456/api/users/1
   curl http://localhost:56456/api/analytics/summary?user_id=1
   ```

### For Amazon Fire Tablet QA Testing

The app is optimized for tablet testing and can be accessed via WiFi.

#### Local HTTP Server Access
1. Start both servers:
   - Backend: `cd src/backend && npm start` (port 56456)
   - Frontend: `cd src/frontend && npm run dev --port 50390` (port 50390)
2. Get your local IP address:
   ```bash
   hostname -I | awk '{print $1}'
   ```
3. Open Silk Browser on your Amazon Fire Tablet
4. Navigate to `http://<local_ip>:50390` (replace `<local_ip>` with your server's IP)
5. Add the app to home screen for PWA installation

#### Testing Instructions
1. **Login**: Test kid login with username and grade selection
2. **Pet Care**: Navigate to pet care section, try feed/play buttons that trigger learning mini-games
3. **Quests**: Complete educational quests with trivia questions from various subjects
4. **Offline Mode**: Disconnect WiFi and verify functionality persists (IndexedDB + service worker caching)
5. **PWA Installation**: Add to home screen in Silk Browser for standalone app experience

#### Verification Steps
- ✅ Kid login works and stores data locally
- ✅ Pet care mini-games trigger educational content with real sounds
- ✅ Quests present subject-specific questions with rewards
- ✅ Offline mode maintains progress and functionality
- ✅ PWA installs correctly on Amazon Fire Tablet

## Deployment

### Production Deployment

The Curio Critters app is deployed to:

- **Frontend:** [https://curio-critters-frontend.vercel.app](https://curio-critters-frontend.vercel.app)
- **Backend:** [https://curio-critters-backend.onrender.com](https://curio-critters-backend.onrender.com)

### Local Development

1. Build the frontend for production:
   ```bash
   cd src/frontend
   npm run build
   ```

2. Host the static frontend files (from `dist/` directory) using Vercel:
   ```bash
   vercel --prod
   ```

3. Deploy the backend to Render:
   ```bash
   cd src/backend
   render deploy
   ```

## Documentation

- **Backend API**: RESTful endpoints for user management, progress tracking, and analytics
- **Database Schema**: SQLite with tables for users, learning metrics, pet care logs, and quest progress
- **Frontend Components**: React components for pet care game, RPG adventures, and parental dashboard
- **Offline Sync**: IndexedDB implementation for offline-first functionality

**This is education disguised as the most engaging game ever created! 🎯**

## Vision and Roadmap

For the game's conceptual vision and development plans, see [VISION.md](docs/VISION.md) and [ROADMAP.md](docs/ROADMAP.md).

## License

Licensed under MIT License. See [LICENSE.md](LICENSE.md).

