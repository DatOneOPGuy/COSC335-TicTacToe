import React from 'react';
import { useTownStore } from './store.js';

export function ProfileView({ onBackToGame }) {
  const [achievements, setAchievements] = React.useState([]);
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
        console.log('Fetched Achievements:', achievementsData); // Debugging
        setAchievements(achievementsData);
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
    <div className="p-6 bg-brown-100 min-h-screen">
      <button
        onClick={onBackToGame}
        className="mb-4 px-4 py-2 bg-brown-600 text-white rounded hover:bg-brown-700"
      >
        Back to Game
      </button>

      <h1 className="text-3xl font-bold mb-6 text-brown-800">Profile</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-brown-700">Achievements</h2>
        {achievements.length > 0 ? (
          <table className="w-full border-collapse border border-brown-700">
            <thead>
              <tr className="bg-brown-300">
                <th className="border border-brown-700 px-4 py-2 text-left">Name</th>
                <th className="border border-brown-700 px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {achievements.map((achievement, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-brown-200' : 'bg-brown-100'}>
                  <td className="border border-brown-700 px-4 py-2">{achievement.name}</td>
                  <td className="border border-brown-700 px-4 py-2">{achievement.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-brown-600">No achievements earned yet.</p>
        )}
      </section>
    </div>
  );
}