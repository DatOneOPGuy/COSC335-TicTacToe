# Tiny Towns Builder

A full-stack React game with Firebase authentication and real-time scoring. Built with Vite, Express, Firebase, and Docker.

## Features

- 4x4 grid-based town building game with resource placement and building construction
- Real-time scoring system with building combos and penalties 
- Firebase Authentication with email/password and Google sign-in
- Firestore database for player profiles, achievements and game history
- Dockerized frontend and backend with docker-compose
- Unit testing suite with Vitest

## Prerequisites

- Docker and Docker Compose
- Firebase project with:
  - Authentication enabled (Email/Password & Google Sign-in) 
  - Firestore Database
  - Service Account key (Admin SDK)
  - Web configuration

## Firebase Setup

1. Create new project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication:
   - Authentication > Sign-in method
   - Enable Email/Password and Google providers
3. Create Firestore Database in test mode
4. Get configuration files:
   - Project Settings > Service accounts > Generate new private key (serviceAccountKey.json)
   - Project Settings > Your apps > Add web app (firebaseConfig.json)
  

## CREATE .env FILE IN APP DIR
```
VITE_BACKEND_URL=http://localhost:3000
VITE_BACKEND_PORT=3000
```

## Quick Start

1. Clone and configure:

```bash
git clone <repository-url>
cd tiny-towns-builder

# Copy Firebase files to app/
cp path/to/serviceAccountKey.json app/
cp path/to/firebaseConfig.json app/

# Create .env
echo "VITE_BACKEND_URL=http://localhost:3000" > app/.env
echo "VITE_BACKEND_PORT=3000" >> app/.env
```

2. Build and run with Docker:

```bash
docker compose up 
```

Access the application:
- Frontend: http://localhost:5173  
- Backend API: http://localhost:3000

3. Running tests:

```bash
# Unit tests
docker exec -it tictactoe-backend bash
npm test

# UI tests
npm run test:ui
```

## Project Structure

```
app/
  ├── src/              # React frontend source
  ├── tests/            # Test files
  ├── server.js         # Express backend
  ├── vite.config.js    # Vite configuration  
  ├── package.json      # Dependencies
  ├── .env             # Environment variables
  ├── firebaseConfig.json    # Firebase web config
  └── serviceAccountKey.json # Firebase admin SDK key
```

