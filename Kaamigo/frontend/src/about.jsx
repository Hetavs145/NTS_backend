import React from 'react';
import { FaEnvelope, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';

const teamMembers = [
  { name: 'Aditi Sharma', role: 'Co-Founder', img: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { name: 'Rohan Verma', role: 'CTO', img: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { name: 'Sneha Gupta', role: 'CMO', img: 'https://randomuser.me/api/portraits/women/3.jpg' },
  { name: 'Aryan Mehta', role: 'Product Lead', img: 'https://randomuser.me/api/portraits/men/4.jpg' },
];

const AboutPage = () => {
  return (
    <div className="bg-orange-50 text-gray-800">
      {/* Header Section */}
      <section className="text-center py-10 px-4 bg-gradient-to-r from-orange-100 to-purple-100">
        <h1 className="text-4xl font-bold text-purple-700 mb-4">Our Mission</h1>
        <p className="max-w-3xl mx-auto text-lg">
          To empower everyday individuals across India by making social freelance opportunities accessible,
          trusted, and voice-driven — bridging skill with demand through reels, real-time discovery, and regional inclusivity.
        </p>
      </section>

      {/* Mission & Vision Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-6 py-12 max-w-5xl mx-auto">
        <div className="bg-white shadow-lg p-6 rounded-xl text-center border border-purple-100">
          <h3 className="text-xl font-semibold text-purple-600 mb-2">Our Mission</h3>
          <p>
            We strive to connect freelancers and businesses through voice-first, reel-based storytelling,
            making work accessible to Tier 2/3 India.
          </p>
        </div>
        <div className="bg-white shadow-lg p-6 rounded-xl text-center border border-orange-100">
          <h3 className="text-xl font-semibold text-orange-600 mb-2">Our Vision</h3>
          <p>
            To be India’s most trusted freelance ecosystem focused on inclusivity, opportunity, and innovation.
          </p>
        </div>
      </section>

      {/* How We Help */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-8">Together, We Find A Way</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <h4 className="font-bold text-orange-500 mb-2">Who we are</h4>
            <p className="text-sm">A team of dreamers from Bharat creating voice-first tech for employment.</p>
          </div>
          <div>
            <h4 className="font-bold text-orange-500 mb-2">How we help</h4>
            <p className="text-sm">By matching people with opportunities via short reels and voice.</p>
          </div>
          <div>
            <h4 className="font-bold text-orange-500 mb-2">What we do</h4>
            <p className="text-sm">Bridge the skill-access gap with trust, simplicity, and community.</p>
          </div>
          <div>
            <h4 className="font-bold text-orange-500 mb-2">Why we care</h4>
            <p className="text-sm">We believe talent exists everywhere — it just needs a chance.</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white py-12 px-6">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-10">Meet Our Team</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {teamMembers.map((member, i) => (
            <div key={i} className="text-center">
              <img
                src={member.img}
                alt={member.name}
                className="rounded-full w-24 h-24 mx-auto mb-3 object-cover"
              />
              <h4 className="font-semibold text-purple-600">{member.name}</h4>
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stay Connected */}
      <section className="py-10 px-6 bg-gradient-to-r from-purple-50 to-orange-50">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">Stay Connected</h2>
        <div className="flex flex-col items-center justify-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 rounded-lg border border-gray-300 w-full max-w-md focus:outline-none"
          />
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all">
            Subscribe
          </button>
          <div className="text-center text-gray-600 text-sm">
            <p>Get in touch with us at <a href="mailto:info@kaamigo.com" className="text-purple-600 hover:underline">info@kaamigo.com</a></p>
          </div>
        </div>
      </section>

      {/* footer rendered globally */}
    </div>
  );
};

export default AboutPage;
