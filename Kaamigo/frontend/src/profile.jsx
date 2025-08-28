import React, { useState, useEffect } from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaVideo, FaBriefcase, FaUserAlt, FaCrown, FaQuestion, FaRocket, FaCamera, FaEdit, FaEnvelope, FaCalendarAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "./firebase";

const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);

export default function Profile() {
  const [isBooked, setIsBooked] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [profile, setProfile] = useState({ 
    name: "", 
    address: "", 
    phone: "", 
    skills: "", 
    projects: 0, 
    rating: 0, 
    reviews: 0, 
    about: "", 
    featuredReel: "",
    userType: "freelancer", // freelancer or client
    verification: {
      govtId: false,
      phone: false,
      email: false,
      address: false,
      panSsn: false
    }
  });
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
  const [profilePicEdit, setProfilePicEdit] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      const user = auth.currentUser;
      if (!user) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({
            ...data,
            userType: data.userType || "freelancer",
            verification: data.verification || {
              govtId: false,
              phone: false,
              email: false,
              address: false,
              panSsn: false
            }
          });
        }
      } catch (err) {
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    setAboutForm({ about: profile.about || "", specialization: profile.specialization || "", featuredReel: profile.featuredReel || "" });
    setPortfolioForm(profile.portfolio || []);
    setTestimonialForm(profile.testimonials || []);
  }, [profile]);

  const handleBook = () => {
    setIsBooked(true);
    // Redirect to chatbot
    window.location.href = '/explore?chat=true';
  };

  const handleMessage = () => {
    setMessageSent(true);
    // Redirect to chatbot
    window.location.href = '/explore?chat=true';
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (userType) => {
    setProfile({ ...profile, userType });
  };

  const handleVerificationUpdate = (type, verified) => {
    setProfile({
      ...profile,
      verification: {
        ...profile.verification,
        [type]: verified
      }
    });
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

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      
      const storageRef = ref(storage, `profilePics/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      // Update profile with new profile picture URL
      const updatedProfile = { ...profile, profilePic: url };
      await setDoc(doc(db, "users", user.uid), updatedProfile);
      setProfile(updatedProfile);
      setProfilePicEdit(false);
    } catch (err) {
      alert("Failed to upload profile picture");
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

  const handleServiceChange = (index, field, value) => {
    const newServices = [...(profile.services || [])];
    if (!newServices[index]) {
      newServices[index] = { title: "", description: "" };
    }
    newServices[index] = { ...newServices[index], [field]: value };
    setProfile({ ...profile, services: newServices });
  };

  const handleHire = () => {
    // Redirect to jobs page for hiring
    window.location.href = '/explore/jobs';
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
        
        {/* User Type Switch */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Switch Profile Type</h3>
          <div className="flex bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => handleUserTypeChange('freelancer')}
              className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors ${
                profile.userType === 'freelancer'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Freelancer
            </button>
            <button
              onClick={() => handleUserTypeChange('client')}
              className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors ${
                profile.userType === 'client'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Client
            </button>
          </div>
        </div>

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
            {/* Profile Picture Section */}
            <div className="relative mb-6">
              <img
                src={profile.profilePic || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlNt7Tl2jtLg7G15M-uMxtcPRwp6xW-xSJow&s"}
                alt="Profile"
                className="w-24 h-24 mx-auto rounded-full object-cover shadow-lg"
              />
              <button
                onClick={() => setProfilePicEdit(true)}
                className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors"
              >
                <FaCamera className="text-sm" />
              </button>
            </div>

            {/* Profile Picture Upload Modal */}
            {profilePicEdit && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg max-w-sm w-full">
                  <h3 className="text-lg font-semibold mb-4">Update Profile Picture</h3>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicUpload}
                    className="w-full mb-4"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setProfilePicEdit(false)}
                      className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

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
              className="mt-4 border px-6 py-3 rounded text-purple-500 hover:bg-purple-100"
            >
              {messageSent ? "Message Sent" : "Send Message"}
            </button>
            
            {/* Show Hire button only for clients */}
            {profile.userType === 'client' && (
              <button
                onClick={handleHire}
                className="mt-2 bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition-colors"
              >
                Hire a Freelancer
              </button>
            )}
            {/* Show Browse Jobs button only for freelancers */}
            {profile.userType === 'freelancer' && (
              <button
                onClick={() => window.location.href = '/explore/jobs'}
                className="mt-2 bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition-colors"
              >
                Browse Jobs
              </button>
            )}
          </div>

          <div className="bg-white p-10 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Verification Status</h3>
            <ul className="text-sm space-y-1 text-gray-600">
              <li className="flex items-center justify-between">
                <span>Govt ID</span>
                <button
                  onClick={() => handleVerificationUpdate('govtId', !profile.verification.govtId)}
                  className={`px-2 py-1 rounded text-xs ${
                    profile.verification.govtId 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {profile.verification.govtId ? 'Verified' : 'Verify'}
                </button>
              </li>
              <li className="flex items-center justify-between">
                <span>Phone</span>
                <button
                  onClick={() => handleVerificationUpdate('phone', !profile.verification.phone)}
                  className={`px-2 py-1 rounded text-xs ${
                    profile.verification.phone 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {profile.verification.phone ? 'Verified' : 'Verify'}
                </button>
              </li>
              <li className="flex items-center justify-between">
                <span>Email</span>
                <button
                  onClick={() => handleVerificationUpdate('email', !profile.verification.email)}
                  className={`px-2 py-1 rounded text-xs ${
                    profile.verification.email 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {profile.verification.email ? 'Verified' : 'Verify'}
                </button>
              </li>
              <li className="flex items-center justify-between">
                <span>Address</span>
                <button
                  onClick={() => handleVerificationUpdate('address', !profile.verification.address)}
                  className={`px-2 py-1 rounded text-xs ${
                    profile.verification.address 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {profile.verification.address ? 'Verified' : 'Verify'}
                </button>
              </li>
              <li className="flex items-center justify-between">
                <span>PAN/SSN</span>
                <button
                  onClick={() => handleVerificationUpdate('panSsn', !profile.verification.panSsn)}
                  className={`px-2 py-1 rounded text-xs ${
                    profile.verification.panSsn 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {profile.verification.panSsn ? 'Verified' : 'Verify'}
                </button>
              </li>
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
                {profile.userType === 'freelancer' && (
                  <>
                    <input name="skills" value={profile.skills} onChange={handleChange} placeholder="Skills" className="w-full p-2 border rounded" />
                    <input name="projects" type="number" value={profile.projects} onChange={handleChange} placeholder="Projects" className="w-full p-2 border rounded" />
                  </>
                )}
                <button onClick={handleSave} disabled={saving} className="bg-orange-500 text-white px-4 py-2 rounded">{saving ? "Saving..." : "Save"}</button>
                <button onClick={() => setEdit(false)} className="ml-2 px-4 py-2 border rounded">Cancel</button>
              </div>
            ) : (
              <div className="space-y-2">
                <div><b>Name:</b> {profile.name}</div>
                <div><b>Address:</b> {profile.address}</div>
                <div><b>Phone:</b> {profile.phone}</div>
                {profile.userType === 'freelancer' && (
                  <>
                    <div><b>Skills:</b> {profile.skills}</div>
                    <div><b>Projects:</b> {profile.projects}</div>
                  </>
                )}
                <button onClick={() => setEdit(true)} className="bg-purple-500 text-white px-4 py-2 rounded mt-2">Edit</button>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h2 className="text-xl font-bold">
              {profile.userType === 'client' ? 'Bio' : 'About Me'}
            </h2>
            {aboutEdit ? (
              <div className="space-y-3">
                <textarea 
                  name="about" 
                  value={aboutForm.about} 
                  onChange={handleAboutChange} 
                  placeholder={profile.userType === 'client' ? 'Tell us about your business or what you\'re looking for...' : 'About Me'} 
                  className="w-full p-2 border rounded" 
                />
                {profile.userType === 'freelancer' && (
                  <input name="specialization" value={aboutForm.specialization} onChange={handleAboutChange} placeholder="Specialization" className="w-full p-2 border rounded" />
                )}
                                  {profile.userType === 'freelancer' && (
                    <>
                      <label className="block text-sm font-medium mb-1">Upload Featured Reel (video):</label>
                      <input type="file" accept="video/*" onChange={handleReelUpload} className="w-full" />
                      {aboutForm.featuredReel && (
                        <video src={aboutForm.featuredReel} controls className="w-full h-48 rounded-lg" />
                      )}
                    </>
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
                {profile.userType === 'freelancer' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <h3 className="text-sm text-gray-600">🔹 Specialization <span className="text-purple-600 ml-2">{profile.specialization}</span></h3>
                </div>
                )}
                {profile.userType === 'freelancer' && (
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
                )}
                <button onClick={() => setAboutEdit(true)} className="bg-purple-500 text-white px-4 py-2 rounded mt-2">Edit About Me</button>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">
                {profile.userType === 'client' ? 'Open Gigs' : 'My Services'}
              </h3>
              {profile.userType === 'freelancer' && (
                <button 
                  onClick={() => setEdit(!edit)} 
                  className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition-colors"
                >
                  {edit ? 'Cancel' : 'Edit'}
                </button>
              )}
            </div>
            {edit && profile.userType === 'freelancer' ? (
              <div className="space-y-3">
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
                  {["Logo Design & Branding", "UI/UX Design", "Marketing Collateral", "Illustration & Iconography"].map((title, index) => (
                    <div key={title} className="border p-4 rounded-lg">
                      <input 
                        value={profile.services?.[index]?.title || title} 
                        onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                        className="w-full p-2 border rounded mb-2 font-semibold text-sm"
                        placeholder="Service Title"
                      />
                      <textarea 
                        value={profile.services?.[index]?.description || "Detailed service description goes here."} 
                        onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                        className="w-full p-2 border rounded text-xs text-gray-600"
                        placeholder="Service Description"
                        rows="3"
                      />
                    </div>
                  ))}
                </div>
                <button onClick={handleSave} disabled={saving} className="bg-purple-500 text-white px-4 py-2 rounded">
                  {saving ? "Saving..." : "Save Services"}
                </button>
              </div>
            ) : profile.userType === 'client' ? (
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg mb-2">No open gigs yet</p>
                  <p className="text-sm">Post your first job requirement to get started!</p>
                  <button 
                    onClick={() => window.location.href = '/explore/jobs'}
                    className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Post a Job
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 text-sm">
                {(profile.services || ["Logo Design & Branding", "UI/UX Design", "Marketing Collateral", "Illustration & Iconography"]).map((service, index) => (
                  <div key={index} className="border p-6 rounded-lg text-center bg-white shadow">
                    <h4 className="font-semibold text-sm mb-1">
                      {typeof service === 'string' ? service : service.title || `Service ${index + 1}`}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {typeof service === 'string' ? "Detailed service description goes here." : service.description || "Detailed service description goes here."}
                                         </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          )}

          {profile.userType === 'freelancer' && (
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
          )}

          {profile.userType === 'freelancer' && (
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