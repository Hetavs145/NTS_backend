import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#181B23] py-10 text-center text-gray-300 mt-16 px-4 relative">
      {/* Back-to-top icon near top-right */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="absolute -top-4 right-4 bg-orange-600 hover:bg-orange-500 text-white w-10 h-10 rounded-full shadow flex items-center justify-center"
        aria-label="Scroll to top"
        title="Back to top"
      >
        ^
      </button>

      <div className="mb-4 flex flex-wrap justify-center gap-3 text-sm">
        <span className="font-semibold text-purple-300">Our Pages:</span>
        <Link to="/" className="hover:text-orange-400 transition">Home</Link>
        <Link to="/explore" className="hover:text-orange-400 transition">Explore</Link>
        <Link to="/about" className="hover:text-orange-400 transition">About Us</Link>
        <Link to="/partners" className="hover:text-orange-400 transition">Partners</Link>
        <Link to="/coins" className="hover:text-orange-400 transition">Coins</Link>
        <Link to="/contact" className="hover:text-orange-400 transition">Contact Us</Link>
        <Link to="/blog" className="hover:text-orange-400 transition">Blog</Link>
      </div>
      <div className="flex items-center justify-center gap-5 mb-4 text-xl">
        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-orange-400 transition"><FaInstagram/></a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-orange-400 transition"><FaTwitter/></a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-orange-400 transition"><FaLinkedin/></a>
        <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-orange-400 transition"><FaFacebook/></a>
      </div>
      <div className="text-3xl font-bold text-purple-400 mb-2">Kaamigo</div>
      <div className="mb-2 text-sm">Connecting talent with opportunities through voice-first innovation</div>
      <div className="text-xs text-gray-500">© {new Date().getFullYear()} Kaamigo. All rights reserved.</div>
    </footer>
  );
}

