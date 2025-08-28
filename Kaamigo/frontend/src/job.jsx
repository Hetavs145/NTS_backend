import React, { useState, useEffect, useMemo } from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import {
  FaVideo,
  FaBriefcase,
  FaUserAlt,
  FaCrown,
  FaQuestion,
  FaRocket,
  FaMicrophone,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import PostGigModal from "./postgig";
import PostJobModal from "./PostJobModal";
import ApplyGigModal from "./ApplyGigModal";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;

export default function Jobs() {
  const [showModal, setShowModal] = useState(false);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [showModal]);

  const [gigs, setGigs] = useState([]);

  // Fetch jobs from Firebase
  useEffect(() => {
    async function fetchJobs() {
      try {
        const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const fetchedGigs = snapshot.docs.map((doc) => ({
          id: doc.id,
          category: "General", // Fallback since category isn’t present in your DB
          ...doc.data(),
        }));
        setGigs(fetchedGigs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    }

    fetchJobs();
  }, []);

  const handleAddGig = (newGig) => {
    setGigs((prev) => [{ id: Date.now(), ...newGig }, ...prev]);
  };

  const handleJobPosted = () => {
    // Refresh jobs list
    window.location.reload();
  };

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [budgetRanges] = useState([
    { label: "₹1K - ₹5K", value: "1000-5000" },
    { label: "₹5K - ₹10K", value: "5000-10000" },
    { label: "₹10K - ₹25K", value: "10000-25000" },
    { label: "₹25K - ₹50K", value: "25000-50000" },
    { label: "₹50K+", value: "50000-1000000" }
  ]);
  const [jobTypeFilter, setJobTypeFilter] = useState("");

  const handleTextSearch = (e) => setQuery(e.target.value);

  const [listening, setListening] = useState(false);
  const hasMic = Boolean(SpeechRecognition);

  const startVoiceSearch = () => {
    if (!hasMic) {
      alert("Voice recognition is not supported in your browser. Please use Chrome or Edge.");
      return;
    }
    
    try {
      const recog = new SpeechRecognition();
      recog.lang = "en-US";
      recog.interimResults = false;
      recog.continuous = false;
      
      recog.onstart = () => {
        setListening(true);
        console.log("Voice recognition started");
      };
      
      recog.onerror = (event) => {
        console.error("Voice recognition error:", event.error);
        setListening(false);
        if (event.error === 'not-allowed') {
          alert("Please allow microphone access for voice search");
        }
      };
      
      recog.onend = () => {
        setListening(false);
        console.log("Voice recognition ended");
      };
      
      recog.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        console.log("Voice transcript:", transcript);
        setQuery(transcript);
        setListening(false);
      };
      
      recog.start();
    } catch (error) {
      console.error("Error starting voice recognition:", error);
      alert("Failed to start voice recognition. Please try again.");
      setListening(false);
    }
  };

  const filteredGigs = useMemo(() => {
    return gigs.filter((g) => {
      const matchesQuery = g.title?.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        !categoryFilter || (g.category && g.category === categoryFilter);
      const matchesJobType = !jobTypeFilter || g.jobType === jobTypeFilter;
      const matchesBudget =
        !budgetFilter ||
        (() => {
          const [min, max] = budgetFilter.split("-").map(Number);
          return (
            parseInt(g.budgetMin) >= min && parseInt(g.budgetMax) <= max
          );
        })();
      return matchesQuery && matchesCategory && matchesJobType && matchesBudget;
    });
  }, [query, gigs, categoryFilter, budgetFilter, jobTypeFilter]);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-50 to-orange-100 font-[Inter]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r shadow-xl p-6 space-y-6 rounded-r-xl">
        <h2 className="text-2xl font-extrabold text-purple-700 mb-6">📍 Kaamigo</h2>
        <nav className="space-y-3">
          {[{ label: "Explore", path: "/explore", icon: <LuLayoutDashboard /> },
            { label: "Reels", path: "/explore/reels", icon: <FaVideo /> },
            { label: "Jobs", path: "/explore/jobs", icon: <FaBriefcase /> },
            { label: "Profile", path: "/explore/profile", icon: <FaUserAlt /> },
            { label: "Features", path: "/explore/features", icon: <FaRocket /> },
            { label: "How it Works", path: "/explore/how-it-works", icon: <FaQuestion /> },
            { label: "Premium", path: "/explore/featurebtn", icon: <FaCrown /> },
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
        {/* Header */}
        <div className="flex flex-wrap lg:justify-between gap-2 mb-8">
          <h2 className="text-3xl font-bold text-orange-500">Jobs Board</h2>
                    <div className="flex gap-2">
            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-gradient-to-r from-orange-500 to-yellow-500">
              Browse Jobs
            </button>
            <button
              onClick={() => setShowPostJobModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Post a Job
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-orange-600 px-4 py-2 border border-orange-500 rounded-lg hover:bg-gradient-to-r from-orange-500 to-yellow-500 hover:text-white"
            >
              Post a Gig
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative w-full lg:w-1/3">
            <input
              type="text"
              value={query}
              onChange={handleTextSearch}
              placeholder="Search by title or keyword..."
              className="px-4 py-5 pr-10 border rounded-full w-full"
            />
            {hasMic && (
              <button
                type="button"
                onClick={startVoiceSearch}
                className={`absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${
                  listening 
                    ? "bg-red-500 text-white animate-pulse shadow-lg" 
                    : "text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                }`}
                title={listening ? "Listening..." : "Click to use voice search"}
              >
                <FaMicrophone size={20} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap border-y p-3 gap-2 w-full lg:w-2/3">
            <select
              className="flex-1 min-w-[120px] px-4 py-2 border rounded-lg"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Category</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="General">General</option>
            </select>

            <select
              className="flex-1 min-w-[120px] px-4 py-2 border rounded-lg"
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
            >
              <option value="">Budget</option>
              {budgetRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>

            <select
              className="flex-1 min-w-[120px] px-4 py-2 bg-gray-50 border rounded-lg"
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
            >
              <option value="">Job Type</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.map((gig) => (
            <div
              key={gig.id}
              className="bg-white p-7 shadow-lg rounded-lg space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{gig.title}</h3>
                  <p className="text-purple-600 font-bold">
                    ₹{gig.budgetMin} – ₹{gig.budgetMax}
                  </p>
                </div>
                <p className="text-sm text-orange-500">{gig.jobType}</p>
                <p className="text-sm text-orange-500">Location: {gig.location}</p>
                <p className="text-sm text-gray-700 mt-2">{gig.description}</p>
              </div>
              <div className="flex justify-between items-center pt-2">
                <p className="text-sm text-gray-400">{gig.postedAt || "New"}</p>
                <button
                  className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                  onClick={() => {
                    setSelectedJobTitle(gig.title);
                    setApplyModalOpen(true);
                  }}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
          {filteredGigs.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No gigs match “{query}”
            </p>
          )}
        </div>

        {/* Subscribe */}
        <div className="mt-12 bg-gradient-to-r from-indigo-100 via-purple-100 to-violet-200 p-6 rounded-lg text-center shadow">
          <h3 className="font-bold text-lg mb-2">Kaamigo</h3>
          <p className="text-sm text-gray-600 mb-4">Stay up to date</p>
          <div className="flex justify-center gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-2 border rounded-l-lg"
            />
            <button className="bg-orange-600 text-white px-4 py-2 rounded-r-lg hover:bg-gradient-to-r from-orange-500 to-yellow-500">
              Subscribe
            </button>
          </div>
        </div>

        

        {/* Modals */}
        <PostGigModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onGigPosted={handleAddGig}
        />
        <PostJobModal 
          isOpen={showPostJobModal} 
          onClose={() => setShowPostJobModal(false)} 
          onJobPosted={handleJobPosted} 
        />
        <ApplyGigModal
          open={applyModalOpen}
          onClose={() => setApplyModalOpen(false)}
          jobTitle={selectedJobTitle}
        />
      </main>
    </div>
  );
}
