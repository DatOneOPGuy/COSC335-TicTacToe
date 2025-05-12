import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, "serviceAccountKey.json"))
);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/save-game", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const { townmap, points, startTime, endTime, timestamp } = req.body;

    // Create a game object
    const gameData = {
      townmap: townmap,
      points: points,
      startTime: startTime || null,
      endTime: endTime || null
    };

    // Save the game to towns collection
    await db.collection("towns").add({
      uid,
      ...gameData
    });

    // Add game data to player's games array and increment totalPoints
    const playerRef = db.collection('players').doc(uid);
    const playerDoc = await playerRef.get();
    const playerData = playerDoc.data();

    // Update player's games array and totalPoints
    await playerRef.update({
      games: admin.firestore.FieldValue.arrayUnion(gameData),
      totalPoints: admin.firestore.FieldValue.increment(points)
    });

    // Continue with achievements checking
    const newAchievements = [];

    // Check for achievements
    // 1. First Town Built
    if (!playerData.Achievements.includes('First Town Built!')) {
      newAchievements.push('First Town Built!');
    }

    // 1.5 First Building - Check if any building exists
    const buildingExists = townmap.some(cell => 
      ['well', 'cottage', 'farm', 'cathedral', 'tavern', 'market', 
       'chapel', 'theater', 'factory'].includes(cell)
    );

    if (buildingExists && !playerData.Achievements.includes('First Building!')) {
      newAchievements.push('First Building!');
      console.log('First Building achievement earned!');
    }

    // 2. Junior Townbuilder - Check if all resource types are present
    const requiredResources = ['wood', 'wheat', 'brick', 'glass', 'stone'];
    const hasAllResources = requiredResources.every(resource => 
      townmap.some(cell => cell === resource)
    );

    if (hasAllResources && !playerData.Achievements.includes('Junior Townbuilder!')) {
      newAchievements.push('Junior Townbuilder!');
      console.log('Junior Townbuilder achievement earned!');
    }

    // 3. Senior Townbuilder - Check if all building types are present
    const requiredBuildings = ['well', 'cottage', 'farm', 'cathedral', 'tavern', 'market', 
                          'chapel', 'theater', 'factory'];
    const hasAllBuildings = requiredBuildings.every(building => 
      townmap.some(cell => cell === building)
    );

    if (hasAllBuildings && !playerData.Achievements.includes('Senior Townbuilder')) {
      newAchievements.push('Senior Townbuilder');
      console.log('Senior Townbuilder achievement earned!');
    }

    // 4. Magical Townbuilder - Check if at least 11 cells contain buildings
    const buildingTypes = ['well', 'cottage', 'farm', 'cathedral', 'tavern', 'market', 
                      'chapel', 'theater', 'factory'];
    const buildingCount = townmap.filter(cell => 
      buildingTypes.includes(cell)
    ).length;

    if (buildingCount >= 11 && !playerData.Achievements.includes('Magical Townbuilder')) {
      newAchievements.push('Perfect Town');
      console.log('Perfect Town achievement earned!');
    }

    // 5. Score-based achievements
    if (points >= 5 && !playerData.Achievements.includes('Promising Builder')) {
      newAchievements.push('Promising Builder');
      console.log('Promising Builder achievement earned! (5+ points)');
    }

    if (points >= 10 && !playerData.Achievements.includes('Expert Builder')) {
      newAchievements.push('Expert Builder');
      console.log('Expert Builder achievement earned! (10+ points)');
    }

    if (points >= 20 && !playerData.Achievements.includes('Master Builder')) {
      newAchievements.push('Master Builder');
      console.log('Master Builder achievement earned! (20+ points)');
    }

    // Add new achievements to player's record
    if (newAchievements.length > 0) {
      await playerRef.update({
        Achievements: admin.firestore.FieldValue.arrayUnion(...newAchievements)
      });
      console.log(`Added achievements to player ${uid}:`, newAchievements);
    }

    res.status(200).send({ 
      success: true,
      newAchievements // Send back the new achievements earned
    });
  } catch (error) {
    console.error("Failed to save game:", error);
    res.status(500).send({ error: "Failed to save game" });
  }
});

// Update the player initialization to include the games array
app.post('/player/init', async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const playerRef = db.collection('players').doc(uid);
    const playerDoc = await playerRef.get();

    if (!playerDoc.exists) {
      await playerRef.set({
        uid: uid,
        Achievements: [],
        games: [],
        totalPoints: 0,
        gamertag: null,
        created: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Created new player document for UID: ${uid}`);
    }
    res.status(200).send({ success: true });
  } catch (error) {
    console.error('Error initializing player:', error);
    res.status(500).send({ error: 'Failed to initialize player' });
  }
});

// Get player profile (for gamertag)
app.get('/player/profile', async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const playerDoc = await db.collection('players').doc(uid).get();
    if (!playerDoc.exists) return res.status(404).send({ error: 'Player not found' });
    const data = playerDoc.data();
    res.status(200).send({ gamertag: data.gamertag || null });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch profile' });
  }
});

// Set gamertag
app.post('/player/gamertag', async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  const { gamertag } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    // Optionally: check for unique gamertag
    const snapshot = await db.collection('players').where('gamertag', '==', gamertag).get();
    if (!snapshot.empty) {
      return res.status(400).send({ error: 'Gamertag already taken' });
    }
    await db.collection('players').doc(uid).update({ gamertag });
    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ error: 'Failed to set gamertag' });
  }
});

app.get('/achievements', async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const playerDoc = await db.collection('players').doc(uid).get();
    if (!playerDoc.exists) {
      return res.status(404).send({ error: 'Player not found' });
    }

    const playerData = playerDoc.data();
    // Remove the "nah u dont have any lol" and use empty array as default
    const achievements = playerData.Achievements || [];

    res.status(200).send({ Achievements: achievements });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).send({ error: 'Failed to fetch achievements' });
  }
});

app.get('/games', async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const playerDoc = await db.collection('players').doc(uid).get();
    if (!playerDoc.exists) {
      return res.status(404).send({ error: 'Player not found' });
    }

    const playerData = playerDoc.data();
    const games = playerData.games || [];

    res.status(200).send(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).send({ error: 'Failed to fetch games' });
  }
});

app.get('/leaderboard', async (req, res) => {
  try {
    const snapshot = await db.collection('players')
      .orderBy('totalPoints', 'desc')
      .limit(10)  // Changed from 20 to 10
      .get();

    const leaderboard = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      leaderboard.push({
        uid: data.uid,
        gamertag: data.gamertag || data.uid.slice(0, 8),
        totalPoints: data.totalPoints || 0,
      });
    });

    res.status(200).send(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).send({ error: 'Failed to fetch leaderboard' });
  }
});

const PORT = process.env.VITE_BACKEND_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
