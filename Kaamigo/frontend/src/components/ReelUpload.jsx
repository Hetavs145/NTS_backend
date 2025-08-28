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

    const thumbPath = `reels/thumbnails/${crypto.randomUUID()}`;
    const videoPath = `reels/videos/${crypto.randomUUID()}`;

    setUploadProgress(10);
    const storage = getStorage();
    const thumbRef = ref(storage, thumbPath);
    await uploadBytes(thumbRef, thumbnail);

    setUploadProgress(30);

    const videoRef = ref(storage, videoPath);
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
    <section className="space-y-4 bg-white p-7 rounded-xl shadow-lg border border-purple-100">
      <h2 className="text-3xl font-bold text-purple-600">
        ⭐ Upload Your Reel
      </h2>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      <form
        ref={formRef}
        onSubmit={handleUpload}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm"
      >
        <input
          required
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
        />
        <input
          required
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={isLoading}
        />
        <input
          required
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          disabled={isLoading}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
          className="col-span-2"
        />
        <label className={isLoading ? "opacity-50" : ""}>
          Thumbnail:{" "}
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setThumbnail(e.target.files[0])}
            disabled={isLoading}
          />
        </label>
        <label className={isLoading ? "opacity-50" : ""}>
          Video:{" "}
          <input
            type="file"
            accept="video/*"
            required
            onChange={(e) => setVideo(e.target.files[0])}
            disabled={isLoading}
          />
        </label>

        {isLoading && (
          <div className="col-span-2 mb-3">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-center mt-1 text-gray-500">
              {uploadProgress < 100 ? "Uploading..." : "Processing..."}
            </p>
          </div>
        )}

        <button
          className={`col-span-2 py-2 rounded ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </section>
  );
};

export default ReelUpload;
