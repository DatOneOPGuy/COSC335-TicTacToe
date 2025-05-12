import React from 'react';
import { useTownStore } from './store.js';

const POSSIBLE_ACHIEVEMENTS = [
  { name: 'First Building!', description: 'Place your first building' },
  { name: 'First Town Built!', description: 'Save your first town' },
  { name: 'Junior Townbuilder!', description: 'Use every type of resource (wood, yellow, blue, green, stone)' },
  { name: 'Senior Townbuilder', description: 'Build one of every type of building' },
  { name: 'Magical Townbuilder', description: 'Perfect Town!' },
  { name: 'Promising Builder', description: 'Score 5 or more points in a single game' },
  { name: 'Expert Builder', description: 'Score 10 or more points in a single game' },
  { name: 'Master Builder', description: 'Score 20 or more points in a single game' }
];

const resourceIcons = {
  w: '🪵',  // wood
  y: '🌾',  // wheat
  b: '🧱',  // brick
  g: '🔷',  // glass
  s: '⛰️',  // stone
};

const buildingIcons = {
  well: '💧',
  cottage: '🏠',
  farm: '🌾',
  cathedral: '⛪',
  tavern: '🍺',
  market: '🏪',
  chapel: '⛪',
  factory: '🏭',
  theater: '🎭',
};

export function ProfileView({ onBackToGame }) {
  const [achievementsData, setAchievementsData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [gameHistory, setGameHistory] = React.useState([]);
  const [selectedGame, setSelectedGame] = React.useState(null);
  const setGrid = useTownStore((s) => s.setGrid);

  // Remove resourceMap, resources are stored as full names
  const convertTownmapToGrid = (townmap) => {
    return townmap.map(cell => {
      // Empty cell
      if (cell === '0') return null;

      // Resource cell (full name as string)
      if (
        cell === 'wood' ||
        cell === 'wheat' ||
        cell === 'brick' ||
        cell === 'glass' ||
        cell === 'stone'
      ) {
        return cell;
      }

      // Building cell
      return {
        type: 'building',
        building: cell,
        ...(cell === 'factory' && { resource: null })
      };
    });
  };

  // Update handleLoadGame to also reset the deck
  const handleLoadGame = () => {
    if (selectedGame) {
      const store = useTownStore.getState();
      // First reset everything
      store.resetGrid();
      // Convert and set the grid
      const newGrid = convertTownmapToGrid(selectedGame.townmap);
      store.setGrid(newGrid);
      // Clear any selection state for a clean UI
      store.clearSelectedCells();
      store.setSelectedBuilding(null);
      store.setSelectedResource(null);
      // Reshuffle the resource deck
      store.shuffleDeck();
      // Show confirmation
      alert(`Game from ${new Date(selectedGame.timestamp).toLocaleDateString()} loaded!`);
      onBackToGame();
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (!user) {
          alert('No user is signed in.');
          return;
        }

        const idToken = await user.getIdToken();

        // Fetch both achievements and game history
        const [achievementsResponse, gamesResponse] = await Promise.all([
          fetch('http://localhost:3000/achievements', {
            headers: { Authorization: `Bearer ${idToken}` },
          }),
          fetch('http://localhost:3000/games', {
            headers: { Authorization: `Bearer ${idToken}` },
          })
        ]);

        if (!achievementsResponse.ok || !gamesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const achievementsData = await achievementsResponse.json();
        const gamesData = await gamesResponse.json();

        console.log('Fetched achievements:', achievementsData); // Debug log
        console.log('Fetched games:', gamesData); // Debug log

        setAchievementsData(achievementsData);
        setGameHistory(Array.isArray(gamesData) ? gamesData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const GameGrid = ({ townmap }) => {
    const resourceColors = {
      'wood': 'bg-amber-800',  // wood
      'wheat': 'bg-yellow-400', // wheat
      'brick': 'bg-red-600',    // brick
      'glass': 'bg-blue-900',   // glass
      'stone': 'bg-gray-400',   // stone
    };

    return (
      <div className="grid grid-cols-4 gap-1 w-32 h-32">
        {townmap.map((cell, index) => (
          <div
            key={index}
            className={`w-7 h-7 border border-gray-600 rounded flex items-center justify-center ${
              cell === '0' ? 'bg-gray-800' :
              resourceColors[cell] || 'bg-white'  // Use resource color or white for buildings
            }`}
          >
            {cell !== '0' && (
              ['w', 'y', 'b', 'g', 's'].includes(cell) ? 
                <span className="text-xs">{resourceIcons[cell]}</span> :
                <span className="text-lg">{buildingIcons[cell]}</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-10 text-white">
      <div className="mx-auto bg-[#161b22] rounded-xl shadow-2xl p-8 border border-gray-700">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            <button
              onClick={onBackToGame}
              className="mb-6 px-4 py-2 bg-[#d73a49] text-white rounded hover:bg-[#e55353] transition"
            >
              ⬅ Back to Game
            </button>
      
            <h1 className="text-4xl font-extrabold mb-8 text-yellow-400 text-center">
              🧙 Player Profile
            </h1>
      
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-300">🏆 Earned Achievements</h2>
              {achievementsData?.Achievements?.length > 0 ? (
                <ul className="space-y-3 pl-4">
                  {achievementsData.Achievements.map((achievement, index) => (
                    <li key={index} className="flex items-center text-lg text-gray-200">
                      <span className="text-yellow-400 mr-2">⭐</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No achievements earned yet.</p>
              )}
            </section>
      
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-300">🎯 Available Achievements</h2>
              <ul className="space-y-3 pl-4">
                {POSSIBLE_ACHIEVEMENTS
                  .filter(achievement => !achievementsData?.Achievements?.includes(achievement.name))
                  .map((achievement, index) => (
                    <li
                      key={index}
                      className="flex items-center text-lg text-gray-500"
                    >
                      <span className="mr-2">☆</span>
                      <div>
                        <span className="font-semibold">{achievement.name}</span>
                        <span className="ml-2 text-sm">- {achievement.description}</span>
                      </div>
                    </li>
                  ))}
              </ul>
            </section>
      
            {/* Add Game History Section */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-300">🎮 Game History</h2>
              {gameHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-700">
                        <th className="p-2">Town Layout</th>
                        <th className="p-2">Score</th>
                        <th className="p-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gameHistory.map((game, index) => (
                        <tr 
                          key={index}
                          onClick={() => setSelectedGame(game)}
                          className={`cursor-pointer hover:bg-gray-700 ${
                            selectedGame === game ? 'bg-gray-700' : ''
                          }`}
                        >
                          <td className="p-2">
                            <GameGrid townmap={game.townmap} />
                          </td>
                          <td className="p-2">{game.points}</td>
                          <td className="p-2">
                            {new Date(game.timestamp).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400">No games played yet.</p>
              )}
      
              {/* Load Game Button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleLoadGame}
                  disabled={!selectedGame}
                  className={`px-4 py-2 rounded ${
                    selectedGame
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  Load Selected Game
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}