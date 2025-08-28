import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase";
import { FaGoogle } from "react-icons/fa";

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSocialClick = async () => {
    setError("");
    setLoading(true);
    try {
      const authProvider = new GoogleAuthProvider();
      await signInWithPopup(auth, authProvider);
      navigate("/explore");
    } catch (err) {
      console.error("Social login error:", err);
      setError("Social login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      navigate("/explore");
    } catch (err) {
      console.error("Signup error:", err);
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email is already registered");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        case "auth/weak-password":
          setError("Password is too weak");
          break;
        default:
          setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-orange-100 px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-bl from-purple-600 to-fuchsia-500 text-white flex flex-col justify-center items-center p-10">
          <h2 className="text-4xl font-bold mb-4 text-center">Welcome again!</h2>
          <p className="text-lg text-center">Sign up to start your journey with Kaamigos</p>
        </div>

        <div className="p-10 flex flex-col justify-center">
          <p className="text-sm text-right text-gray-600 mb-4">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-medium underline">Log in</a>
          </p>

          <h2 className="text-3xl font-bold text-orange-600 mb-6">Sign Up</h2>

          <div className="space-y-3 mb-6">
            <button
              onClick={handleSocialClick}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 p-3 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaGoogle className="text-red-500 text-lg" />
              <span className="text-sm">Sign up with Google</span>
            </button>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-4 text-sm text-gray-500">OR</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email"
              type="email"
              required
              placeholder="example.email@gmail.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
            />

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter at least 8+ characters"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={togglePassword}
                disabled={loading}
                className="absolute top-3.5 right-3 text-gray-600 text-sm disabled:opacity-50"
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>

            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
            />

            <div className="flex items-start gap-2">
              <input type="checkbox" required className="accent-purple-500 mt-1" disabled={loading} />
              <label className="text-sm text-gray-600">
                By signing up, I agree to the{" "}
                <a href="/terms" className="text-orange-600 underline hover:text-orange-800">
                  Terms of Use and Privacy Policy
                </a>
              </label>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create an Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}