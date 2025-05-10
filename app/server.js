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

    console.log(`Saving game for user ${uid}`);
    console.log(`Start Time: ${startTime}, End Time: ${endTime}`);

    await db.collection("towns").add({
      uid,
      townmap,
      points,
      startTime: startTime || null,
      endTime: endTime || null,
      timestamp: timestamp || new Date().toISOString(),
    });

    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Failed to save game:", error);
    res.status(500).send({ error: "Failed to save game" });
  }
});

app.get('/achievements', async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    console.log(`Fetching achievements for UID: ${uid}`); // Debugging

    const playerDoc = await db.collection('players').doc(uid).get();
    if (!playerDoc.exists) {
      return res.status(404).send({ error: 'Player not found' });
    }

    const playerData = playerDoc.data();
    const achievements = playerData.achievements || []; // Default to an empty array if no achievements

    console.log('Achievements:', achievements); // Debugging

    res.status(200).send(achievements);
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

    const gamesSnapshot = await db.collection('towns').where('uid', '==', uid).get();
    const games = gamesSnapshot.docs.map((doc) => doc.data());

    res.status(200).send(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).send({ error: 'Failed to fetch games' });
  }
});

const PORT = process.env.VITE_BACKEND_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
