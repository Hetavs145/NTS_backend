import React, { useState, useRef } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ReelUpload = ({ onUploadSuccess }) => {
  const formRef = useRef(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  const categories = [
    "Design",
    "Development", 
    "Multimedia",
    "Writing",
    "Marketing",
    "Admin Support",
    "Consulting",
    "Finance",
    "Data Science"
  ];

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setUploadProgress(0);
    setSuccessMessage("");

    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      alert("Not logged in");
      setIsLoading(false);
      return;
    }

    const storage = getStorage();
    const thumbRef = ref(storage, `reels/${firebaseUser.uid}/thumbnails/${crypto.randomUUID()}`);
    const videoRef = ref(storage, `reels/${firebaseUser.uid}/videos/${crypto.randomUUID()}`);

    setUploadProgress(10);
    await uploadBytes(thumbRef, thumbnail);
    setUploadProgress(35);
    await uploadBytes(videoRef, video);
    setUploadProgress(60);

    const thumbUrl = await getDownloadURL(thumbRef);
    const videoUrl = await getDownloadURL(videoRef);
    setUploadProgress(80);

    try {
      // Convert tags from comma-separated string to array and trim whitespace
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      await addDoc(collection(db, "reels"), {
        title,
        description,
        category,
        tags: tagsArray,
        user_id: auth.currentUser.uid,
        thumbnail_url: thumbUrl,
        video_url: videoUrl,
        likes: 0,
        shares: 0,
        ratingTotal: 0,
        ratingCount: 0,
        comments: [],
        created_at: new Date().toISOString(),
      });

      setUploadProgress(100);
      setSuccessMessage("Reel uploaded successfully!");

      // Reset all form state variables
      setTitle("");
      setDescription("");
      setCategory("");
      setTags("");
      setThumbnail(null);
      setVideo(null);

      // Reset the form completely using the form reference
      if (formRef.current) {
        formRef.current.reset();
      }

      // Additionally reset file input elements directly
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input) => {
        input.value = "";
      });

      // Call the success callback to refresh reels
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (dbError) {
      console.error("DB Insert error:", dbError);
      alert("Failed to save reel metadata.");
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="space-y-6 bg-white p-8 rounded-xl shadow-lg border-2 border-purple-200 hover:border-purple-300 transition-colors duration-300">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-purple-600 mb-2">
          ⭐ Upload Your Reel
        </h2>
        <p className="text-gray-600">Share your skills and creativity with the Kaamigo community</p>
      </div>

      {successMessage && (
        <div className="bg-green-100 border-2 border-green-400 text-green-700 px-6 py-4 rounded-lg relative mb-6 text-center">
          <span className="block sm:inline font-semibold">{successMessage}</span>
        </div>
      )}

      <form
        ref={formRef}
        onSubmit={handleUpload}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Reel Title *
            </label>
            <input
              required
              placeholder="Enter an engaging title for your reel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <input
            placeholder="Enter tags separated by commas (e.g., web design, UI, creative)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-gray-500">Tags help others discover your reel</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            required
            placeholder="Describe your reel, what skills you're showcasing, or what viewers can learn"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            rows={4}
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Thumbnail Image *
            </label>
            <div className="border-2 border-dashed border-purple-200 rounded-lg p-6 text-center hover:border-purple-300 transition-colors duration-200">
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setThumbnail(e.target.files[0])}
                disabled={isLoading}
                className="hidden"
                id="thumbnail-upload"
              />
              <label htmlFor="thumbnail-upload" className="cursor-pointer">
                <div className="text-purple-500 mb-2">
                  <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  {thumbnail ? thumbnail.name : "Click to upload thumbnail"}
                </p>
                {thumbnail && (
                  <p className="text-xs text-purple-600 mt-1">✓ {thumbnail.name}</p>
                )}
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Video File *
            </label>
            <div className="border-2 border-dashed border-orange-200 rounded-lg p-6 text-center hover:border-orange-300 transition-colors duration-200">
              <input
                type="file"
                accept="video/*"
                required
                onChange={(e) => setVideo(e.target.files[0])}
                disabled={isLoading}
                className="hidden"
                id="video-upload"
              />
              <label htmlFor="video-upload" className="cursor-pointer">
                <div className="text-orange-500 mb-2">
                  <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  {video ? video.name : "Click to upload video"}
                </p>
                {video && (
                  <p className="text-xs text-orange-600 mt-1">✓ {video.name}</p>
                )}
              </label>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="space-y-3">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-600 to-orange-500 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-center text-gray-600 font-medium">
              {uploadProgress < 100 ? "Uploading your reel..." : "Processing..."}
            </p>
          </div>
        )}

        <div className="text-center">
          <button
            className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white shadow-lg hover:shadow-xl"
            }`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "🚀 Upload Reel"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ReelUpload;
