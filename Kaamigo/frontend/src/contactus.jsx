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
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // In a real app, this would send the data to a backend API
      // For now, we'll simulate sending to support@kaamigo.com
      const emailData = {
        to: 'support@kaamigo.com',
        from: formData.email,
        subject: `Contact Form: ${formData.subject}`,
        body: `
          Name: ${formData.name}
          Email: ${formData.email}
          Subject: ${formData.subject}
          Message: ${formData.message}
        `
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSubmitStatus({
        success: true,
        message: 'Message sent successfully! We\'ll get back to you soon.'
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'Failed to send message. Please try again or email us directly at support@kaamigo.com'
      });
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
            
            {submitStatus && (
              <div className={`p-3 rounded-lg text-sm ${
                submitStatus.success 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {submitStatus.message}
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-orange-500 hover:scale-105 transition-all duration-300 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
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
