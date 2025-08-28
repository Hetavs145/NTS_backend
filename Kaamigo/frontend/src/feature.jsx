import React, { useState } from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaVideo, FaBriefcase, FaUserAlt, FaCrown, FaQuestion, FaRocket } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

export default function Features() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Dynamic Video Reels",
      desc: "Discover freelancers through captivating short video reels, bringing their skills to life.",
      icon: "🎥",
      action: "Learn More",
      redirect: "/explore/reels",
      image: "/api/placeholder/400/250/7c3aed/ffffff?text=Video+Reels"
    },
    {
      title: "Intuitive Voice Search",
      desc: "Find what you need hands-free with voice commands, simplifying your search.",
      icon: "🎤",
      action: "Try Now",
      redirect: "/explore/profile",
      image: "/api/placeholder/400/250/ea580c/ffffff?text=Voice+Search"
    },
    {
      title: "Real-time Map Discovery",
      desc: "Locate professionals on a live, interactive map. Filter by needs, location, and more.",
      icon: "🗺️",
      action: "Explore",
      redirect: "/explore",
      image: "/api/placeholder/400/250/6366f1/ffffff?text=Map+Discovery"
    },
    {
      title: "Certified Trust Badges",
      desc: "Verify freelancer credentials with badges, ensuring reliability and peace of mind.",
      icon: "✅",
      action: "View Badges",
      redirect: "/explore/profile",
      image: "/api/placeholder/400/250/10b981/ffffff?text=Trust+Badges"
    },
    {
      title: "Secure & Simple Payments",
      desc: "Effortless transactions with multiple payment options for convenience.",
      icon: "💳",
      action: "Coming Soon",
      redirect: "#",
      image: "/api/placeholder/400/250/f59e0b/ffffff?text=Payments"
    },
    {
      title: "Dedicated 24/7 Support",
      desc: "Access help whenever needed, with a professional team ready to assist.",
      icon: "🕐",
      action: "Coming Soon",
      redirect: "#",
      image: "/api/placeholder/400/250/ef4444/ffffff?text=Support"
    },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-50 to-orange-100 font-[Inter]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r shadow-xl p-6 space-y-6 rounded-r-xl">
        <h2 className="text-2xl font-extrabold text-purple-700 mb-6">📍 Kaamigo</h2>
        <nav className="space-y-3">
          {[ 
            { label: "Explore", path: "/explore", icon: <LuLayoutDashboard /> },
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
        {/* Hero Banner */}
        <div className="bg-gradient-to-t from-purple-400 via-violet-400 to-indigo-400 text-center py-16 px-10 rounded-lg">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Unlock Your Potential with <span className="text-orange-300">Kaamigo</span>
          </h2>
          <p className="text-gray-100 mb-6 text-base max-w-2xl mx-auto">
            Discover, showcase, and connect with local talent and opportunities like never before.
          </p>
          <button
            onClick={() => navigate("/explore")}
            className="mt-4 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Start Exploring Now
          </button>
        </div>

        {/* Features Grid */}
        <section className="bg-gradient-to-t from-purple-200 to-blue-100 p-8 rounded-lg shadow border border-gray-200">
          <h3 className="text-3xl font-bold text-center text-purple-700 mb-2">Core Features That Set Us Apart</h3>
          <p className="text-center text-gray-600 mb-6">Kaamigo is built on powerful capabilities designed to make your experience seamless and rewarding.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item) => (
              <div
                key={item.title}
                className="bg-white p-6 rounded-lg text-center shadow hover:shadow-lg transition-transform transform hover:scale-105"
              >
                <div className="mb-4">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    onError={(e) => {
                      e.target.style.background = `linear-gradient(135deg, #7c3aed, #ea580c)`;
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="text-4xl mb-3">{item.icon}</div>
                <h4 className="text-xl font-semibold text-orange-600 mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm mb-3">{item.desc}</p>
                <button
                  onClick={() => item.redirect !== "#" ? navigate(item.redirect) : null}
                  className={`text-purple-600 text-sm underline hover:text-purple-800 transition-colors ${
                    item.redirect === "#" ? "cursor-default opacity-60" : "cursor-pointer"
                  }`}
                >
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Reels Section */}
        <section className="grid lg:grid-cols-2 gap-6 items-center bg-gradient-to-t from-purple-200 to-pink-100 p-6 rounded-lg border shadow">
          <img
            src="https://via.placeholder.com/400x200?text=Reel+Preview"
            className="h-56 w-full object-cover rounded-lg"
            alt="Reel Preview"
          />
          <div>
            <h4 className="text-2xl font-bold mb-2">Experience Work Through Vibrant Reels</h4>
            <p className="text-gray-600 text-sm mb-4">
              Our unique video reel feature allows freelancers to showcase skills dynamically, giving a comprehensive and engaging preview before connecting.
            </p>
            <button
              onClick={() => navigate("/explore/reels")}
              className="border border-purple-700 text-purple-700 px-5 py-2 rounded hover:bg-purple-100"
            >
              Explore Reels
            </button>
          </div>
        </section>

        {/* Map Section */}
        <section className="grid lg:grid-cols-2 gap-6 items-center bg-gradient-to-b from-purple-200 to-pink-100 p-6 rounded-lg border shadow">
          <div>
            <h4 className="text-2xl font-bold mb-2">Find Local Talent with Precision Map Discovery</h4>
            <p className="text-gray-600 text-sm mb-4">
              Easily locate freelancers near you using our interactive map. Filter by category, language, and rating.
            </p>
            <button
              onClick={() => navigate("/explore")}
              className="border border-purple-700 text-purple-700 px-5 py-2 rounded hover:bg-purple-100"
            >
              Discover Nearby
            </button>
          </div>
          <img
            src="https://via.placeholder.com/400x200?text=Map+Feature"
            className="h-56 w-full object-cover rounded-lg"
            alt="Map Feature"
          />
        </section>

        {/* Testimonials */}
        <section className="bg-gradient-to-l from-blue-100 to-pink-100 p-6 rounded-lg border shadow">
          <h4 className="text-3xl text-purple-700 font-bold text-center mb-6">What Our Users Say</h4>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-2">
            {["Sarah M.", "Mark J.", "Emily R."].map((name, index) => (
              <div
                key={name}
                className="min-w-[280px] snap-center bg-white p-6 rounded shadow text-sm text-gray-700 flex-shrink-0"
              >
                <p className="italic mb-2">
                  “{
                    index === 0 ? "Kaamigo transformed how I find local talent. The map feature is a game-changer!" :
                    index === 1 ? "Showcasing my work through video reels has brought me so many new clients. Truly innovative!" :
                    "Finding trusted professionals has never been easier. Thanks to the reviews and profiles."
                  }”
                </p>
                <p className="font-semibold">{name}</p>
                <p className="text-xs text-gray-500">
                  {index === 0 ? "Small Business Owner" : index === 1 ? "Freelance Videographer" : "Homeowner"}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Footer */}
        <section className="bg-gradient-to-r from-purple-400 to-pink-500 text-white text-center py-10 px-6 rounded-lg">
          <h4 className="text-2xl font-bold mb-2">Ready to Connect or Showcase Your Talent?</h4>
          <p className="text-sm mb-4">Join Kaamigo today and become part of a thriving community where opportunities meet skills.</p>
          <button
            onClick={() => navigate("/explore/featurebtn")}
            className="bg-white text-purple-600 px-6 py-3 rounded font-semibold hover:bg-purple-100"
          >
            Get Started Now
          </button>
        </section>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-4 right-4 bg-orange-600 text-white px-3 py-2 rounded-full shadow hover:bg-gradient-to-r from-orange-400 to-yellow-500 transition duration-300"
        >
          Go Back
        </button>
      </main>
    </div>
  );
}
