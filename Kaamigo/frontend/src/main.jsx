import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import LandingPage from "./landingpage.jsx";
import ContactUs from "./contactus.jsx";
import Coins from "./coins.jsx";
import Partners from "./partners.jsx";
import { Navbar } from "./landingpage.jsx";
import AboutPage from "./about.jsx";
import Blog from "./blog.jsx";
import Signup from "./sign.jsx";
import LoginPage from "./login.jsx";
import Explore from "./explore.jsx";
import MapWithRadius from "./mapWithRedius.jsx";
import "leaflet/dist/leaflet.css";
import Reels from "./reels.jsx";
import Jobs from "./job.jsx";
import Profile from "./profile.jsx";
import Features from "./feature.jsx";
import HowItWorks from "./howItWork.jsx";
import FeatureBtn from "./premium.jsx";
import PersonalDetails from "./personalDetails.jsx";
import Footer from "./components/Footer.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";
import Chatbot from "./components/Chatbot.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/coins" element={<Coins />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/sign" element={<Signup/>} />
        <Route path="/sign/:type" element={<Signup/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/explore" element={<Explore/>} />
        <Route path="/explore/reels" element={<Reels/>} />
        <Route path="/explore/jobs" element={<Jobs/>} />
        <Route path="/explore/post-job" element={<PostJobModal isOpen={true} onClose={() => navigate('/explore/jobs')} />} />
        <Route path="/explore/profile" element={<Profile/>} />
        <Route path="/explore/features" element={<Features/>} />
        <Route path="/explore/how-it-works" element={<HowItWorks/>} />
        <Route path="/explore/featurebtn" element={<FeatureBtn/>} />
        <Route path="/dashboard" element={<PersonalDetails/>} />
        <Route path="/coming-soon" element={<ComingSoon/>} />
      </Routes>
      <Footer />
      <Chatbot />
    </BrowserRouter>
  </StrictMode>
);