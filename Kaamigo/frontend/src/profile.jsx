import React, { useState, useEffect } from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaVideo, FaBriefcase, FaUserAlt, FaCrown, FaQuestion, FaRocket } from "react-icons/fa";
import { NavLink, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "./firebase";

const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);

export default function Profile() {
  const { id: routeProfileId } = useParams();
  const [isBooked, setIsBooked] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [profile, setProfile] = useState({ name: "", address: "", phone: "", skills: "", projects: 0, rating: 0, reviews: 0, about: "", featuredReel: "" });
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [aboutEdit, setAboutEdit] = useState(false);
  const [aboutForm, setAboutForm] = useState({ about: profile.about || "", specialization: profile.specialization || "", featuredReel: "" });
  const [aboutSaving, setAboutSaving] = useState(false);
  const [portfolioEdit, setPortfolioEdit] = useState(false);
  const [portfolioForm, setPortfolioForm] = useState(profile.portfolio || []);
  const [portfolioSaving, setPortfolioSaving] = useState(false);
  const [testimonialEdit, setTestimonialEdit] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState(profile.testimonials || []);
  const [testimonialSaving, setTestimonialSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      const user = auth.currentUser;
      try {
        const targetUserId = routeProfileId || (user && user.uid);
        if (!targetUserId) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }
        const docRef = doc(db, "users", targetUserId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (err) {
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [routeProfileId]);

  useEffect(() => {
    setAboutForm({ about: profile.about || "", specialization: profile.specialization || "", featuredReel: profile.featuredReel || "" });
    setPortfolioForm(profile.portfolio || []);
    setTestimonialForm(profile.testimonials || []);
  }, [profile]);

  const handleBook = () => {
    setIsBooked(true);
    alert("Session booked with Sarah!");
  };

  const handleMessage = () => {
    setMessageSent(true);
    alert("Message sent to Sarah!");
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const user = auth.currentUser;
    if (!user) {
      setError("User not authenticated");
      setSaving(false);
      return;
    }
    try {
      await setDoc(doc(db, "users", user.uid), profile);
      setEdit(false);
    } catch (err) {
      setError("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAboutChange = (e) => {
    setAboutForm({ ...aboutForm, [e.target.name]: e.target.value });
  };

  const handleReelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAboutSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      const storageRef = ref(storage, `reels/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setAboutForm((prev) => ({ ...prev, featuredReel: url }));
    } catch (err) {
      alert("Failed to upload reel");
    } finally {
      setAboutSaving(false);
    }
  };

  const handleAboutSave = async () => {
    setAboutSaving(true);
    setError("");
    const user = auth.currentUser;
    if (!user) {
      setError("User not authenticated");
      setAboutSaving(false);
      return;
    }
    try {
      await setDoc(doc(db, "users", user.uid), { ...profile, ...aboutForm });
      setProfile((prev) => ({ ...prev, ...aboutForm }));
      setAboutEdit(false);
    } catch (err) {
      setError("Failed to save about me");
    } finally {
      setAboutSaving(false);
    }
  };

  const handlePortfolioChange = (idx, field, value) => {
    setPortfolioForm((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };
  const handleAddPortfolio = () => {
    setPortfolioForm((prev) => [...prev, { title: '', url: '' }]);
  };
  const handleRemovePortfolio = (idx) => {
    setPortfolioForm((prev) => prev.filter((_, i) => i !== idx));
  };
  const handlePortfolioSave = async () => {
    setPortfolioSaving(true);
    setError("");
    const user = auth.currentUser;
    if (!user) {
      setError("User not authenticated");
      setPortfolioSaving(false);
      return;
    }
    try {
      await setDoc(doc(db, "users", user.uid), { ...profile, portfolio: portfolioForm });
      setProfile((prev) => ({ ...prev, portfolio: portfolioForm }));
      setPortfolioEdit(false);
    } catch (err) {
      setError("Failed to save portfolio");
    } finally {
      setPortfolioSaving(false);
    }
  };

  const handleTestimonialChange = (idx, field, value) => {
    setTestimonialForm((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };
  const handleAddTestimonial = () => {
    setTestimonialForm((prev) => [...prev, { name: '', text: '', date: '' }]);
  };
  const handleRemoveTestimonial = (idx) => {
    setTestimonialForm((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleTestimonialSave = async () => {
    setTestimonialSaving(true);
    setError("");
    const user = auth.currentUser;
    if (!user) {
      setError("User not authenticated");
      setTestimonialSaving(false);
      return;
    }
    try {
      await setDoc(doc(db, "users", user.uid), { ...profile, testimonials: testimonialForm });
      setProfile((prev) => ({ ...prev, testimonials: testimonialForm }));
      setTestimonialEdit(false);
    } catch (err) {
      setError("Failed to save testimonials");
    } finally {
      setTestimonialSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

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

      {/* Profile Main Content */}
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-10 rounded-lg shadow text-center">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlNt7Tl2jtLg7G15M-uMxtcPRwp6xW-xSJow&s"
              alt="Profile"
              className="w-24 h-24 mx-auto rounded-full mb-6 object-cover shadow-lg"
            />
            <h2 className="font-bold text-lg p-1 text-orange-500">{profile.name || "Name"}</h2>
            <p className="text-sm text-gray-600 p-1">{profile.skills || "Skills"}</p>
            <div className="flex justify-center gap-5 mt-2 text-sm text-gray-500">
              {profile.rating && (
                <div>
                  <span className="block font-bold text-black">{profile.rating.toFixed(1)}</span>Rating
                </div>
              )}
              {profile.reviews && (
                <div>
                  <span className="block font-bold text-black">{profile.reviews}</span>Reviews
                </div>
              )}
              <div>
                <span className="block font-bold text-black">{profile.projects || "-"}</span>Projects
              </div>
            </div>
            <button
              onClick={handleBook}
              className="mt-4 bg-purple-500 text-white px-6 py-3 rounded hover:bg-purple-600"
            >
              {isBooked ? "Booked!" : "Book Session"}
            </button>
            <button
              onClick={handleMessage}
              className="mt-2 border px-6 py-3 rounded text-purple-500 hover:bg-purple-100"
            >
              {messageSent ? "Message Sent" : "Send Message"}
            </button>
          </div>

          <div className="bg-white p-10 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Verification Status</h3>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>✔️ Govt ID – Verified</li>
              <li>✔️ Phone – Verified</li>
              <li>✔️ Email – Verified</li>
              <li>❌ Address – Not Verified</li>
              <li>❌ PAN/SSN – Not Verified</li>
            </ul>
          </div>
        </div>

        {/* Profile Info Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h2 className="text-xl font-bold">Personal Details</h2>
            {edit ? (
              <div className="space-y-3">
                <input name="name" value={profile.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" />
                <input name="address" value={profile.address} onChange={handleChange} placeholder="Address" className="w-full p-2 border rounded" />
                <input name="phone" value={profile.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 border rounded" />
                <input name="skills" value={profile.skills} onChange={handleChange} placeholder="Skills" className="w-full p-2 border rounded" />
                <input name="projects" type="number" value={profile.projects} onChange={handleChange} placeholder="Projects" className="w-full p-2 border rounded" />
                <button onClick={handleSave} disabled={saving} className="bg-orange-500 text-white px-4 py-2 rounded">{saving ? "Saving..." : "Save"}</button>
                <button onClick={() => setEdit(false)} className="ml-2 px-4 py-2 border rounded">Cancel</button>
              </div>
            ) : (
              <div className="space-y-2">
                <div><b>Name:</b> {profile.name}</div>
                <div><b>Address:</b> {profile.address}</div>
                <div><b>Phone:</b> {profile.phone}</div>
                <div><b>Skills:</b> {profile.skills}</div>
                <div><b>Projects:</b> {profile.projects}</div>
                <button onClick={() => setEdit(true)} className="bg-purple-500 text-white px-4 py-2 rounded mt-2">Edit</button>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h2 className="text-xl font-bold">About Me</h2>
            {aboutEdit ? (
              <div className="space-y-3">
                <textarea name="about" value={aboutForm.about} onChange={handleAboutChange} placeholder="About Me" className="w-full p-2 border rounded" />
                <input name="specialization" value={aboutForm.specialization} onChange={handleAboutChange} placeholder="Specialization" className="w-full p-2 border rounded" />
                <label className="block text-sm font-medium mb-1">Upload Featured Reel (video):</label>
                <input type="file" accept="video/*" onChange={handleReelUpload} className="w-full" />
                {aboutForm.featuredReel && (
                  <video src={aboutForm.featuredReel} controls className="w-full h-48 rounded-lg" />
                )}
                <button
                  onClick={handleAboutSave}
                  disabled={aboutSaving || (aboutForm.featuredReel === '' && aboutSaving)}
                  className={`bg-orange-500 text-white px-4 py-2 rounded ${aboutSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {aboutSaving ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setAboutEdit(false)} className="ml-2 px-4 py-2 border rounded">Cancel</button>
              </div>
            ) : (
              <div>
                <p className="text-gray-700 text-sm">{profile.about}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <h3 className="text-sm text-gray-600">🔹 Specialization <span className="text-purple-600 ml-2">{profile.specialization}</span></h3>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Featured Reel</h3>
                  {profile.featuredReel ? (
                    <video src={profile.featuredReel} controls className="w-full h-48 rounded-lg" />
                  ) : (
                    <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center text-gray-500">
                      🎞️ Featured Video
                    </div>
                  )}
                </div>
                <button onClick={() => setAboutEdit(true)} className="bg-purple-500 text-white px-4 py-2 rounded mt-2">Edit About Me</button>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold mb-4 text-lg">My Services</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 text-sm">
              {["Logo Design & Branding", "UI/UX Design", "Marketing Collateral", "Illustration & Iconography"].map(title => (
                <div key={title} className="border p-6 rounded-lg text-center bg-white shadow">
                  <h4 className="font-semibold text-sm mb-1">{title}</h4>
                  <p className="text-xs text-gray-600">Detailed service description goes here.</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold mb-4 text-lg">Portfolio</h3>
            {portfolioEdit ? (
              <div>
                {portfolioForm.map((item, idx) => (
                  <div key={idx} className="mb-2 flex gap-2 items-center">
                    <input value={item.title} onChange={e => handlePortfolioChange(idx, 'title', e.target.value)} placeholder="Project Title" className="p-2 border rounded w-1/3" />
                    <input value={item.url} onChange={e => handlePortfolioChange(idx, 'url', e.target.value)} placeholder="Image/Link URL" className="p-2 border rounded w-1/2" />
                    <button onClick={() => handleRemovePortfolio(idx)} className="text-red-500">Remove</button>
                  </div>
                ))}
                <button onClick={handleAddPortfolio} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Add Project</button>
                <button onClick={handlePortfolioSave} disabled={portfolioSaving} className="bg-orange-500 text-white px-2 py-1 rounded">{portfolioSaving ? "Saving..." : "Save"}</button>
                <button onClick={() => setPortfolioEdit(false)} className="ml-2 px-2 py-1 border rounded">Cancel</button>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                  {(profile.portfolio || []).map((item, i) => (
                    <div key={i} className="bg-gray-100 h-32 rounded flex items-center justify-center text-sm text-gray-500">
                      {item.url ? <img src={item.url} alt={item.title} className="h-full w-full object-cover rounded" /> : item.title || `Project ${i + 1}`}
                    </div>
                  ))}
                </div>
                <button onClick={() => setPortfolioEdit(true)} className="bg-purple-500 text-white px-4 py-2 rounded mt-2">Edit Portfolio</button>
              </div>
            )}
          </div>

          <div className="bg-white p-10 rounded-lg shadow">
            <h3 className="font-bold mb-4 text-lg">What Clients Say</h3>
            {testimonialEdit ? (
              <div>
                {testimonialForm.map((item, idx) => (
                  <div key={idx} className="mb-2 flex gap-2 items-center">
                    <input value={item.name} onChange={e => handleTestimonialChange(idx, 'name', e.target.value)} placeholder="Client Name" className="p-2 border rounded w-1/4" />
                    <input value={item.text} onChange={e => handleTestimonialChange(idx, 'text', e.target.value)} placeholder="Testimonial" className="p-2 border rounded w-1/2" />
                    <input value={item.date} onChange={e => handleTestimonialChange(idx, 'date', e.target.value)} placeholder="Date" className="p-2 border rounded w-1/4" />
                    <button onClick={() => handleRemoveTestimonial(idx)} className="text-red-500">Remove</button>
                  </div>
                ))}
                <button onClick={handleAddTestimonial} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Add Testimonial</button>
                <button onClick={handleTestimonialSave} disabled={testimonialSaving} className="bg-orange-500 text-white px-2 py-1 rounded">{testimonialSaving ? "Saving..." : "Save"}</button>
                <button onClick={() => setTestimonialEdit(false)} className="ml-2 px-2 py-1 border rounded">Cancel</button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                {(profile.testimonials || []).map((item, i) => (
                  <div key={i} className="border p-6 rounded space-y-2">
                    <p>{item.text}</p>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">👤</div>
                      <p className="text-gray-500 text-xs">– {item.name}, {item.date}</p>
                    </div>
                  </div>
                ))}
                <button onClick={() => setTestimonialEdit(true)} className="bg-purple-500 text-white px-4 py-2 rounded mt-2">Edit Testimonials</button>
              </div>
            )}
          </div>
        </div>

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