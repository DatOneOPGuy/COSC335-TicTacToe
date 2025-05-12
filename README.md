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
docker compose up --build
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

## Firebase Setup

1. Create new project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication:
   - Authentication > Sign-in method
   - Enable Email/Password and Google providers
3. Create Firestore Database in test mode
4. Get configuration files:
   - Project Settings > Service accounts > Generate new private key (serviceAccountKey.json)
   - Project Settings > Your apps > Add web app (firebaseConfig.json)

## Environment Variables
```
VITE_BACKEND_URL=http://localhost:3000
VITE_BACKEND_PORT=3000
```

## Data Models

### Player Profile
```js
{
  uid: string,
  gamertag: string,
  totalPoints: number,
  achievements: string[],
  games: Game[]
}
```

### Game
```js
{
  townmap: string[],
  points: number,
  timestamp: string,
  startTime: string,
  endTime: string
}
```

## Docker Commands

```bash
# Build and start containers
docker compose up --build

# Stop containers 
docker compose down

# View logs
docker compose logs -f

# Shell into container
docker exec -it tictactoe-backend bash
docker exec -it tictactoe-vite bash
```

## Development Without Docker

```bash
cd app
npm install

# Start backend
node server.js

# Start frontend 
npm run dev
```

## Testing

```bash 
# Unit tests
npm test

# UI tests
npm run test:ui

# Coverage report
npm run coverage
```

## Production Deployment

1. Build frontend:
```bash
cd app
npm run build
```

2. Update environment variables for production

3. Deploy containers:
```bash
docker compose -f docker-compose.prod.yml up -d
```

## Security Notes

- Never commit Firebase credentials
- Configure CORS appropriately in production
- Set proper Firestore security rules
- Use environment variables for sensitive data

## License

MIT

## Support

Report issues via GitHub issues
