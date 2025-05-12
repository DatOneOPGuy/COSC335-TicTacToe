import React, { useEffect, useState } from 'react';
import { TownGrid } from './TownGrid.jsx';
import { ResourceDeck } from './ResourceDeck.jsx';
import { BuildingButtons } from './BuildingButtons.jsx';
import { UserMenu } from './UserMenu.jsx';
import { ProfileView } from './ProfileView.jsx';
import { Leaderboard } from './Leaderboard.jsx';
import { useTownStore } from './store.js';
import { calculateScore, saveGame } from './logic.js';

function convertBoardToArray(board) {
  const resourceMap = {
    wood: 'w',
    wheat: 'y',
    brick: 'b',
    glass: 'g',
    stone: 's',
  };

  return board.map(cell => {
    if (cell && cell.type === 'building') {
      return cell.building; // Save the building name as a string
    }
    return cell ? resourceMap[cell] : '0'; // Save resource as a single letter or '0' for empty
  });
}

const initializePlayer = async () => {
  const user = firebase.auth().currentUser;
  if (user) {
    try {
      const idToken = await user.getIdToken();
      // Initialize player as before
      await fetch('http://localhost:3000/player/init', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Fetch player profile to check for gamertag
      const res = await fetch('http://localhost:3000/player/profile', {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      const data = await res.json();

      if (!data.gamertag) {
        let gamertag = '';
        while (!gamertag || gamertag.length < 3) {
          gamertag = prompt("Choose a gamertag (at least 3 characters):");
          if (gamertag === null) break; // user cancelled
        }
        if (gamertag) {
          await fetch('http://localhost:3000/player/gamertag', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${idToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ gamertag })
          });
        }
      }
    } catch (error) {
      console.error('Error initializing player:', error);
    }
  }
};

export function App() {
  const resetGrid = useTownStore((s) => s.resetGrid);
  const shuffleDeck = useTownStore((s) => s.shuffleDeck);
  const board = useTownStore((s) => s.grid);
  const setGrid = useTownStore((s) => s.setGrid);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(null);
  const [lastBoard, setLastBoard] = useState(board);
  const [startTime, setStartTime] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    setStartTime(new Date().toISOString());
    shuffleDeck();
  }, []);

  useEffect(() => {
    setScore(calculateScore(board)); // <-- This should NOT include the penalty
    if (finalScore !== null && board !== lastBoard) {
      setFinalScore(null);
    }
    setLastBoard(board);
  }, [board]);

  const handleResetGame = () => {
    resetGrid();
    setStartTime(new Date().toISOString());
    setFinalScore(null);
  };

  const handleEndGame = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      try {
        const idToken = await user.getIdToken();
        const endTime = new Date().toISOString();
        const points = calculateScore(board, true); // <-- This DOES include the penalty

        // Save the game and get new achievements
        const response = await saveGame(board, idToken, startTime, endTime);
        const data = await response.json();

        // Show final score
        setFinalScore(points);

        let message = 'Game ended and saved successfully!';
        if (data.newAchievements && data.newAchievements.length > 0) {
          message += '\n\nNew Achievements Earned:\n' + 
            data.newAchievements.map(achievement => `🏆 ${achievement}`).join('\n');
        }

        alert(message);
      } catch (err) {
        console.error('Error ending game:', err);
        alert('Failed to end and save the game.');
      }
    } else {
      alert('No user is signed in.');
    }
  };

    // Add this to your useEffect that handles authentication
    useEffect(() => {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          await initializePlayer();
          // ...existing auth state change code...
        }
      });
    }, []);

  if (showLeaderboard) {
    return <Leaderboard onBack={() => setShowLeaderboard(false)} />;
  }

  if (showProfile) {
    return <ProfileView onBackToGame={() => setShowProfile(false)} />;
  }

  return (
    <div className="p-6 text-center">
      <UserMenu
        onViewProfile={() => setShowProfile(true)}
        onViewLeaderboard={() => setShowLeaderboard(true)}
      />
      <h1 className="text-2xl font-bold mb-4">Tiny Towns Builder</h1>
      <h2 className="text-xl font-semibold mb-4">Current Score: {score}</h2>
      {finalScore !== null && (
        <div className="text-lg font-bold text-green-400 mb-2">
          Final Score: {finalScore}
        </div>
      )}
      <div className="flex justify-center items-start gap-8">
        <div className="pt-8">
          <BuildingButtons />
        </div>
        <div>
          <ResourceDeck />
          <TownGrid />
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={handleResetGame}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Reset Game
        </button>
        <button
          onClick={handleEndGame}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          End Game
        </button>
      </div>
    </div>
  );
}
