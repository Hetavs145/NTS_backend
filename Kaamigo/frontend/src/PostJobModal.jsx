import React, { useState } from "react";
import { FaTimes, FaBriefcase, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaFileAlt } from "react-icons/fa";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { getAuth } from "firebase/auth";

const PostJobModal = ({ isOpen, onClose, onJobPosted }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    jobType: "",
    location: "",
    budgetMin: "",
    budgetMax: "",
    deadline: "",
    requirements: "",
    skills: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const auth = getAuth();

  const categories = [
    "Web Development", "Mobile Development", "Design", "Content Writing", 
    "Video Editing", "Digital Marketing", "Data Entry", "Translation",
    "Virtual Assistant", "Other"
  ];

  const jobTypes = ["One-time", "Ongoing", "Hourly", "Fixed Price"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setError("Please login to post a job");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const jobData = {
        ...form,
        clientId: auth.currentUser.uid,
        clientName: auth.currentUser.displayName || auth.currentUser.email,
        clientEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
        status: "open",
        applications: [],
        isActive: true
      };

      await addDoc(collection(db, "jobs"), jobData);
      setForm({
        title: "", description: "", category: "", jobType: "", location: "",
        budgetMin: "", budgetMax: "", deadline: "", requirements: "", skills: ""
      });
      onJobPosted();
      onClose();
    } catch (err) {
      setError("Failed to post job. Please try again.");
      console.error("Error posting job:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FaBriefcase className="text-purple-600" />
              Post a Job Requirement
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Website Developer Needed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Type *
              </label>
              <select
                name="jobType"
                value={form.jobType}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Type</option>
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FaMapMarkerAlt className="inline mr-2 text-purple-600" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="City, State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FaCalendarAlt className="inline mr-2 text-purple-600" />
                Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FaMoneyBillWave className="inline mr-2 text-purple-600" />
                Budget Min (₹) *
              </label>
              <input
                type="number"
                name="budgetMin"
                value={form.budgetMin}
                onChange={handleChange}
                required
                min="0"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FaMoneyBillWave className="inline mr-2 text-purple-600" />
                Budget Max (₹) *
              </label>
              <input
                type="number"
                name="budgetMax"
                value={form.budgetMax}
                onChange={handleChange}
                required
                min="0"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="5000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FaFileAlt className="inline mr-2 text-purple-600" />
              Job Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Describe the job requirements, responsibilities, and expectations..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Required Skills
            </label>
            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="e.g., React, Node.js, UI/UX Design"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Requirements
            </label>
            <textarea
              name="requirements"
              value={form.requirements}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Any specific requirements, experience level, or qualifications needed..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Posting..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobModal;
