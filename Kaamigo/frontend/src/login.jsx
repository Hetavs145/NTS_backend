import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        navigate("/explore");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Sync minimal profile to Firestore
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          id: auth.currentUser.uid,
          email: auth.currentUser.email,
          name: auth.currentUser.displayName || "",
          photoUrl: auth.currentUser.photoURL || "",
          lastLoginAt: new Date().toISOString(),
        },
        { merge: true }
      );
      navigate("/explore");
    } catch (err) {
      console.error("Login error:", err);
      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found with this email");
          break;
        case "auth/wrong-password":
          setError("Incorrect password");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        case "auth/user-disabled":
          setError("This account has been disabled");
          break;
        default:
          setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const authProvider = new GoogleAuthProvider();
      await signInWithPopup(auth, authProvider);
      // Sync minimal profile to Firestore
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          id: auth.currentUser.uid,
          email: auth.currentUser.email,
          name: auth.currentUser.displayName || "",
          photoUrl: auth.currentUser.photoURL || "",
          lastLoginAt: new Date().toISOString(),
        },
        { merge: true }
      );
      navigate("/explore");
    } catch (err) {
      console.error("Social login failed:", err);
      setError("Social login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f3fc] px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-10">
          <h2 className="text-2xl font-bold text-[#6B5AED] mb-4">Login</h2>
          <h3 className="text-lg font-semibold mb-6">Begin your journey</h3>

          {/* Social on top to match signup */}
          <button
            onClick={handleSocialLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 p-3 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            <FaGoogle className="text-red-500 text-lg" />
            <span className="text-sm">Sign in with Google</span>
          </button>

          <div className="my-4 flex items-center gap-2 text-gray-400 text-sm">
            <div className="flex-grow border-t" /> OR <div className="flex-grow border-t" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="example.email@gmail.com"
              className="w-full p-3 border rounded bg-gray-100 text-sm disabled:opacity-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter at least 8+ characters"
                className="w-full p-3 border rounded bg-gray-100 text-sm disabled:opacity-50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={loading}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 text-sm disabled:opacity-50"
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>

            <div className="flex items-center text-xs text-gray-500">
              <input
                type="checkbox"
                required
                className="mr-2 accent-orange-500"
                disabled={loading}
              />
              By signing in, I agree with the{" "}
              <a href="#" className="text-orange-500 ml-1 underline">
                Terms of Use & Privacy Policy
              </a>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6B5AED] text-white p-3 rounded hover:bg-indigo-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          

          <p className="text-sm text-center mt-6 text-gray-500">
            New user?{" "}
            <a href="/sign" className="text-blue-600 font-medium underline">
              Register here
            </a>
          </p>
        </div>

        <div className="bg-gradient-to-t from-orange-300 to-pink-100 flex items-center justify-center px-8 py-10 text-center">
          <div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              Glad to see you here!
            </h3>
            <p className="text-sm text-gray-600">
              Login to start your career journey with Kaamigo...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
