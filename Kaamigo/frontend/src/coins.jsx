import React, { useState, useEffect } from 'react';
import { FaCoins, FaGift, FaHistory, FaTrophy, FaBookOpen, FaRobot, FaLink, FaUserPlus, FaComments, FaExclamationTriangle } from 'react-icons/fa';
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

const Coins = () => {
  const [coins, setCoins] = useState(1573);
  const [transactions, setTransactions] = useState([
    { id: 1, desc: 'Completed Daily Quiz', date: '2024-07-01', amount: '+15', type: 'pos', timestamp: Date.now() - 1000 * 60 * 5 },
    { id: 2, desc: 'Purchased Premium Article Access', date: '2024-06-28', amount: '-120', type: 'neg', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3 },
    { id: 3, desc: "Finished 'Introduction to React'", date: '2024-06-27', amount: '+80', type: 'pos', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4 },
    { id: 4, desc: 'Logged in daily bonus', date: '2024-06-27', amount: '+10', type: 'pos', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4 },
    { id: 5, desc: 'Unlocked Advanced Algorithms course', date: '2024-06-26', amount: '-250', type: 'neg', timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5 },
  ]);
  const [leaderboard, setLeaderboard] = useState([
    { name: 'Alice Smith', coins: 8750, change: '+150' },
    { name: 'Bob Johnson', coins: 7920, change: '+80' },
    { name: 'Charlie Brown', coins: 7100, change: '+200' },
    { name: 'Diana Prince', coins: 6540, change: '-50' },
    { name: 'Eve Adams', coins: 5890, change: '+120' },
    { name: 'Frank White', coins: 5310, change: '+90' },
  ]);
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [canCollectDailyBonus, setCanCollectDailyBonus] = useState(true);
  const [completedTasks, setCompletedTasks] = useState(new Set());

  // Check if daily bonus can be collected
  useEffect(() => {
    const lastBonusTime = localStorage.getItem('lastDailyBonus');
    if (lastBonusTime) {
      const timeDiff = Date.now() - parseInt(lastBonusTime);
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      setCanCollectDailyBonus(hoursDiff >= 24);
    }
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update last updated time
      setLastUpdated('Just now');
      
      // Simulate new transactions
      const newTransaction = {
        id: Date.now(),
        desc: 'Daily Login Bonus',
        date: new Date().toISOString().split('T')[0],
        amount: '+5',
        type: 'pos',
        timestamp: Date.now()
      };
      
      setTransactions(prev => [newTransaction, ...prev.slice(0, 4)]);
      
      // Update coins
      setCoins(prev => prev + 5);
      
      // Update leaderboard
      setLeaderboard(prev => prev.map(user => ({
        ...user,
        coins: user.coins + Math.floor(Math.random() * 10),
        change: `+${Math.floor(Math.random() * 50)}`
      })));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleDailyBonus = () => {
    if (!canCollectDailyBonus) {
      alert('Daily bonus already collected! Come back in 24 hours.');
      return;
    }
    
    const bonus = 50;
    setCoins(prev => prev + bonus);
    setCanCollectDailyBonus(false);
    
    // Store the time when bonus was collected
    localStorage.setItem('lastDailyBonus', Date.now().toString());
    
    const newTransaction = {
      id: Date.now(),
      desc: 'Daily Bonus Collected',
      date: new Date().toISOString().split('T')[0],
      amount: `+${bonus}`,
      type: 'pos',
      timestamp: Date.now()
    };
    
    setTransactions(prev => [newTransaction, ...prev.slice(0, 4)]);
    setLastUpdated('Just now');
    
    alert(`Daily bonus collected! +${bonus} coins. Total: ${coins + bonus} coins`);
  };

  const handleTaskComplete = (taskTitle, taskCoins) => {
    if (completedTasks.has(taskTitle)) {
      alert('This task has already been completed!');
      return;
    }
    
    setCoins(prev => prev + taskCoins);
    setCompletedTasks(prev => new Set([...prev, taskTitle]));
    
    const newTransaction = {
      id: Date.now(),
      desc: `Task Completed: ${taskTitle}`,
      date: new Date().toISOString().split('T')[0],
      amount: `+${taskCoins}`,
      type: 'pos',
      timestamp: Date.now()
    };
    
    setTransactions(prev => [newTransaction, ...prev.slice(0, 4)]);
    setLastUpdated('Just now');
    
    alert(`Task "${taskTitle}" completed! +${taskCoins} coins earned.`);
  };

  const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 text-gray-800">
      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 text-center">
        <div className="flex items-center justify-center gap-2 text-lg font-semibold">
          <FaExclamationTriangle className="text-xl" />
          🪙 Coin Redemption Coming Soon! 🪙
        </div>
        <p className="text-sm mt-1 opacity-90">
          We're working hard to bring you the ability to redeem your coins for rewards. Stay tuned!
        </p>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1 flex flex-col sm:flex-row items-center bg-gradient-to-r from-purple-200 via-white to-orange-200 rounded-2xl shadow-xl p-6 md:p-8 border border-purple-100 gap-4">
            <div className="text-6xl text-orange-400"><FaCoins title="Your Coins" /></div>
            <div className="text-center sm:text-left">
              <div className="text-5xl font-extrabold text-purple-700 mb-1 drop-shadow">{coins}</div>
              <div className="text-gray-500 text-sm">Last updated: {lastUpdated}</div>
            </div>
            <button 
              onClick={handleDailyBonus}
              disabled={!canCollectDailyBonus}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl shadow-lg transition font-bold text-lg flex items-center justify-center gap-2 ${
                canCollectDailyBonus 
                  ? 'bg-gradient-to-r from-purple-500 to-orange-400 text-white hover:scale-105' 
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              <FaGift className="text-xl" />
              {canCollectDailyBonus ? 'Collect Daily Bonus' : 'Already Collected'}
            </button>
          </div>
          <div className="w-full md:w-80 bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
            <div className="font-bold text-lg text-purple-700 mb-4 flex items-center gap-2">
              <FaHistory className="text-orange-400" />Recent Transactions
            </div>
            <ul className="space-y-2">
              {transactions.map((t) => (
                <li key={t.id} className="flex justify-between items-center text-sm">
                  <div>
                    <div className={t.type === 'pos' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{t.desc}</div>
                    <div className="text-gray-400 text-xs">{formatTimeAgo(t.timestamp)}</div>
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
                    <button 
                      onClick={() => handleTaskComplete(task.title, task.coins)}
                      disabled={completedTasks.has(task.title)}
                      className={`px-4 py-2 rounded-lg shadow transition font-semibold ${
                        completedTasks.has(task.title)
                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-500 to-orange-400 text-white hover:scale-105'
                      }`}
                    >
                      {completedTasks.has(task.title) ? 'Completed' : 'Complete Task'}
                    </button>
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
                  <div className="text-right">
                    <div className="text-purple-600 font-bold flex items-center"><span className="mr-1">🪙</span>{user.coins}</div>
                    <div className={`text-xs ${user.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {user.change}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="text-xs text-gray-500 mt-3 text-center">
              Updates every 30 seconds
            </div>
          </div>
        </div>
      </div>

      {/* footer rendered globally */}
    </div>
  );
};

export default Coins;
