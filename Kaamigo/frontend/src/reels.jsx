import React, { useState, useEffect } from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import {
  FaVideo,
  FaBriefcase,
  FaUserAlt,
  FaCrown,
  FaQuestion,
  FaRocket,
  FaPlay,
  FaHeart,
  FaComment,
  FaShare,
  FaUser,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import styles from "./reels.module.css";
import ReelUpload from "./components/ReelUpload";
import ReelModal from "./components/ReelModal";

const Reels = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userProfiles, setUserProfiles] = useState({});

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [reels, setReels] = useState([]);

  const categories = [
    "All",
    "Design",
    "Development",
    "Multimedia",
    "Writing",
    "Marketing",
    "Admin Support",
    "Consulting",
    "Finance",
    "Data Science",
  ];

  const fetchReels = async () => {
    try {
      const q = query(collection(db, "reels"), orderBy("created_at", "desc"));
      const querySnapshot = await getDocs(q);
      const reelsData = [];
      querySnapshot.forEach((doc) => {
        reelsData.push({ id: doc.id, ...doc.data() });
      });
      // console.log("Fetched reels:", reelsData); // Removed console.log to prevent data leak
      if (reelsData.length === 0) {
        // Fallback dummy reels to demonstrate UI when no content present
        setReels([
          {
            id: "demo-1",
            title: "Sample Design Reel",
            description: "A short showcase of UI animations",
            category: "Design",
            tags: ["ui", "animation"],
            user_id: "demo-user-1",
            thumbnail_url: "https://via.placeholder.com/400x700?text=Design+Reel",
            video_url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
            likes: 0,
            shares: 0,
            comments: [],
            created_at: new Date().toISOString(),
          },
          {
            id: "demo-2",
            title: "Web Development Showcase",
            description: "Building responsive web applications",
            category: "Development",
            tags: ["web", "react", "responsive"],
            user_id: "demo-user-2",
            thumbnail_url: "https://via.placeholder.com/400x700?text=Web+Dev",
            video_url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
            likes: 0,
            shares: 0,
            comments: [],
            created_at: new Date().toISOString(),
          },
        ]);
      } else {
        setReels(reelsData);
      }

      // Fetch user profiles for all reels
      const uniqueUserIds = [...new Set(reelsData.map((reel) => reel.user_id))];
      for (const userId of uniqueUserIds) {
        if (userId) await fetchUserProfile(userId);
      }
    } catch (error) {
      console.error("Error fetching reels:", error);
      setReels([]);
    }
  };

  // Function to fetch a single user profile
  const fetchUserProfile = async (userId) => {
    if (!userId) return null;

    // If we already have this user's profile
    if (userProfiles[userId]) return userProfiles[userId];

    try {
      // For the current user, use data from auth
      if (auth.currentUser && auth.currentUser.uid === userId) {
        const profile = {
          displayName: auth.currentUser.displayName || "User",
          photoURL: auth.currentUser.photoURL || null,
          username:
            auth.currentUser.email?.split("@")[0] || userId.substring(0, 8),
        };

        setUserProfiles((prev) => ({
          ...prev,
          [userId]: profile,
        }));

        return profile;
      }

      // For demo users, create profile data
      if (userId.startsWith('demo-user')) {
        const profile = {
          displayName: `Demo User ${userId.slice(-1)}`,
          photoURL: null,
          username: `demo${userId.slice(-1)}`,
        };

        setUserProfiles((prev) => ({
          ...prev,
          [userId]: profile,
        }));

        return profile;
      }

      return {
        displayName: "User",
        photoURL: null,
        username: userId.substring(0, 8),
      };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return {
        displayName: "User",
        photoURL: null,
        username: userId.substring(0, 8),
      };
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const openReelModal = (index) => {
    setCurrentReelIndex(index);
    setShowModal(true);
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  };

  const closeReelModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto"; // Restore scrolling
  };

  const handleProfileClick = (userId) => {
    // Navigate to user profile or show user details
    if (userId.startsWith('demo-user')) {
      // For demo users, show a simple profile modal
      alert(`Demo User Profile\nName: ${userProfiles[userId]?.displayName || 'Demo User'}\nUsername: ${userProfiles[userId]?.username || 'demo'}`);
    } else {
      // For real users, navigate to profile page
      navigate(`/explore/profile?uid=${encodeURIComponent(userId)}`);
    }
  };

  const handleLike = (reelId) => {
    setReels(prev => prev.map(reel => 
      reel.id === reelId 
        ? { ...reel, likes: (reel.likes || 0) + 1 }
        : reel
    ));
  };

  const handleShare = (reelId) => {
    setReels(prev => prev.map(reel => 
      reel.id === reelId 
        ? { ...reel, shares: (reel.shares || 0) + 1 }
        : reel
    ));
    alert('Reel shared!');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-50 to-orange-100 font-[Inter]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r shadow-xl p-6 space-y-6 rounded-r-xl">
        <h2 className="text-2xl font-extrabold text-purple-700 mb-6">
          📍 Kaamigo
        </h2>
        <nav className="space-y-3">
          {[
            { label: "Explore", path: "/explore", icon: <LuLayoutDashboard /> },
            { label: "Reels", path: "/explore/reels", icon: <FaVideo /> },
            { label: "Jobs", path: "/explore/jobs", icon: <FaBriefcase /> },
            { label: "Profile", path: "/explore/profile", icon: <FaUserAlt /> },
            {
              label: "Features",
              path: "/explore/features",
              icon: <FaRocket />,
            },
            {
              label: "How it Works",
              path: "/explore/how-it-works",
              icon: <FaQuestion />,
            },
            {
              label: "Premium",
              path: "/explore/featurebtn",
              icon: <FaCrown />,
            },
          ].map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 rounded-lg text-sm font-semibold transition-all duration-300 shadow-sm ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-purple-100 hover:text-purple-800"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-10">
        {/* Discover Categories */}
        <section className="space-y-4 bg-white p-7 rounded-xl shadow-lg border border-purple-100">
          <h2 className="text-3xl font-bold text-purple-600">
            🎯 Discover Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full border transition text-sm font-medium shadow-sm ${
                  selectedCategory === category
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gradient-to-r from-purple-500 to-violet-500 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Featured Reels */}
        <section className="space-y-4 bg-white p-7 rounded-xl shadow-lg border border-purple-100">
          <h2 className="text-3xl font-bold text-purple-600">
            🎥 Featured Reels
          </h2>
          <div className={styles.reelsGrid}>
            {reels
              .filter(
                (r) =>
                  selectedCategory === "All" || r.category === selectedCategory
              )
              .slice(0, 6) // Show only first 6 featured reels
              .map((reel, index) => (
                <div
                  key={reel.id}
                  className={styles.reelCard}
                >
                  {/* Thumbnail */}
                  {reel.thumbnail_url ? (
                    <img
                      src={reel.thumbnail_url}
                      alt={reel.title || "Reel"}
                      className={styles.reelThumbnail}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/400x700?text=Thumbnail+Error";
                      }}
                    />
                  ) : (
                    <div className={styles.fallbackContainer}>
                      <span className="text-gray-500 text-sm">
                        No Thumbnail
                      </span>
                    </div>
                  )}

                  {/* Play icon overlay */}
                  <div className={styles.playOverlay}>
                    <div className={styles.playButton} onClick={() => openReelModal(index)}>
                      <FaPlay className="text-white text-2xl" />
                    </div>
                  </div>

                  {/* Bottom gradient overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent opacity-80"></div>

                  {/* Video info overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white z-10">
                    <h3 className="font-medium text-sm truncate">
                      {reel.title || "Untitled Reel"}
                    </h3>

                    {/* User info */}
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProfileClick(reel.user_id);
                        }}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                      >
                        {userProfiles[reel.user_id]?.photoURL ? (
                          <img
                            src={userProfiles[reel.user_id]?.photoURL}
                            alt={
                              userProfiles[reel.user_id]?.displayName || "User"
                            }
                            className="w-5 h-5 rounded-full object-cover cursor-pointer"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                userProfiles[reel.user_id]?.displayName || "User"
                              )}&size=40&background=8B5CF6&color=fff`;
                            }}
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-orange-400 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
                            {userProfiles[reel.user_id]?.displayName?.charAt(0) || "U"}
                          </div>
                        )}
                        <span className="text-xs opacity-90">
                          {userProfiles[reel.user_id]?.displayName || "User"}
                        </span>
                      </button>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(reel.id);
                        }}
                        className="flex items-center gap-1 text-xs hover:text-red-400 transition-colors"
                      >
                        <FaHeart className="text-sm" />
                        {reel.likes || 0}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openReelModal(index);
                        }}
                        className="flex items-center gap-1 text-xs hover:text-blue-400 transition-colors"
                      >
                        <FaComment className="text-sm" />
                        {reel.comments?.length || 0}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(reel.id);
                        }}
                        className="flex items-center gap-1 text-xs hover:text-green-400 transition-colors"
                      >
                        <FaShare className="text-sm" />
                        {reel.shares || 0}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Upload Reels */}
        <ReelUpload onUploadSuccess={fetchReels} />

        {/* Featured Reels for Pro Users */}
        <section className="bg-white p-7 rounded-xl shadow-lg border border-purple-100 space-y-4">
          <h2 className="text-3xl font-bold text-purple-600">
            👑 Featured Reels (Pro Users)
          </h2>
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto px-2 pb-2 scrollbar-thin scrollbar-thumb-purple-400">
              {reels
                .filter(reel => userProfiles[reel.user_id]?.isPro || userProfiles[reel.user_id]?.subscription === 'pro')
                .slice(0, 7)
                .map((reel, i) => (
                  <div
                    key={reel.id}
                    className="text-center space-y-2 min-w-[120px] shadow rounded-lg p-4 bg-gradient-to-br from-purple-50 to-orange-50 border-2 border-purple-200 hover:shadow-xl transition cursor-pointer"
                    onClick={() => openReelModal(reels.indexOf(reel))}
                  >
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-orange-400 rounded-full shadow-inner flex items-center justify-center text-white font-bold text-lg relative">
                      {userProfiles[reel.user_id]?.displayName?.charAt(0) || 'P'}
                      <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs px-1 py-0.5 rounded-full">PRO</div>
                    </div>
                    <p className="font-medium text-sm">{userProfiles[reel.user_id]?.displayName || 'Pro User'}</p>
                    <p className="text-xs text-gray-500">{reel.category || 'Content'}</p>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-xs text-gray-600">4.{i + 2}</span>
                    </div>
                  </div>
                ))}
              {reels.filter(reel => userProfiles[reel.user_id]?.isPro || userProfiles[reel.user_id]?.subscription === 'pro').length === 0 && (
                <div className="text-center text-gray-500 py-8 w-full">
                  No featured reels from pro users yet.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Freelancers (Nearby) */}
        <section className="bg-white p-7 rounded-xl shadow-lg border border-purple-100 space-y-4">
          <h2 className="text-3xl font-bold text-orange-500">
            🌟 Featured Freelancers Nearby (10km)
          </h2>
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto px-2 pb-2 scrollbar-thin scrollbar-thumb-purple-400">
              {Array(7)
                .fill()
                .map((_, i) => (
                  <div
                    key={i}
                    className="text-center space-y-2 min-w-[120px] shadow rounded-lg p-4 bg-gradient-to-br from-white to-gray-50 border border-purple-100 hover:shadow-xl transition"
                  >
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-orange-400 rounded-full shadow-inner flex items-center justify-center text-white font-bold text-lg">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <p className="font-medium text-sm">Freelancer #{i + 1}</p>
                    <p className="text-xs text-gray-500">Web Developer</p>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-xs text-gray-600">4.{i + 2}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* All Reels Grid */}
        <section className="space-y-4 bg-white p-7 rounded-xl shadow-lg border border-purple-100">
          <h2 className="text-3xl font-bold text-purple-600">
            🎥 All Reels
          </h2>
          <div className={styles.reelsGrid}>
            {reels
              .filter(
                (r) =>
                  selectedCategory === "All" || r.category === selectedCategory
              )
              .map((reel, index) => (
                <div
                  key={reel.id}
                  className={styles.reelCard}
                >
                  {/* Thumbnail */}
                  {reel.thumbnail_url ? (
                    <img
                      src={reel.thumbnail_url}
                      alt={reel.title || "Reel"}
                      className={styles.reelThumbnail}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/400x700?text=Thumbnail+Error";
                      }}
                    />
                  ) : (
                    <div className={styles.fallbackContainer}>
                      <span className="text-gray-500 text-sm">
                        No Thumbnail
                      </span>
                    </div>
                  )}

                  {/* Play icon overlay */}
                  <div className={styles.playOverlay}>
                    <div className={styles.playButton} onClick={() => openReelModal(index)}>
                      <FaPlay className="text-white text-2xl" />
                    </div>
                  </div>

                  {/* Bottom gradient overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent opacity-80"></div>

                  {/* Video info overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white z-10">
                    <h3 className="font-medium text-sm truncate">
                      {reel.title || "Untitled Reel"}
                    </h3>

                    {/* User info */}
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProfileClick(reel.user_id);
                        }}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                      >
                        {userProfiles[reel.user_id]?.photoURL ? (
                          <img
                            src={userProfiles[reel.user_id]?.photoURL}
                            alt={
                              userProfiles[reel.user_id]?.displayName || "User"
                            }
                            className="w-5 h-5 rounded-full object-cover cursor-pointer"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                userProfiles[reel.user_id]?.displayName || "User"
                              )}&background=random`;
                            }}
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs cursor-pointer">
                            {(
                              (userProfiles[reel.user_id]?.displayName ||
                                "U")[0] || "U"
                            ).toUpperCase()}
                          </div>
                        )}
                        <span className="text-xs truncate">
                          {userProfiles[reel.user_id]?.username ||
                            userProfiles[reel.user_id]?.displayName ||
                            (reel.user_id
                              ? `User ${reel.user_id.substring(0, 4)}`
                              : "Unknown User")}
                        </span>
                      </button>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(reel.id);
                        }}
                        className="flex items-center gap-1 text-xs hover:text-red-400 transition-colors"
                      >
                        <FaHeart className="text-sm" />
                        {reel.likes || 0}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openReelModal(index);
                        }}
                        className="flex items-center gap-1 text-xs hover:text-blue-400 transition-colors"
                      >
                        <FaComment className="text-sm" />
                        {reel.comments?.length || 0}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(reel.id);
                        }}
                        className="flex items-center gap-1 text-xs hover:text-green-400 transition-colors"
                      >
                        <FaShare className="text-sm" />
                        {reel.shares || 0}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>



        {/* Reel Modal */}
        <AnimatePresence>
          <ReelModal
            showModal={showModal}
            currentReelIndex={currentReelIndex}
            setCurrentReelIndex={setCurrentReelIndex}
            reels={reels}
            selectedCategory={selectedCategory}
            userProfiles={userProfiles}
            onClose={closeReelModal}
            onProfileClick={handleProfileClick}
          />
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Reels;
