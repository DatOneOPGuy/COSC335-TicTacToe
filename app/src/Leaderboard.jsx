import React, { useEffect, useState } from 'react';

export function Leaderboard({ onBack }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/leaderboard')
      .then(res => res.json())
      .then(data => {
        setLeaders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen p-10 text-white">
      <div className="mx-auto bg-[#161b22] rounded-xl shadow-2xl p-8 border border-gray-700 max-w-lg">
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 bg-[#d73a49] text-white rounded hover:bg-[#e55353] transition"
        >
          ⬅ Back
        </button>
        <h1 className="text-4xl font-extrabold mb-8 text-yellow-400 text-center">
          🏆 Top 10 Players
        </h1>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <table className="w-full text-lg">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-2 text-left">Rank</th>
                <th className="p-2 text-left">Gamertag</th>
                <th className="p-2 text-left">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((player, idx) => (
                <tr 
                  key={player.uid} 
                  className={`border-b border-gray-800 ${
                    idx < 3 ? 'text-yellow-400 font-semibold' : ''
                  }`}
                >
                  <td className="p-2">
                    {idx === 0 ? '🥇' : 
                     idx === 1 ? '🥈' : 
                     idx === 2 ? '🥉' : 
                     `${idx + 1}`}
                  </td>
                  <td className="p-2">{player.gamertag}</td>
                  <td className="p-2">{player.totalPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}