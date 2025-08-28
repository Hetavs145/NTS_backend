import React from 'react';
import { FaCoins, FaGift, FaHistory, FaTrophy, FaBookOpen, FaRobot, FaLink, FaUserPlus, FaComments } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const tasks = [
  {
    title: "Read 'Digital Trends 2024'",
    desc: 'Read the latest tech report and answer a quick quiz',
    coins: 50,
    icon: <FaBookOpen className="text-4xl text-purple-500 mx-auto mb-2" title="Read" />,
  },
  {
    title: "Review 'AI in Healthcare'",
    desc: 'Submit a comprehensive review for the new ebook.',
    coins: 80,
    icon: <FaRobot className="text-4xl text-orange-500 mx-auto mb-2" title="AI" />,
  },
  {
    title: "Complete 'Blockchain Basics'",
    desc: 'Finish the introductory course on blockchain technology.',
    coins: 80,
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Share on Social Media',
    desc: 'Share our platform on your favorite social network.',
    coins: 20,
    icon: <FaLink className="text-4xl text-blue-500 mx-auto mb-2" title="Share" />,
  },
  {
    title: 'Invite a Friend',
    desc: 'Invite a friend to join and earn coins.',
    coins: 100,
    icon: <FaUserPlus className="text-4xl text-green-500 mx-auto mb-2" title="Invite" />,
  },
  {
    title: 'Participate in Forum',
    desc: 'Join the discussion in our community forum.',
    coins: 30,
    icon: <FaComments className="text-4xl text-purple-400 mx-auto mb-2" title="Forum" />,
  },
];

const transactions = [
  { desc: 'Completed Daily Quiz', date: '2024-07-01', amount: '+15', type: 'pos' },
  { desc: 'Purchased Premium Article Access', date: '2024-06-28', amount: '-120', type: 'neg' },
  { desc: "Finished 'Introduction to React'", date: '2024-06-27', amount: '+80', type: 'pos' },
  { desc: 'Logged in daily bonus', date: '2024-06-27', amount: '+10', type: 'pos' },
  { desc: 'Unlocked Advanced Algorithms course', date: '2024-06-26', amount: '-250', type: 'neg' },
];

const leaderboard = [
  { name: 'Alice Smith', coins: 8750 },
  { name: 'Bob Johnson', coins: 7920 },
  { name: 'Charlie Brown', coins: 7100 },
  { name: 'Diana Prince', coins: 6540 },
  { name: 'Eve Adams', coins: 5890 },
  { name: 'Frank White', coins: 5310 },
];

const Coins = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 text-gray-800">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1 flex flex-col sm:flex-row items-center bg-gradient-to-r from-purple-200 via-white to-orange-200 rounded-2xl shadow-xl p-6 md:p-8 border border-purple-100 gap-4">
            <div className="text-6xl text-orange-400"><FaCoins title="Your Coins" /></div>
            <div className="text-center sm:text-left">
              <div className="text-5xl font-extrabold text-purple-700 mb-1 drop-shadow">1573</div>
              <div className="text-gray-500 text-sm">Last updated: Just now</div>
            </div>
            <button className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-orange-400 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition font-bold text-lg flex items-center justify-center gap-2">
              <FaGift className="text-xl" />Collect Daily Bonus
            </button>
          </div>
          <div className="w-full md:w-80 bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
            <div className="font-bold text-lg text-purple-700 mb-4 flex items-center gap-2">
              <FaHistory className="text-orange-400" />Recent Transactions
            </div>
            <ul className="space-y-2">
              {transactions.map((t, i) => (
                <li key={i} className="flex justify-between items-center text-sm">
                  <div>
                    <div className={t.type === 'pos' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{t.desc}</div>
                    <div className="text-gray-400 text-xs">{t.date}</div>
                  </div>
                  <div className={t.type === 'pos' ? 'text-green-600' : 'text-red-600'}>{t.amount}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold mb-6 text-purple-700">Tasks to Earn More Coins</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {tasks.map((task, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-xl p-4 flex flex-col justify-between border-2 border-purple-100 hover:border-orange-300 hover:shadow-2xl transition-all duration-300">
                  <div>
                    {task.icon ? (
                      <div className="flex justify-center items-center h-32 mb-4">{task.icon}</div>
                    ) : (
                      <img src={task.image} alt="task" className="h-32 w-full object-cover rounded-xl mb-4" />
                    )}
                    <div className="font-bold text-purple-700 mb-1 text-lg">{task.title}</div>
                    <div className="text-gray-600 text-sm mb-2">{task.desc}</div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-orange-500 font-bold flex items-center"><span className="mr-1">🪙</span>{task.coins} Coins</div>
                    <button className="bg-gradient-to-r from-purple-500 to-orange-400 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition font-semibold">Start Task</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-80 bg-white rounded-2xl shadow-xl p-6 h-fit border border-purple-100">
            <div className="font-bold text-lg text-orange-600 mb-4 flex items-center gap-2">
              <FaTrophy className="text-yellow-500" />Coin Leaderboard
            </div>
            <ol className="list-decimal list-inside space-y-2">
              {leaderboard.map((user, i) => (
                <li key={i} className="flex justify-between items-center">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-purple-600 font-bold flex items-center"><span className="mr-1">🪙</span>{user.coins}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* footer rendered globally */}
    </div>
  );
};

export default Coins;
