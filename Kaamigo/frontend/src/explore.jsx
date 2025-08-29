import React, { useEffect, useMemo, useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaVideo, FaBriefcase, FaUserAlt, FaCrown, FaQuestion, FaRocket, FaTimes, FaEye } from "react-icons/fa";
import MapWithRadius from "./mapWithRedius";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import FreelancerCard from "./components/FreelancerCard";

export default function Explore() {
  const locationHook = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(1);
  const [price, setPrice] = useState(50000);

  const [remoteFreelancers, setRemoteFreelancers] = useState([]);
  const [featuredFreelancers, setFeaturedFreelancers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [showFreelancerModal, setShowFreelancerModal] = useState(false);

  // Initialize from query param
  useEffect(() => {
    const params = new URLSearchParams(locationHook.search);
    const qParam = params.get("q") || "";
    if (qParam) setQuery(qParam);
    
    // Get user location for nearby calculations
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Location access denied:", error);
          // Default to Delhi coordinates
          setUserLocation({ lat: 28.7041, lng: 77.1025 });
        }
      );
    }
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
            about: d.about || "Professional freelancer with expertise in their field.",
            skills: d.skills || "General Skills",
            portfolio: d.portfolio || [],
            services: d.services || [],
            profilePic: d.profilePic || null,
          };
        });
        if (users.length > 0) {
          // Separate featured and regular freelancers
          const featured = users.filter(user => user.isPro || user.subscription === 'pro');
          const regular = users.filter(user => !user.isPro && user.subscription !== 'pro');
          
          setFeaturedFreelancers(featured);
          setRemoteFreelancers(regular);
        } else {
          // Fallback demo data for empty DB
          const demoUsers = Array.from({ length: 12 }).map((_, i) => ({
            id: `demo-${i}`,
            name: `Freelancer #${i + 1}`,
            role: ["Web Developer", "Designer", "Content Writer", "Video Editor"][i % 4],
            category: ["Tech", "Design", "Content", "Media"][i % 4],
            status: ["Available", "Busy"][i % 2],
            city: ["Delhi", "Mumbai", "Bengaluru", "Jaipur"][i % 4],
            rating: (i % 5) + 1,
            price: (i % 10) * 50,
            reviews: (i % 20) + 1,
            isPro: i < 3, // First 3 are featured
            about: "Professional freelancer with expertise in their field.",
            skills: ["Web Development", "UI/UX Design", "Content Writing", "Video Editing"][i % 4],
            portfolio: [],
            services: [],
            profilePic: null,
            location: {
              lat: 28.7041 + (Math.random() - 0.5) * 0.1,
              lng: 77.1025 + (Math.random() - 0.5) * 0.1
            }
          }));
          
          setFeaturedFreelancers(demoUsers.filter(u => u.isPro));
          setRemoteFreelancers(demoUsers.filter(u => !u.isPro));
        }
      } catch (e) {
        // Network/permission error fallback
        const offlineUsers = Array.from({ length: 12 }).map((_, i) => ({
          id: `offline-${i}`,
          name: `Freelancer #${i + 1}`,
          role: ["Web Developer", "Designer", "Content Writer", "Video Editor"][i % 4],
          category: ["Tech", "Design", "Content", "Media"][i % 4],
          status: ["Available", "Busy"][i % 2],
          city: ["Delhi", "Mumbai", "Bengaluru", "Jaipur"][i % 4],
          rating: (i % 5) + 1,
          price: (i % 10) * 50,
          reviews: (i % 20) + 1,
          isPro: i < 3,
          about: "Professional freelancer with expertise in their field.",
          skills: ["Web Development", "UI/UX Design", "Content Writing", "Video Editing"][i % 4],
          portfolio: [],
          services: [],
          profilePic: null,
          location: {
            lat: 28.7041 + (Math.random() - 0.5) * 0.1,
            lng: 77.1025 + (Math.random() - 0.5) * 0.1
          }
        }));
        
        setFeaturedFreelancers(offlineUsers.filter(u => u.isPro));
        setRemoteFreelancers(offlineUsers.filter(u => !u.isPro));
      }
    };
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    const allFreelancers = [...featuredFreelancers, ...remoteFreelancers];
    return allFreelancers.filter((f) => {
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
  }, [featuredFreelancers, remoteFreelancers, query, category, status, location, rating, price]);

  // Calculate nearby freelancers (within 10km)
  const nearbyFreelancers = useMemo(() => {
    if (!userLocation) return [];
    
    const allFreelancers = [...featuredFreelancers, ...remoteFreelancers];
    return allFreelancers.filter(f => {
      if (!f.location) return false;
      const distance = calculateDistance(
        userLocation.lat, userLocation.lng,
        f.location.lat, f.location.lng
      );
      return distance <= 10; // 10km radius
    });
  }, [featuredFreelancers, remoteFreelancers, userLocation]);

  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleViewDetails = (freelancer) => {
    setSelectedFreelancer(freelancer);
    setShowFreelancerModal(true);
  };

  const closeFreelancerModal = () => {
    setShowFreelancerModal(false);
    setSelectedFreelancer(null);
  };

  const applyFilters = () => {
    // Filters are already applied in real-time via useMemo
    // This function can be used for additional filter logic if needed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
                <button onClick={applyFilters} className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition">
                  Apply Filters
                </button>
                <button onClick={() => { setQuery(""); setCategory(""); setStatus(""); setLocation(""); setRating(1); setPrice(50000); }} className="w-full border border-purple-600 text-purple-700 py-2 rounded hover:bg-purple-50 transition">
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
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-colors ${
                        rating >= star ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-sm text-gray-600 ml-2 self-center">+</span>
                </div>
                <div className="text-xs text-gray-500 mt-1 text-center">
                  {rating === 5 ? 'Excellent (5★)' : 
                   rating === 4 ? 'Very Good (4★+)' : 
                   rating === 3 ? 'Good (3★+)' : 
                   rating === 2 ? 'Fair (2★+)' : 'Any Rating (1★+)'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price Range (₹)</label>
                <input value={price} onChange={(e) => setPrice(Number(e.target.value))} type="range" min="0" max="50000" step="1000" className="w-full accent-orange-500" />
                <div className="text-xs text-gray-500 mt-1">₹0 - ₹{price.toLocaleString()}</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Nearby Freelancers (10km)</h2>
              {nearbyFreelancers.slice(0, 5).map((f, i) => (
                <FreelancerCard
                  key={f.id}
                  freelancer={f}
                  onViewDetails={handleViewDetails}
                  variant="nearby"
                />
              ))}
              {nearbyFreelancers.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">No nearby freelancers found</p>
              )}
            </div>
          </aside>

          {/* Map Section */}
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold text-gray-800 text-center mb-4">Freelancers Around You (10km)</h2>
              <div className="h-[400px] rounded-lg overflow-hidden">
                <MapWithRadius freelancers={nearbyFreelancers} userLocation={userLocation} />
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
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Featured Freelancers</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {featuredFreelancers.map((f) => (
              <FreelancerCard
                key={f.id}
                freelancer={f}
                onViewDetails={handleViewDetails}
                variant="featured"
                showProBadge={true}
              />
            ))}
          </div>
          
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">All Freelancers</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.filter(f => !f.isPro).map((f) => (
              <FreelancerCard
                key={f.id}
                freelancer={f}
                onViewDetails={handleViewDetails}
                variant="default"
              />
            ))}
            {filtered.filter(f => !f.isPro).length === 0 && (
              <div className="col-span-full text-center text-sm text-gray-500 dark:text-gray-400">No freelancers match your filters.</div>
            )}
          </div>
        </section>

        {/* Freelancer Details Modal */}
        {showFreelancerModal && selectedFreelancer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-purple-700">{selectedFreelancer.name}</h2>
                  <button
                    onClick={closeFreelancerModal}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    <FaTimes />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Profile Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Role:</span> {selectedFreelancer.role}</p>
                      <p><span className="font-medium">Category:</span> {selectedFreelancer.category}</p>
                      <p><span className="font-medium">Location:</span> {selectedFreelancer.city}</p>
                      <p><span className="font-medium">Status:</span> {selectedFreelancer.status}</p>
                      <p><span className="font-medium">Rating:</span> ⭐ {selectedFreelancer.rating}/5</p>
                      <p><span className="font-medium">Reviews:</span> {selectedFreelancer.reviews || 0}</p>
                      <p><span className="font-medium">Rate:</span> ₹{selectedFreelancer.price}/hr</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">About</h3>
                    <p className="text-sm text-gray-600">{selectedFreelancer.about}</p>
                    
                    <h3 className="font-semibold text-lg mb-2 mt-4">Skills</h3>
                    <p className="text-sm text-gray-600">{selectedFreelancer.skills}</p>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      closeFreelancerModal();
                      navigate('/explore?chat=true');
                    }}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                  >
                    Send Message
                  </button>
                  <button
                    onClick={() => {
                      closeFreelancerModal();
                      navigate('/explore?chat=true');
                    }}
                    className="border border-purple-600 text-purple-600 px-6 py-2 rounded-lg hover:bg-purple-50 transition"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
