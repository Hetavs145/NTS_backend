import React, { useState } from "react";
import { FaTimes, FaBriefcase, FaMapMarkerAlt, FaRupeeSign, FaCalendarAlt } from "react-icons/fa";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebase";

export default function PostJobModal({ open, onClose, onJobPosted }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    budgetMin: "",
    budgetMax: "",
    jobType: "one-time",
    requirements: "",
    deadline: "",
    skills: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    "Web Development", "Mobile Development", "Design & Creative",
    "Digital Marketing", "Writing & Translation", "Video & Animation",
    "Music & Audio", "Programming & Tech", "Business", "Lifestyle",
    "Data Science", "Other"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const jobData = {
        ...formData,
        clientId: user.uid,
        clientName: user.displayName || user.email,
        clientEmail: user.email,
        createdAt: serverTimestamp(),
        status: "open",
        applications: [],
        budgetMin: parseInt(formData.budgetMin),
        budgetMax: parseInt(formData.budgetMax)
      };

      const docRef = await addDoc(collection(db, "jobs"), jobData);
      setFormData({
        title: "", description: "", category: "", location: "",
        budgetMin: "", budgetMax: "", jobType: "one-time",
        requirements: "", deadline: "", skills: ""
      });
      onJobPosted({ id: docRef.id, ...jobData });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <FaBriefcase className="text-purple-600" />
            Post a Job Requirement
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
            <input
              type="text" name="title" value={formData.title} onChange={handleInputChange}
              required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Need a React Developer for E-commerce Website"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
            <select name="category" value={formData.category} onChange={handleInputChange} required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
              <option value="">Select a category</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Type *</label>
            <select name="jobType" value={formData.jobType} onChange={handleInputChange} required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
              <option value="one-time">One-time Project</option>
              <option value="ongoing">Ongoing Project</option>
              <option value="hourly">Hourly Work</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" name="location" value={formData.location} onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Delhi, India (or Remote)" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Budget Min (₹) *</label>
              <div className="relative">
                <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="number" name="budgetMin" value={formData.budgetMin} onChange={handleInputChange}
                  required min="0" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="1000" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Budget Max (₹) *</label>
              <div className="relative">
                <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="number" name="budgetMax" value={formData.budgetMax} onChange={handleInputChange}
                  required min="0" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="5000" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Deadline</label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="date" name="deadline" value={formData.deadline} onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Skills Required</label>
            <input type="text" name="skills" value={formData.skills} onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., React, Node.js, MongoDB (comma separated)" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Requirements</label>
            <textarea name="requirements" value={formData.requirements} onChange={handleInputChange} rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Describe the specific requirements, experience level, etc." />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description *</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Describe the job in detail, what needs to be done, expected deliverables, etc." />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">
              {loading ? "Posting..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}