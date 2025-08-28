import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaVideo, FaBriefcase, FaUserAlt, FaCrown, FaQuestion, FaRocket, FaClock } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function FeatureBtn() {
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-orange-50 to-yellow-100 font-century-gothic">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r shadow-xl p-6 space-y-6 rounded-r-xl sticky top-0 h-screen">
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
      <main className="flex-1 p-6 md:ml-64">
        {/* Hero Section */}
        <section className="bg-gradient-to-t from-orange-200 to-yellow-200 text-center py-12 px-4 rounded-lg mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="text-purple-700">Kaamigo Pro</span> - Coming Soon!
          </h1>
          <p className="max-w-2xl mx-auto mb-6">
            We're working hard to bring you premium features and advanced capabilities. Stay tuned for exciting updates!
          </p>
          <div className="flex items-center justify-center gap-2 text-orange-600">
            <FaClock className="text-xl" />
            <span className="font-semibold">Launch Date: Q1 2025</span>
          </div>
        </section>

        {/* Coming Soon Message */}
        <section className="py-12 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200">
              <div className="text-6xl mb-6">🚀</div>
              <h2 className="text-3xl font-bold text-purple-700 mb-4">
                Premium Features Coming Soon!
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We're building something amazing for our premium users. Here's what you can expect:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="text-left">
                  <h3 className="font-semibold text-lg text-purple-600 mb-3">For Freelancers</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>✓ Priority listing in search results</li>
                    <li>✓ Advanced analytics dashboard</li>
                    <li>✓ Custom portfolio themes</li>
                    <li>✓ Priority customer support</li>
                    <li>✓ Advanced skill verification</li>
                  </ul>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg text-orange-600 mb-3">For Clients</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>✓ Advanced filtering options</li>
                    <li>✓ Bulk hiring tools</li>
                    <li>✓ Project management features</li>
                    <li>✓ Dedicated account manager</li>
                    <li>✓ Priority dispute resolution</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-orange-50 p-6 rounded-xl border border-purple-200">
                <h3 className="font-semibold text-lg text-purple-700 mb-2">
                  Get Early Access
                </h3>
                <p className="text-gray-600 mb-4">
                  Be the first to know when Kaamigo Pro launches and get exclusive early access offers.
                </p>
                <button 
                  onClick={() => navigate('/contact')}
                  className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:scale-105 transition-all duration-300"
                >
                  Join Waitlist
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Current Free Features */}
        <section className="py-12 px-4">
          <h2 className="text-2xl font-bold text-center mb-10">
            What's Available Now (Free)
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white border-2 border-purple-200 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-2">Kaamigo Basic</h3>
              <p className="text-2xl font-bold mb-4 text-green-600">₹0 <span className="text-sm font-normal">/month</span></p>
              <ul className="space-y-2 mb-6 text-sm">
                <li>✓ Up to 10 Projects</li>
                <li>✓ Basic Analytics</li>
                <li>✓ Standard Support</li>
                <li>✓ Basic Profile</li>
                <li>✓ Reels Upload (5/month)</li>
                <li>✓ Job Applications</li>
                <li>✓ Voice Communication</li>
                <li>✓ Map-based Discovery</li>
              </ul>
              <div className="text-center">
                <span className="text-green-600 font-semibold">Currently Active</span>
              </div>
            </div>

            {/* Pro Plan - Coming Soon */}
            <div className="bg-white border-2 border-gray-300 p-6 rounded-lg shadow-lg opacity-75">
              <div className="text-center mb-4">
                <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                  Coming Soon
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">Kaamigo Pro</h3>
              <p className="text-2xl font-bold mb-4 text-gray-400">₹1000 <span className="text-sm font-normal">/month</span></p>
              <ul className="space-y-2 mb-6 text-sm text-gray-500">
                <li>⏳ Unlimited Projects</li>
                <li>⏳ Advanced Analytics</li>
                <li>⏳ Advanced Collaboration</li>
                <li>⏳ Custom Integrations</li>
                <li>⏳ Dedicated Account Manager</li>
              </ul>
              <button 
                disabled
                className="w-full bg-gray-300 text-gray-500 py-2 rounded cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <div className="mb-12 border border-gray-200 p-6 rounded-lg shadow bg-gradient-to-l from-blue-100 to-pink-100">
          <h4 className="text-3xl text-purple-600 mt-4 mb-4 font-bold text-center">
            What Our Users Say
          </h4>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-2">
            {[{
              quote: "Kaamigo transformed how I find local talent. The map feature is a game-changer!",
              name: "Sarah M.",
              role: "Small Business Owner",
            }, {
              quote: "Showcasing my work through video reels has brought me so many new clients. Truly innovative!",
              name: "Mark J.",
              role: "Freelance Videographer",
            }, {
              quote: "Finding trusted professionals has never been easier. Thanks to the reviews and profiles.",
              name: "Emily R.",
              role: "Homeowner",
            }].map((item) => (
              <div
                key={item.name}
                className="min-w-[280px] snap-center bg-white p-10 rounded-md shadow text-sm text-gray-700 flex-shrink-0"
              >
                <p className="mb-2 italic">"{item.quote}"</p>
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-gray-500">{item.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* footer rendered globally */}

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
