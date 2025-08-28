import React, { useEffect, useMemo, useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaVideo, FaBriefcase, FaUserAlt, FaCrown, FaQuestion, FaRocket } from "react-icons/fa";
import MapWithRadius from "./mapWithRedius";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Explore() {
  const locationHook = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(1);
  const [price, setPrice] = useState(500);

  const [remoteFreelancers, setRemoteFreelancers] = useState([]);

  // Initialize from query param
  useEffect(() => {
    const params = new URLSearchParams(locationHook.search);
    const qParam = params.get("q") || "";
    if (qParam) setQuery(qParam);
  }, [locationHook.search]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const users = snapshot.docs.map((doc) => {
          const d = doc.data() || {};
          return {
            id: doc.id,
            name: d.name || d.displayName || "Freelancer",
            role: d.role || d.specialization || "Professional",
            category: d.category || "Tech",
            status: d.status || "Available",
            city: d.city || d.location || "",
            rating: typeof d.rating === "number" && d.rating > 0 ? d.rating : 4,
            price: typeof d.price === "number" ? d.price : 200,
            reviews: typeof d.reviews === "number" ? d.reviews : 0,
          };
        });
        if (users.length > 0) {
          setRemoteFreelancers(users);
        } else {
          // Fallback demo data for empty DB
          setRemoteFreelancers(
            Array.from({ length: 12 }).map((_, i) => ({
              id: `demo-${i}`,
              name: `Freelancer #${i + 1}`,
              role: ["Web Developer", "Designer", "Content Writer", "Video Editor"][i % 4],
              category: ["Tech", "Design", "Content", "Media"][i % 4],
              status: ["Available", "Busy"][i % 2],
              city: ["Delhi", "Mumbai", "Bengaluru", "Jaipur"][i % 4],
              rating: (i % 5) + 1,
              price: (i % 10) * 50,
              reviews: (i % 20) + 1,
            }))
          );
        }
      } catch (e) {
        // Network/permission error fallback
        setRemoteFreelancers(
          Array.from({ length: 12 }).map((_, i) => ({
            id: `offline-${i}`,
            name: `Freelancer #${i + 1}`,
            role: ["Web Developer", "Designer", "Content Writer", "Video Editor"][i % 4],
            category: ["Tech", "Design", "Content", "Media"][i % 4],
            status: ["Available", "Busy"][i % 2],
            city: ["Delhi", "Mumbai", "Bengaluru", "Jaipur"][i % 4],
            rating: (i % 5) + 1,
            price: (i % 10) * 50,
            reviews: (i % 20) + 1,
          }))
        );
      }
    };
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    return remoteFreelancers.filter((f) => {
      const matchesQuery = query.trim().length === 0 ||
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.role.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !category || f.category === category;
      const matchesStatus = !status || f.status === status;
      const matchesLocation = !location || f.city.toLowerCase().includes(location.toLowerCase());
      const matchesRating = f.rating >= rating;
      const matchesPrice = f.price <= price;
      return matchesQuery && matchesCategory && matchesStatus && matchesLocation && matchesRating && matchesPrice;
    });
  }, [remoteFreelancers, query, category, status, location, rating, price]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 flex font-[Inter]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r shadow-xl p-6 space-y-6">
        <h2 className="text-2xl font-extrabold text-purple-700 tracking-wide">📍 Kaamigo</h2>
        <nav className="space-y-2">
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
                `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  isActive ? "bg-purple-600 text-white shadow-lg" : "text-gray-700 hover:bg-purple-100 hover:text-purple-800"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters */}
          <aside className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Discover Freelancers</h2>
              <input
                type="text"
                placeholder="Search by name, skill..."
                className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-purple-500"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition">
                  Apply Filters
                </button>
                <button onClick={() => { setQuery(""); setCategory(""); setStatus(""); setLocation(""); setRating(1); setPrice(500); }} className="w-full border border-purple-600 text-purple-700 py-2 rounded hover:bg-purple-50 transition">
                  Reset
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Filter Options</h2>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded-lg text-sm">
                <option value="">Category</option>
                <option>Tech</option>
                <option>Design</option>
                <option>Content</option>
                <option>Media</option>
              </select>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 border rounded-lg text-sm">
                <option value="">Status</option>
                <option>Available</option>
                <option>Busy</option>
              </select>
              <input
                type="text"
                placeholder="Location"
                className="w-full p-2 border rounded-lg text-sm"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <input value={rating} onChange={(e) => setRating(Number(e.target.value))} type="range" min="1" max="5" className="w-full accent-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price Range</label>
                <input value={price} onChange={(e) => setPrice(Number(e.target.value))} type="range" min="0" max="500" className="w-full accent-orange-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Nearby Freelancers</h2>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-3" />
                  <div>
                    <p className="font-semibold text-sm">Name #{i + 1}</p>
                    <p className="text-sm text-gray-500">Web Designer</p>
                    <a href="#" className="text-sm text-purple-600 hover:underline">
                      View Profile
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Map Section */}
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold text-gray-800 text-center mb-4">Freelancers Around You (5km)</h2>
              <div className="h-[400px] rounded-lg overflow-hidden">
                <MapWithRadius />
              </div>
              <div className="text-center mt-4">
                <button onClick={() => navigate('/explore')} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                  View All Freelancers
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Featured Freelancers */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Featured Freelancers Nearby</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((f) => (
              <div key={f.id} className="bg-white p-4 rounded-xl shadow-md">
                <div className="h-24 bg-gray-200 rounded mb-2" />
                <p className="font-semibold text-sm">{f.name}</p>
                <p className="text-xs text-gray-500">{f.role} • {f.city}</p>
                <p className="text-xs text-gray-500">⭐ {f.rating} • {f.reviews || 0} reviews • ₹{f.price}</p>
                <button onClick={() => navigate(`/explore/profile?uid=${encodeURIComponent(f.id)}`)} className="text-xs text-purple-600 hover:underline">
                  View Profile
                </button>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center text-sm text-gray-500">No freelancers match your filters.</div>
            )}
          </div>
        </section>

        {/* Back to Top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-4 right-4 bg-orange-600 text-white px-4 py-2 rounded-full shadow hover:bg-gradient-to-r from-orange-400 to-yellow-500 transition duration-300"
        >
          Go Back
        </button>
      </main>
    </div>
  );
}
