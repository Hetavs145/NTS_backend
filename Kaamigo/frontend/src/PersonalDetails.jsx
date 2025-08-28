import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import app from "./firebase";

const db = getFirestore(app);
const auth = getAuth();

export default function PersonalDetails() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    skills: "",
    rating: "",
    reviews: "",
    projects: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const user = auth.currentUser;
    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }
    try {
      await setDoc(doc(db, "users", user.uid), {
        ...form,
        email: user.email,
        uid: user.uid,
      });
      navigate("/explore/profile");
    } catch (err) {
      setError("Failed to save details. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-orange-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-4">Personal Details</h2>
        <input
          name="name"
          type="text"
          required
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400"
        />
        <input
          name="address"
          type="text"
          required
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400"
        />
        <input
          name="phone"
          type="tel"
          required
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400"
        />
        <input
          name="skills"
          type="text"
          required
          placeholder="Skills (e.g. Graphic Designer)"
          value={form.skills}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400"
        />
        <input
          name="rating"
          type="number"
          step="0.1"
          min="0"
          max="5"
          required
          placeholder="Rating (e.g. 4.9)"
          value={form.rating}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400"
        />
        <input
          name="reviews"
          type="number"
          min="0"
          required
          placeholder="Reviews (e.g. 1200)"
          value={form.reviews}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400"
        />
        <input
          name="projects"
          type="number"
          min="0"
          required
          placeholder="Projects (e.g. 77)"
          value={form.projects}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400"
        />
        {/* Add more fields as needed */}
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </form>
    </div>
  );
} 