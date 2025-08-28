import React, { useState, useRef, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { motion } from "framer-motion";
import styles from "../reels.module.css";

const ReelModal = ({
  showModal,
  currentReelIndex,
  setCurrentReelIndex,
  reels,
  selectedCategory,
  userProfiles,
  onClose,
  onShare,
  onProfileClick,
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const [likedReels, setLikedReels] = useState({});
  const [commentInput, setCommentInput] = useState("");
  const [commentingReelId, setCommentingReelId] = useState(null);
  const [loadingVideos, setLoadingVideos] = useState({});
  const [isPlaying, setIsPlaying] = useState(true);
  const [ratingInput, setRatingInput] = useState(0);

  const videoRefs = useRef({});
  const modalContainerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const [updatedReels, setUpdatedReels] = useState(reels);
  
  const filteredReels = updatedReels.filter(
    (r) => selectedCategory === "All" || r.category === selectedCategory
  );

  // Reset comment state when modal opens
  useEffect(() => {
    if (showModal) {
      setCommentingReelId(null);
      setCommentInput("");
    }
  }, [showModal]);

  // Format count numbers (1K, 1M, etc)
  const formatCount = (count) => {
    if (!count && count !== 0) return 0;
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K`;
    } else {
      return count.toString();
    }
  };

  // Handle scroll to detect current video in view
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;

    // Calculate which video is currently most visible
    const newIndex = Math.round(scrollTop / containerHeight);

    if (
      newIndex !== currentReelIndex &&
      newIndex >= 0 &&
      newIndex < filteredReels.length
    ) {
      // Pause previous video
      if (videoRefs.current[`modal-${currentReelIndex}`]) {
        videoRefs.current[`modal-${currentReelIndex}`].pause();
      }

      setCurrentReelIndex(newIndex);
      setIsPlaying(true);

      // Play new current video
      setTimeout(() => {
        const currentVideo = videoRefs.current[`modal-${newIndex}`];
        if (currentVideo) {
          currentVideo.muted = isMuted;
          currentVideo.currentTime = 0;
          currentVideo.play().catch(console.error);
        }
      }, 100);
    }
  };

  const closeReelModal = () => {
    onClose();
    document.body.style.overflow = "auto";

    // Reset comment state
    setCommentingReelId(null);
    setCommentInput("");

    // Pause all videos
    Object.values(videoRefs.current).forEach((video) => {
      if (video && typeof video.pause === "function") {
        video.pause();
      }
    });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);

    // Apply mute state to current video
    if (videoRefs.current[`modal-${currentReelIndex}`]) {
      videoRefs.current[`modal-${currentReelIndex}`].muted = !isMuted;
    }
  };

  const togglePlayPause = () => {
    const currentVideo = videoRefs.current[`modal-${currentReelIndex}`];

    if (!currentVideo) return;

    if (isPlaying) {
      currentVideo.pause();
      setIsPlaying(false);
    } else {
      currentVideo.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleLikeReel = async (reelId) => {
    if (!auth.currentUser) {
      alert("Please login to like reels");
      return;
    }

    setLikedReels((prev) => {
      const newState = { ...prev };
      newState[reelId] = !prev[reelId];
      return newState;
    });

    // Update Firestore
    try {
      const reelDocRef = doc(db, "reels", reelId);
      await updateDoc(reelDocRef, {
        likes: increment(likedReels[reelId] ? -1 : 1),
      });
    } catch (err) {
      console.error("Failed to update like count in Firestore", err);
    }
  };

  const handleCommentSubmit = async (reelId) => {
    if (!auth.currentUser) {
      alert("Please login to comment");
      return Promise.reject("Not logged in");
    }
    if (!commentInput.trim()) return Promise.reject("Empty comment");

    try {
      const reelDocRef = doc(db, "reels", reelId);
      await updateDoc(reelDocRef, {
        comments: arrayUnion({
          user: auth.currentUser.uid,
          text: commentInput,
          created_at: new Date().toISOString(),
        }),
      });
      setCommentInput("");
      setCommentingReelId(null);
      return Promise.resolve("Comment added successfully");
    } catch (err) {
      alert("Failed to add comment");
      return Promise.reject(err);
    }
  };

  const handleRateReel = async (reelId) => {
    if (!auth.currentUser) {
      alert("Please login to rate reels");
      return;
    }
    if (!ratingInput || ratingInput < 1 || ratingInput > 5) return;
    try {
      const reelDocRef = doc(db, "reels", reelId);
      await updateDoc(reelDocRef, {
        ratingCount: increment(1),
        ratingTotal: increment(ratingInput),
      });
      setRatingInput(0);
      alert("Thanks for your rating!");
    } catch (err) {
      console.error("Failed to rate reel", err);
    }
  };

  const handleShareReel = async (reelId) => {
    const url = `${window.location.origin}/explore/reels?id=${reelId}`;
    navigator.clipboard.writeText(url);
    alert("Reel link copied to clipboard!");
    
    // Update share count in Firestore
    try {
      const reelDocRef = doc(db, "reels", reelId);
      await updateDoc(reelDocRef, {
        shares: increment(1),
      });
      
      // Update local state to reflect the share count immediately
      const updatedReels = filteredReels.map(reel => {
        if (reel.id === reelId) {
          return {
            ...reel,
            shares: (reel.shares || 0) + 1
          };
        }
        return reel;
      });
      
      // Update the state in the parent component if callback exists
      if (onShare) {
        onShare(updatedReels);
      } else {
        // Otherwise update local state
        setUpdatedReels(updatedReels);
      }
    } catch (err) {
      console.error("Failed to update share count in Firestore", err);
    }
  };

  // Update local reels state when reels prop changes
  useEffect(() => {
    setUpdatedReels(reels);
  }, [reels]);

  // Scroll to the current reel when modal opens or currentReelIndex changes
  useEffect(() => {
    if (showModal && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const targetScrollTop = currentReelIndex * container.clientHeight;

      container.scrollTo({
        top: targetScrollTop,
        behavior: "smooth",
      });
    }
  }, [showModal, currentReelIndex]);

  // Auto-play current video
  useEffect(() => {
    if (showModal) {
      // Pause all videos first
      Object.values(videoRefs.current).forEach((videoRef) => {
        if (videoRef && typeof videoRef.pause === "function") {
          videoRef.pause();
        }
      });

      // Play current video
      const currentVideo = videoRefs.current[`modal-${currentReelIndex}`];
      if (currentVideo) {
        currentVideo.muted = isMuted;
        currentVideo.currentTime = 0;
        setIsPlaying(true);

        setTimeout(() => {
          currentVideo.play().catch((err) => {
            console.log("Autoplay prevented:", err);
          });
        }, 100);
      }
    }
  }, [showModal, currentReelIndex, isMuted]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!showModal) return;

    const handleKeyDown = (e) => {
      // If comments are open, Escape should close comments first
      if (e.key === "Escape") {
        if (commentingReelId) {
          setCommentingReelId(null);

          // Resume video playback after closing comments
          setTimeout(() => {
            const currentVideo = videoRefs.current[`modal-${currentReelIndex}`];
            if (currentVideo) {
              setIsPlaying(true);
              currentVideo
                .play()
                .catch((err) => console.error("Failed to play video:", err));
            }
          }, 50);
        } else {
          closeReelModal();
        }
      } else if (e.key === "m" || e.key === "M") {
        toggleMute();
      } else if (
        e.key === "ArrowUp" &&
        currentReelIndex > 0 &&
        !commentingReelId
      ) {
        setCurrentReelIndex(currentReelIndex - 1);
      } else if (
        e.key === "ArrowDown" &&
        currentReelIndex < filteredReels.length - 1 &&
        !commentingReelId
      ) {
        setCurrentReelIndex(currentReelIndex + 1);
      } else if (e.key === " " && !commentingReelId) {
        // Spacebar
        togglePlayPause();
        e.preventDefault(); // Prevent page scrolling
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal, currentReelIndex, filteredReels.length, commentingReelId]);

  if (!showModal) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50"
      ref={modalContainerRef}
    >
      {/* Close button */}
      <button
        onClick={closeReelModal}
        className="fixed top-6 right-6 z-50 text-white bg-black bg-opacity-50 backdrop-blur-sm p-2 rounded-full hover:bg-opacity-70 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-xl"
        aria-label="Close"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Progress bar (at top) */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-black z-50">
        <div className="flex w-full">
          {filteredReels.map((_, index) => (
            <div
              key={index}
              className="h-1 transition-all duration-300 relative"
              style={{
                width: `${100 / filteredReels.length}%`,
                backgroundColor:
                  index < currentReelIndex
                    ? "white"
                    : "rgba(255, 255, 255, 0.3)",
              }}
            >
              {index === currentReelIndex && (
                <div className="absolute inset-0 bg-blue-500 animate-progressBar"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable container for reels */}
      <div
        ref={scrollContainerRef}
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        onScroll={handleScroll}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {filteredReels.map((reel, index) => (
          <div
            key={reel.id}
            className="relative w-full h-screen flex items-center justify-center snap-start"
            style={{ minHeight: "100vh" }}
          >
            {/* Video - Using exact YouTube Shorts proportions */}
            <div className="relative w-full h-full max-w-[412px] bg-black flex items-center justify-center overflow-hidden shadow-2xl">
              {/* Swipe indicator (only shows on first video) */}
              {index === 0 && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-20 z-40 flex flex-col items-center animate-fadeInOut">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="animate-bounce"
                  >
                    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path>
                  </svg>
                  <span className="text-white text-xs font-medium mt-1">
                    Swipe up for next video
                  </span>
                </div>
              )}
              {reel.video_url ? (
                <div className="relative w-full h-full">
                  <video
                    ref={(el) => {
                      videoRefs.current[`modal-${index}`] = el;
                    }}
                    src={reel.video_url}
                    className="w-full h-full object-cover"
                    muted={isMuted}
                    playsInline
                    loop
                    onLoadStart={() => {
                      setLoadingVideos((prev) => ({
                        ...prev,
                        [reel.id]: true,
                      }));
                    }}
                    onCanPlay={() => {
                      setLoadingVideos((prev) => ({
                        ...prev,
                        [reel.id]: false,
                      }));
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlayPause();
                    }}
                    onError={(e) => {
                      console.error("Video failed to load:", reel.video_url);
                      setLoadingVideos((prev) => ({
                        ...prev,
                        [reel.id]: false,
                      }));
                    }}
                  />

                  {/* Loading overlay */}
                  {loadingVideos[reel.id] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-3"></div>
                        <span className="text-white text-sm font-medium">
                          Loading...
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Play/Pause overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    onClick={togglePlayPause}
                  >
                    {!isPlaying && (
                      <div className="w-20 h-20 rounded-full bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center transition-all duration-300">
                        <svg
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                          fill="white"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Tap areas for play/pause and navigation */}
                  <div className="absolute inset-0" onClick={togglePlayPause}>
                    <div className="w-full h-full flex">
                      <div
                        className="w-1/3 h-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (currentReelIndex > 0) {
                            setCurrentReelIndex(currentReelIndex - 1);
                          }
                        }}
                      ></div>
                      <div
                        className="w-1/3 h-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlayPause();
                        }}
                      ></div>
                      <div
                        className="w-1/3 h-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (currentReelIndex < filteredReels.length - 1) {
                            setCurrentReelIndex(currentReelIndex + 1);
                          }
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="text-white text-lg font-medium">
                      Video unavailable
                    </span>
                    <p className="text-gray-400 text-sm mt-2">
                      This content cannot be displayed
                    </p>
                  </div>
                </div>
              )}

              {/* Right side action bar - Simplified version */}
              <div className="absolute right-3 bottom-24 flex flex-col items-center gap-6 z-30">
                {/* User avatar */}
                <div className="group">
                  <div className="relative w-12 h-12">
                    {userProfiles[reel.user_id]?.photoURL ? (
                      <img
                        src={userProfiles[reel.user_id]?.photoURL}
                        alt={userProfiles[reel.user_id]?.displayName || "User"}
                        className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-lg group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            userProfiles[reel.user_id]?.displayName || "User"
                          )}&background=random`;
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full border-2 border-white bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-105">
                        {(
                          (userProfiles[reel.user_id]?.displayName || "U")[0] ||
                          "U"
                        ).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Like button */}
                <div className="flex flex-col items-center group">
                  <button
                    className={`relative p-3 rounded-full transition-all duration-300 ${
                      likedReels[reel.id]
                        ? "bg-white bg-opacity-10"
                        : "bg-transparent"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeReel(reel.id);
                    }}
                    aria-label="Like"
                  >
                    {likedReels[reel.id] ? (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="#ff4057"
                        className="transition-all duration-300"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    ) : (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        className="transition-all duration-300"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    )}
                  </button>
                  <span className="text-white text-xs font-medium mt-1.5">
                    {formatCount(reel.likes || 0)}
                  </span>
                </div>

                {/* Comment button */}
                <div className="flex flex-col items-center group">
                  <button
                    className="p-3 rounded-full bg-transparent transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCommentingReelId(reel.id);
                    }}
                    aria-label="Comments"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      className="transition-all duration-300"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </button>
                  <span className="text-white text-xs font-medium mt-1.5">
                    {formatCount(
                      Array.isArray(reel.comments) ? reel.comments.length : 0
                    )}
                  </span>
                </div>

                {/* Share button */}
                <div className="flex flex-col items-center group">
                  <button
                    className="p-3 rounded-full bg-transparent transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareReel(reel.id);
                    }}
                    aria-label="Share"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      className="transition-all duration-300"
                    >
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8h-4v4H8v-4H4z" />
                      <polyline points="16 6 12 2 8 6"></polyline>
                      <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                  </button>
                  <span className="text-white text-xs font-medium mt-1.5">
                    {formatCount(reel.shares || 0)}
                  </span>
                </div>
              </div>

              {/* Sound/Mute button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="absolute bottom-28 right-20 z-40 text-white p-3 rounded-full hover:bg-white/10 transition-all duration-300"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>

              {/* Bottom info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <div className="bg-gradient-to-t from-black via-black/70 to-transparent pt-12 pb-3 px-4 -mx-4 rounded-t-xl">
                  {/* Title */}
                  <h3 className="text-white font-bold text-lg mb-1 line-clamp-2 leading-tight">
                    {reel.title || "Untitled Reel"}
                  </h3>

                  {/* Username with verified badge */}
                  <div className="flex items-center gap-1 mb-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onProfileClick) {
                          onProfileClick(reel.user_id);
                        }
                      }}
                      className="flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <span className="text-white font-medium text-sm">
                        @
                        {userProfiles[reel.user_id]?.username ||
                          userProfiles[reel.user_id]?.displayName ||
                          (reel.user_id
                            ? `user${reel.user_id.substring(0, 4)}`
                            : "unknown")}
                      </span>
                      {/* Verified badge */}
                      {userProfiles[reel.user_id]?.verified && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="white"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-white text-sm opacity-80 mb-3 line-clamp-2">
                    {reel.description ||
                      "No description available for this reel."}
                  </p>

                  {/* Tags */}
                  {reel.tags && reel.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3 overflow-x-auto scrollbar-hide whitespace-nowrap">
                      {reel.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-blue-400 text-xs font-medium hover:underline cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Comment input modal */}
            {commentingReelId === reel.id && (
              <div
                className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-40 flex flex-col"
                onClick={(e) => {
                  // Close comments when clicking outside the comments area
                  if (e.target === e.currentTarget) {
                    setCommentingReelId(null);
                  }
                }}
              >
                <div className="w-full flex justify-between items-center p-4 border-b border-white/10">
                  <h3 className="text-white font-bold text-lg">
                    Comments (
                    {Array.isArray(reel.comments) ? reel.comments.length : 0})
                  </h3>
                  <button
                    onClick={() => {
                      setCommentingReelId(null);

                      // Resume the video playback
                      setTimeout(() => {
                        const currentVideo =
                          videoRefs.current[`modal-${currentReelIndex}`];
                        if (currentVideo) {
                          setIsPlaying(true);
                          currentVideo
                            .play()
                            .catch((err) =>
                              console.error("Failed to play video:", err)
                            );
                        }
                      }, 50);
                    }}
                    className="p-2 hover:bg-white/10 rounded-full transition-all duration-200"
                    aria-label="Close comments"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Comments list would go here */}
                <div className="flex-1 overflow-y-auto p-4">
                  {Array.isArray(reel.comments) && reel.comments.length > 0 ? (
                    reel.comments.map((comment, i) => (
                      <div key={i} className="flex gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex-shrink-0"></div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">
                              {userProfiles[comment.user]?.displayName ||
                                "User"}
                            </span>
                            <span className="text-gray-400 text-xs">
                              {new Date(
                                comment.created_at
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-white text-sm mt-1">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <span className="text-gray-400">
                        No comments yet. Be the first to comment!
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-white/10 bg-black">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      // After handling the comment submission, resume playback
                      handleCommentSubmit(reel.id).then(() => {
                        // Resume the video playback after comment is posted
                        setTimeout(() => {
                          const currentVideo =
                            videoRefs.current[`modal-${currentReelIndex}`];
                          if (currentVideo) {
                            setIsPlaying(true);
                            currentVideo
                              .play()
                              .catch((err) =>
                                console.error("Failed to play video:", err)
                              );
                          }
                        }, 50);
                      });
                    }}
                    className="flex gap-3"
                  >
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-3 rounded-full border-none bg-white bg-opacity-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={!commentInput.trim()}
                      className="px-5 py-3 bg-blue-600 text-white rounded-full font-medium disabled:opacity-50"
                    >
                      Post
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        @keyframes heartPulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        @keyframes progressBar {
          0% {
            width: 0;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        .animate-progressBar {
          animation: progressBar 15s linear forwards;
        }

        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }

        .animate-fadeInOut {
          animation: fadeInOut 3s ease-in-out forwards;
          animation-delay: 1s;
        }

        .animate-bounce {
          animation: bounce 1s infinite;
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .heart-pulse {
          animation: heartPulse 0.6s ease-in-out;
        }

        .fade-in-up {
          animation: fadeInUp 0.5s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .glass-effect {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
      `}</style>
    </motion.div>
  );
};

export default ReelModal;
