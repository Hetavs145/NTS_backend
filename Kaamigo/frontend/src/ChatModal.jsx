import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaPaperPlane, FaUser, FaHire, FaFlag } from "react-icons/fa";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebase";

export default function Chat({ open, onClose, otherUser, userType }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const messagesEndRef = useRef(null);

  const currentUser = auth.currentUser;
  const chatId = currentUser && otherUser ? 
    [currentUser.uid, otherUser.id].sort().join('_') : null;

  const reportReasons = [
    "Inappropriate behavior", "Spam or harassment", "Fake profile",
    "Payment issues", "Work quality issues", "Communication problems", "Other"
  ];

  useEffect(() => {
    if (!chatId) return;
    const q = query(collection(db, `chats/${chatId}/messages`), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;
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
    if (!confirm("Are you sure you want to hire this freelancer?")) return;
    try {
      await addDoc(collection(db, "hires"), {
        clientId: currentUser.uid,
        freelancerId: otherUser.id,
        status: "pending",
        createdAt: serverTimestamp(),
        chatId: chatId
      });
      alert("Hire request sent! The freelancer will be notified.");
    } catch (error) {
      console.error("Error hiring:", error);
      alert("Failed to send hire request.");
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) return;
    try {
      await addDoc(collection(db, "reports"), {
        reporterId: currentUser.uid,
        reportedUserId: otherUser.id,
        reason: reportReason,
        chatId: chatId,
        timestamp: serverTimestamp(),
        status: "pending"
      });
      setReportModal(false);
      setReportReason("");
      alert("Report submitted successfully. Our team will review it.");
    } catch (error) {
      console.error("Error reporting:", error);
      alert("Failed to submit report.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-purple-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
              <FaUser className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{otherUser?.name || "User"}</h3>
              <p className="text-sm text-gray-600">{otherUser?.location || "Location not specified"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setReportModal(true)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
              <FaFlag />
            </button>
            <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.senderId === currentUser?.uid ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp?.toDate?.()?.toLocaleTimeString() || 'Just now'}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />
            <button type="submit" disabled={loading || !newMessage.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">
              <FaPaperPlane />
            </button>
            {userType === 'client' && (
              <button type="button" onClick={handleHire}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                <FaHire /> Hire
              </button>
            )}
          </form>
        </div>
      </div>

      {reportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Report User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Report</label>
                <select value={reportReason} onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                  <option value="">Select a reason</option>
                  {reportReasons.map(reason => <option key={reason} value={reason}>{reason}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setReportModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleReport} disabled={!reportReason}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}