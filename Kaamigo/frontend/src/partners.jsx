import React from 'react';

// Testimonials for the carousel
const testimonials = [
  {
    quote: "Kaamigo's collaborative approach has significantly amplified our reach in rural communities. Their solutions are truly transformative.",
    name: 'Dr. Anya Sharma',
    title: 'Director of Programs, Rural Impact Foundation',
  },
  {
    quote: "The investment in Kaamigo has not only yielded promising financial returns but also a profound social impact we are proud to support.",
    name: 'Mr. Vikram Singh',
    title: 'Lead Investor, Global Development Capital',
  },
  {
    quote: "Working with Kaamigo has empowered our SHG members with new skills and sustainable income opportunities. It's been a game-changer.",
    name: 'Mrs. Kavita Devi',
    title: 'SHG Federation Lead, Unity & Progress SHG',
  },
];

const Partners = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-orange-100 text-gray-800 animate-fade-in overflow-x-hidden">
    {/* Hero Section */}
    <div className="bg-gradient-to-r from-purple-200 to-orange-200 p-6 sm:p-10 text-center rounded-b-3xl shadow mb-10 animate-fade-in">
      <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-gray-800">Partner with Kaamigo: Empower Communities, Drive Growth</h1>
      <p className="max-w-2xl mx-auto mb-6 text-sm sm:text-lg text-gray-700">Join our mission to connect talent with opportunity. Collaborate with us to unlock new markets, empower local communities, and drive business growth.</p>
      <button 
        onClick={() => {
          // Open email client with partnership inquiry
          const subject = encodeURIComponent('Partnership Inquiry - Kaamigo');
          const body = encodeURIComponent(`Hi Kaamigo Team,

I'm interested in becoming a partner with Kaamigo. Here are some details about my organization:

Organization Name:
Industry:
Partnership Type (Co-branding, Skill Development, Innovation Labs, etc.):
Expected Impact:
Contact Information:

Looking forward to discussing potential collaboration opportunities.

Best regards,
[Your Name]`);
          
          window.location.href = `mailto:partnerships@kaamigo.com?subject=${subject}&body=${body}`;
        }}
        className="bg-gradient-to-r from-purple-500 to-orange-400 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-bold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
      >
        Become a Partner
      </button>
    </div>

    {/* Why Partner With Us */}
    <section className="max-w-6xl mx-auto py-10 px-4 animate-fade-in">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-8 text-purple-700">Why Partner With Us</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
        {["🌐", "🤝", "🚀"].map((icon, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-xl p-6 text-center border-2 border-purple-100 hover:scale-105 hover:shadow-2xl hover:border-orange-300 transition-all duration-300">
            <div className="text-3xl mb-2">{icon}</div>
            <h3 className="font-semibold mb-2 text-purple-700">{["Expand Your Reach", "Collaborate for Impact", "Accelerate Growth"][i]}</h3>
            <p className="text-gray-600">{["Access new markets and connect with a diverse talent pool across India.", "Work with us to empower local communities and drive positive change.", "Leverage our platform to scale your business and achieve your goals faster."][i]}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Go-To-Market Strategies */}
    <section className="max-w-6xl mx-auto py-10 px-4 animate-fade-in">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-8 text-orange-600">Our Go-To-Market Strategies</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
        {["📢", "🎓", "💡"].map((icon, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-xl p-6 text-center border-2 border-orange-100 hover:scale-105 hover:shadow-2xl hover:border-purple-300 transition-all duration-300">
            <div className="text-3xl mb-2">{icon}</div>
            <h3 className="font-semibold mb-2 text-orange-600">{["Co-Branded Campaigns", "Skill Development", "Innovation Labs"][i]}</h3>
            <p className="text-gray-600">{["Launch joint marketing campaigns to maximize visibility and engagement.", "Empower communities with training and upskilling programs.", "Collaborate on new solutions to address market needs and challenges."][i]}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Impact & Metrics */}
    <section className="max-w-6xl mx-auto py-10 px-4 flex flex-col md:flex-row gap-8 items-center animate-fade-in">
      <div className="flex-1 flex flex-col items-center">
        <div className="w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-tr from-blue-200 to-purple-200 rounded-full flex items-center justify-center mb-4 animate-pulse">
          <span className="text-3xl sm:text-5xl font-bold text-blue-700">75%</span>
        </div>
        <div className="text-center text-gray-600 text-sm sm:text-base">Community Engagement Rate</div>
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-md sm:text-lg mb-2 text-purple-700">Our Impact at Scale</h3>
        <p className="text-gray-600 mb-2 text-sm sm:text-base">We have empowered thousands of freelancers and businesses, driving economic growth and social impact in emerging markets.</p>
        <div className="bg-blue-50 rounded p-4 text-xs sm:text-sm text-blue-700 animate-fade-in-slow">"Partnering with Kaamigo helped us reach new audiences and create meaningful change."</div>
      </div>
    </section>

    {/* What Our Partners Say */}
    <section className="max-w-6xl mx-auto py-16 px-4 animate-fade-in">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-800">What Our Partners Say</h2>
      <div className="relative overflow-x-hidden">
        <div className="flex w-max animate-carousel gap-6 sm:gap-8">
          {Array(2).fill(testimonials).flat().map((t, i) => (
            <div key={i} className="min-w-[260px] sm:min-w-[320px] max-w-xs bg-white rounded-2xl shadow-xl p-6 mx-2 border border-purple-100 flex flex-col justify-between">
              <div className="text-gray-700 mb-4 text-sm sm:text-base">"{t.quote}"</div>
              <div className="font-bold text-purple-700 text-xs sm:text-sm">{t.name}</div>
              <div className="text-xs text-gray-500">{t.title}</div>
            </div>
          ))}
        </div>
        <style>{`
          @keyframes carousel {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-carousel {
            animation: carousel 30s linear infinite;
          }
        `}</style>
      </div>
    </section>

    {/* footer rendered globally */}

    {/* Animations */}
    <style>{`
      .animate-fade-in { animation: fadeIn 1s ease; }
      .animate-fade-in-slow { animation: fadeIn 1.5s ease; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
    `}</style>
  </div>
);

export default Partners;
