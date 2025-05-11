import React from 'react';
import { useTownStore } from './store.js';

const POSSIBLE_ACHIEVEMENTS = [
  { name: 'First Building!', description: 'Place your first building' },
  { name: 'First Town Built!', description: 'Save your first town' },
  { name: 'Junior Townbuilder!', description: 'Use every type of resource (wood, yellow, blue, green, stone)' },
  { name: 'Senior Townbuilder', description: 'Build one of every type of building' },
  { name: 'Magical Townbuilder', description: 'Fill 11 out of 12 grid cells with buildings' }
];

export function ProfileView({ onBackToGame }) {
  const [achievementsData, setAchievementsData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (!user) {
          alert('No user is signed in.');
          return;
        }

        const idToken = await user.getIdToken();

        // Fetch achievements for the player
        const response = await fetch('http://localhost:3000/achievements', {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch achievements');
        }

        const achievementsData = await response.json();
        console.log('Fetched Player Data:', achievementsData); // Debugging

        // Store the raw JSON data
        setAchievementsData(achievementsData);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return <div className="text-center text-brown-800">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-10 text-white">
      <div className="mx-auto bg-[#161b22] rounded-xl shadow-2xl p-8 border border-gray-700">
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
          <ul className="space-y-3 pl-4">
            {achievementsData?.Achievements?.map((achievement, index) => (
              <li
                key={index}
                className="flex items-center text-lg text-gray-200"
              >
                <span className="text-yellow-400 mr-2">⭐</span>
                {achievement}
              </li>
            ))}
          </ul>
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
      </div>
    </div>
  );
}