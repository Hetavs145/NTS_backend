import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { FiLogOut } from 'react-icons/fi';

// Dynamic styling for active nav links
const navLinkClass = ({ isActive }) =>
  `py-2 px-3 rounded transition-colors duration-300 font-medium ${
    isActive
      ? 'text-purple-700 border-b-4 border-purple-500 '
      : 'hover:text-orange-500 hover:bg-orange-50 text-gray-800'
  }`;

// Navbar Component
const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsSignedIn(!!currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="flex flex-wrap items-center justify-between px-6 md:px-8 py-4 md:py-6 border-b shadow-sm bg-indigo-50 transition-all duration-300">
      {/* Logo */}
      <NavLink to="/" className="text-2xl md:text-3xl font-bold text-purple-700 hover:text-purple-800 transition-colors duration-300 cursor-pointer">
        Kaamigo
      </NavLink>

      {/* Navigation links */}
      <div className="hidden md:flex flex-wrap space-x-2 text-base font-medium">
        <NavLink to="/" className={navLinkClass} end>Home</NavLink>
        <span className="py-2 px-3 text-gray-500 cursor-not-allowed">Explore</span>
        <NavLink to="/about" className={navLinkClass}>About Us</NavLink>
        <NavLink to="/partners" className={navLinkClass}>Partners</NavLink>
        <NavLink to="/coins" className={navLinkClass}>Coins</NavLink>
        <NavLink to="/contact" className={navLinkClass}>Contact Us</NavLink>
        <NavLink to="/blog" className={navLinkClass}>Blog</NavLink>
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center space-x-4 mt-4 md:mt-0">
        {!isSignedIn ? (
          <>
            <NavLink to="/login" className="text-base font-medium text-gray-700 hover:text-orange-500 transition-colors duration-300 py-2 px-4 rounded hover:bg-orange-50">
              Login
            </NavLink>
            <NavLink to="/sign" className="bg-purple-600 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Sign Up
            </NavLink>
          </>
        ) : (
          <>
            <div className="text-sm text-gray-700 font-medium hidden md:inline">
              Hi, {user?.displayName || user?.email || 'User'}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-md transition-colors duration-300 text-sm font-medium"
            >
              <FiLogOut className="text-lg" /> Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

// Landing Page
const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-100 to-orange-50 py-24 md:py-32 text-center px-4 sm:px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 animate-pulse">
          Reels Bhi. Rozgaar Bhi.
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
          Your voice-first, reels-powered platform connecting talent with opportunities in Tier 2/3 India.
        </p>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row justify-center mb-8 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search for gigs or workers..."
            className="w-full px-6 py-4 border-2 border-purple-200 rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none focus:outline-none focus:border-purple-500 transition-colors duration-300 text-lg"
          />
          <button className="bg-purple-600 text-white px-8 py-4 rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Search
          </button>
        </div>

        {/* Call-to-action Buttons */}
        <div className="flex justify-center flex-wrap gap-4">
          <button onClick={() => navigate('/coming-soon')} className="bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg">
            📥 Download the App
          </button>
          <button className="border-2 border-purple-600 text-purple-700 px-8 py-4 rounded-lg hover:bg-purple-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg">
            Join as a Freelancer / Client
          </button>
        </div>
      </div>

      {/* Additional sections here... */}
    </div>
  );
};

export default LandingPage;
export { Navbar };
