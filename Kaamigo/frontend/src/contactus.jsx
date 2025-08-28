import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';

const faqs = [
  {
    q: 'What is Kaamigo and how does it help freelancers?',
    a: 'Kaamigo is a platform connecting freelancers and clients, especially in Tier 2/3 India, using voice-first and reels-powered features.'
  },
  {
    q: 'What is the difference between Free Plan and Kaamigo Pro?',
    a: 'Kaamigo Pro offers advanced features and more visibility for freelancers and clients compared to the Free Plan.'
  },
  {
    q: 'How can I partner with Kaamigo?',
    a: 'You can reach out via the contact form or email us directly at support@kaamigo.com for partnership opportunities.'
  },
  {
    q: 'Is my data secure with Kaamigo?',
    a: 'Yes, we take data security seriously and use industry-standard practices to protect your information.'
  },
  {
    q: 'How do I download the Kaamigo app?',
    a: 'You can download the app from the Google Play Store or Apple App Store (coming soon).'
  },
  {
    q: 'What makes Kaamigo different from other platforms?',
    a: 'Kaamigo focuses on voice-first, reels-powered connections and Tier 2/3 India, making it unique.'
  }
];

const ContactUs = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create mailto link with filled fields
      const mailtoLink = `mailto:support@kaamigo.com?subject=${encodeURIComponent(`Contact Form: ${formData.subject}`)}&body=${encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}

---
This message was sent from the Kaamigo contact form.
      `)}`;

      // Open default mail client
      window.location.href = mailtoLink;

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      console.error('Error opening mail client:', error);
      // Fallback: show success message
      alert('Message prepared! Please check your default mail client.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf6f6] text-gray-800 px-4">
      <div className="w-full bg-gradient-to-r from-purple-700 via-purple-500 to-orange-500 py-20 text-center rounded-b-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">Let's Connect & Build Together!</h1>
        <p className="text-base md:text-lg text-white/90 max-w-3xl mx-auto">Have questions about Kaamigo or want to partner? Reach out and let's start the conversation!</p>
      </div>

      <div className="max-w-7xl mx-auto mt-16 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-purple-100">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-purple-700"><FaEnvelope />Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" 
                placeholder="Your Name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="flex-1 px-4 py-2 rounded-lg border-2 border-purple-100 focus:ring-2 focus:ring-orange-300 focus:outline-none" 
              />
              <input 
                type="email" 
                placeholder="Your Email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="flex-1 px-4 py-2 rounded-lg border-2 border-purple-100 focus:ring-2 focus:ring-orange-300 focus:outline-none" 
              />
            </div>
            <input 
              type="text" 
              placeholder="Subject" 
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              required
              className="w-full px-4 py-2 rounded-lg border-2 border-purple-100 focus:ring-2 focus:ring-orange-300 focus:outline-none" 
            />
            <textarea 
              rows="4" 
              placeholder="Your Message" 
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
              className="w-full px-4 py-2 rounded-lg border-2 border-purple-100 focus:ring-2 focus:ring-orange-300 focus:outline-none"
            ></textarea>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-orange-500 hover:scale-105 transition-all duration-300 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Preparing Message...' : 'Send Message'}
            </button>
            
            <p className="text-sm text-gray-500 text-center">
              This will open your default mail client with a pre-filled message
            </p>
          </form>
        </div>

        <div className="flex-1 bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-orange-100">
          <h2 className="text-2xl font-bold mb-6 text-orange-500">Get In Touch</h2>
          <div className="space-y-6">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-purple-700">Email:</span>
              <a href="mailto:support@kaamigo.com" className="text-purple-600 hover:underline">support@kaamigo.com</a>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-orange-600">Phone:</span>
              <a href="tel:+1234567890" className="text-orange-500 hover:underline">+1 (234) 567-890</a>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-purple-700">Office:</span>
              <span className="text-gray-700">123 Kaamigo Street, Digital City, DC 98765</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 mb-20">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Frequently Asked Questions</h2>
        <p className="text-center text-gray-500 mb-8">Find answers to common questions about Kaamigo</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl bg-gradient-to-r from-purple-50 to-orange-50 p-4 shadow-md border border-purple-100">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left font-semibold text-lg text-purple-700"
              >
                {faq.q}
              </button>
              {openFaq === i && <p className="mt-2 text-gray-700">{faq.a}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* footer rendered globally */}
    </div>
  );
};

export default ContactUs;
