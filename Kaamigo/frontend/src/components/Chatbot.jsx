import React, { useState, useRef, useEffect } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaRobot } from 'react-icons/fa';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const faqs = [
    {
      question: "How do I become a featured freelancer?",
      answer: "To become a featured freelancer, you need to subscribe to Kaamigo Pro. This unlocks premium features and puts your profile at the top of search results."
    },
    {
      question: "How does the rating system work?",
      answer: "Clients can rate freelancers from 1-5 stars after work completion. This helps build your reputation and visibility on the platform."
    },
    {
      question: "What are the subscription plans?",
      answer: "We offer Kaamigo Basic (free) and Kaamigo Pro (₹1000/month or ₹800/month when billed annually) with advanced features."
    },
    {
      question: "How do I hire a freelancer?",
      answer: "Browse profiles, use filters to find the right match, and click 'Hire' or 'Send Message' to start a conversation."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major credit cards, UPI, and net banking. Payments are held securely until work completion."
    },
    {
      question: "How do I earn coins?",
      answer: "Complete daily tasks, participate in forums, read articles, and invite friends to earn coins that can be used for premium features."
    }
  ];

  useEffect(() => {
    if (isOpen) {
      // Add welcome message
      setMessages([
        {
          id: 1,
          text: "Hi! I'm Kaamigo Assistant. How can I help you today?",
          isBot: true,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1000);
  };

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Check for FAQ matches
    for (const faq of faqs) {
      if (input.includes(faq.question.toLowerCase().split(' ').slice(0, 3).join(' '))) {
        return faq.answer;
      }
    }

    // Check for keywords
    if (input.includes('featured') || input.includes('pro') || input.includes('subscription')) {
      return "To become a featured freelancer, subscribe to Kaamigo Pro for ₹1000/month or ₹800/month when billed annually. This unlocks premium features and top visibility!";
    }
    
    if (input.includes('hire') || input.includes('find') || input.includes('freelancer')) {
      return "You can find and hire freelancers by browsing profiles in the Explore section, using filters for skills and location, and clicking 'Hire' or 'Send Message' to start working together!";
    }
    
    if (input.includes('coin') || input.includes('bonus') || input.includes('earn')) {
      return "Earn coins by completing daily tasks, reading articles, participating in forums, and inviting friends. Coins unlock premium features and special rewards!";
    }
    
    if (input.includes('payment') || input.includes('pay') || input.includes('money')) {
      return "We accept all major credit cards, UPI, and net banking. Payments are held securely until work completion to ensure both parties are satisfied!";
    }

    // Default response
    return "I'm here to help! You can ask me about becoming a featured freelancer, hiring, payments, coins, or any other platform-related questions. What would you like to know?";
  };

  const handleQuickQuestion = (faq) => {
    const botMessage = {
      id: Date.now(),
      text: faq.answer,
      isBot: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center"
      >
        <FaComments className="text-2xl" />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-end p-4">
          <div className="bg-white rounded-t-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-orange-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaRobot className="text-2xl" />
                <div>
                  <h3 className="font-bold">Kaamigo Assistant</h3>
                  <p className="text-sm opacity-90">Online • Ready to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-purple-600 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            <div className="p-4 border-t bg-gray-50">
              <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {faqs.slice(0, 3).map((faq, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(faq)}
                    className="text-xs bg-white border border-purple-200 text-purple-700 px-2 py-1 rounded-full hover:bg-purple-50 transition-colors"
                  >
                    {faq.question.split(' ').slice(0, 3).join(' ')}...
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-purple-500 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaPaperPlane className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;