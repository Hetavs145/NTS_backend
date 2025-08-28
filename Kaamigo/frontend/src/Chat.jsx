import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaPaperPlane, FaUser, FaHire } from "react-icons/fa";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { getAuth } from "firebase/auth";

const Chat = ({ isOpen, onClose, otherUser, chatId, userType }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!chatId || !currentUser) return;

    const q = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messageList);
    });

    return () => unsubscribe();
  }, [chatId, currentUser]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId || !currentUser) return;

    setLoading(true);
    try {
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        text: newMessage.trim(),
        senderId: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email,
        timestamp: serverTimestamp(),
        userType: userType
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleHire = async () => {
    if (!currentUser || !otherUser) return;
    
    try {
      // Create a hire request
      await addDoc(collection(db, "hires"), {
        clientId: userType === "client" ? currentUser.uid : otherUser.id,
        freelancerId: userType === "freelancer" ? currentUser.uid : otherUser.id,
        jobId: chatId,
        status: "pending",
        createdAt: serverTimestamp(),
        message: "Hire request sent"
      });
      
      // Send a system message
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        text: "Hire request sent!",
        senderId: "system",
        senderName: "System",
        timestamp: serverTimestamp(),
        userType: "system"
      });
    } catch (error) {
      console.error("Error sending hire request:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold">
              {otherUser?.name?.charAt(0) || "U"}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {otherUser?.name || "User"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {otherUser?.role || "Professional"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === currentUser?.uid ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === currentUser?.uid
                    ? "bg-purple-600 text-white"
                    : message.senderId === "system"
                    ? "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-center mx-auto"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                }`}
              >
                {message.senderId !== "system" && (
                  <div className="text-xs opacity-75 mb-1">
                    {message.senderName}
                  </div>
                )}
                <div>{message.text}</div>
                <div className="text-xs opacity-75 mt-1">
                  {message.timestamp?.toDate?.()?.toLocaleTimeString() || "Now"}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={sendMessage} className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !newMessage.trim()}
              className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaPaperPlane />
            </button>
            {userType === "client" && (
              <button
                type="button"
                onClick={handleHire}
                className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                title="Hire this freelancer"
              >
                <FaHire />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
