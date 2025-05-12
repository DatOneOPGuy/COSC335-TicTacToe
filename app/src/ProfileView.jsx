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

// Add this near the top of the file, after the imports
const formatDate = (timestamp) => {
  // Use a fallback timestamp if none provided
  const dateToFormat = timestamp || new Date().toISOString();
  
  try {
    const date = new Date(dateToFormat);
    
    // Validate the date
    if (isNaN(date.getTime())) {
      console.warn('Invalid timestamp:', timestamp);
      return {
        date: "Unknown Date",
        time: "Unknown Time"
      };
    }
    
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  } catch (error) {
    console.error('Error formatting date:', error);
    return {
      date: "Unknown Date",
      time: "Unknown Time"
    };
  }
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
      store.resetGrid();
      const newGrid = convertTownmapToGrid(selectedGame.townmap);
      store.setGrid(newGrid);
      store.clearSelectedCells();
      store.setSelectedBuilding(null);
      store.setSelectedResource(null);
      store.shuffleDeck();
      
      const formatted = formatDate(selectedGame.timestamp);
      const displayDate = typeof formatted === 'string' ? 
        formatted : 
        `${formatted.date} ${formatted.time}`;
      
      alert(`Game from ${displayDate} loaded!`);
      onBackToGame();
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (!user) {
          alert('No user is signed in.');
          setLoading(false); // Ensure loading is set to false
          return;
        }

        const idToken = await user.getIdToken();

        // Fetch achievements
        const achievementsResponse = await fetch('http://localhost:3000/achievements', {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        if (!achievementsResponse.ok) {
          throw new Error(`Failed to fetch achievements: ${achievementsResponse.statusText}`);
        }

        const achievementsData = await achievementsResponse.json();
        console.log('Fetched achievements:', achievementsData); // Debug log
        setAchievementsData(achievementsData);

        // Fetch games
        const gamesResponse = await fetch('http://localhost:3000/games', {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        if (!gamesResponse.ok) {
          throw new Error(`Failed to fetch games: ${gamesResponse.statusText}`);
        }

        const gamesData = await gamesResponse.json();
        console.log('Raw games data:', gamesData);
        gamesData.forEach((game, index) => {
          console.log(`Game ${index} timestamp:`, {
            raw: game.timestamp,
            type: typeof game.timestamp,
            parsed: new Date(game.timestamp),
            valid: !isNaN(new Date(game.timestamp).getTime())
          });
        });
        setGameHistory(Array.isArray(gamesData) ? gamesData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Ensure loading is set to false in all cases
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
                            {(() => {
                              const formatted = formatDate(game.timestamp);
                              return (
                                <div>
                                  <div>{formatted.date}</div>
                                  <div className="text-sm text-gray-400">{formatted.time}</div>
                                </div>
                              );
                            })()}
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