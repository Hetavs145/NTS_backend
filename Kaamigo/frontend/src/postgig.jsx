import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { db } from "./firebase"; // adjust the path as needed
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getDoc, doc } from "firebase/firestore";
export default function PostGigModal({ open, onClose, onGigPosted }) {
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    location: "",
    budgetMin: "",
    budgetMax: "",
    jobType: "",
    description: "",
  });

  const inputBox =
    "w-full rounded-lg bg-gray-50 px-4 py-3 border-2 border-gray-200 focus:border-purple-500 focus:bg-white focus:shadow-sm transition";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function fillCurrentLocation() {
    if (!navigator.geolocation) return alert("Geolocation not supported.");
    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || "";
          const state = data.address?.state || "";
          const loc = city && state ? `${city}, ${state}` : data.display_name;
          setForm((f) => ({ ...f, location: loc }));
        } catch {
          alert("Couldn’t fetch location.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        alert("Permission denied.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const newGigData = {
    ...form,
    postedAt: "Just now",
    createdAt: serverTimestamp(),
    category: "General", // <-- Make sure it's included for filters
  };

  try {
    const docRef = await addDoc(collection(db, "jobs"), newGigData);
    
    // Refetch the full job data from Firestore (with serverTimestamp resolved)
    const savedDoc = await getDoc(docRef);
    const savedData = { id: docRef.id, ...savedDoc.data() };

    onGigPosted && onGigPosted(savedData);

    setForm({
      title: "",
      location: "",
      budgetMin: "",
      budgetMax: "",
      jobType: "",
      description: "",
    });
    onClose();
  } catch (error) {
    alert("Failed to post gig. Try again.");
    console.error("Firestore Error:", error);
  } finally {
    setLoading(false);
  }
};


  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-[90%] max-w-md max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        {/* header */}
        <header className="p-6 pb-3">
          <h2 className="text-2xl font-extrabold text-purple-700 tracking-wide">
            Post a Gig
          </h2>
        </header>

        {/* accent line */}
        <div className="relative h-1 w-full overflow-hidden">
          <div className="absolute inset-0 animate-[slide_4s_linear_infinite] bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500" />
        </div>

        {/* scrollable form body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 overflow-y-auto"
          style={{ maxHeight: "calc(85vh - 114px)" }}
        >
          {/* title */}
          <div>
            <label htmlFor="title" className="block text-base font-semibold mb-1">
              Gig title
            </label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Senior Carpenter"
              required
              className={inputBox}
            />
          </div>

          {/* location */}
          <div>
            <label htmlFor="location" className="block text-base font-semibold mb-1">
              Location
            </label>
            <div className="relative">
              <input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="City, State"
                required
                className={`${inputBox} pr-36`}
              />
              <button
                type="button"
                onClick={fillCurrentLocation}
                disabled={locating}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-full border border-purple-300 bg-purple-50 px-3 py-1 text-xs text-purple-700 hover:bg-purple-100 disabled:opacity-50"
              >
                <FaMapMarkerAlt className="text-[10px]" />
                {locating ? "Locating…" : "Use my location"}
              </button>
            </div>
          </div>

          {/* budget row */}
          <div className="flex gap-4">
            <div className="flex-1">
                              <label htmlFor="budgetMin" className="block text-base font-semibold mb-1">
                  Budget min (₹)
                </label>
              <input
                type="number"
                id="budgetMin"
                name="budgetMin"
                value={form.budgetMin}
                onChange={handleChange}
                required
                className={inputBox}
              />
            </div>
            <div className="flex-1">
                              <label htmlFor="budgetMax" className="block text-base font-semibold mb-1">
                  Budget max (₹)
                </label>
              <input
                type="number"
                id="budgetMax"
                name="budgetMax"
                value={form.budgetMax}
                onChange={handleChange}
                required
                className={inputBox}
              />
            </div>
          </div>

          {/* job type */}
          <div>
            <label htmlFor="jobType" className="block text-base font-semibold mb-1">
              Job type
            </label>
            <select
              id="jobType"
              name="jobType"
              value={form.jobType}
              onChange={handleChange}
              required
              className={`${inputBox} bg-white`}
            >
              <option value="">Choose one…</option>
              <option>Full Time</option>
              <option>Part Time</option>
              <option>Contract</option>
            </select>
          </div>

          {/* description */}
          <div>
            <label htmlFor="description" className="block text-base font-semibold mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              required
              className={`${inputBox} resize-none`}
            />
          </div>

          {/* submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 py-3 text-base font-semibold text-white shadow-md transition hover:shadow-xl disabled:opacity-50"
          >
            {loading ? "Posting…" : "Post Gig"}
          </button>
        </form>
      </div>

      {/* slide animation keyframes */}
      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
