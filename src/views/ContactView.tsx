import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSent(true);
    showToast('Message Received', 'Our pet nutrition care team will reach out within 2 hours!');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div id="contact-support-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B4A]">Pet Parent Support</span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">We're here for your pack.</h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          Need help choosing the right diet for your dog or cat? Have questions about scheduled deliveries?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-2xs">
            <Phone className="w-5 h-5 text-[#4A154B] mb-2" />
            <h4 className="text-xs font-bold uppercase text-gray-400">Pet Care Helpline</h4>
            <p className="text-sm font-bold text-gray-900 mt-1">+1 (800) 873-2890</p>
            <p className="text-[11px] text-gray-500">Mon-Sat, 8am to 8pm EST</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-2xs">
            <Mail className="w-5 h-5 text-[#4A154B] mb-2" />
            <h4 className="text-xs font-bold uppercase text-gray-400">Email Inquiries</h4>
            <p className="text-sm font-bold text-gray-900 mt-1">support@treatz.shop</p>
            <p className="text-[11px] text-gray-500">Fast 2-hour response time</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-2xs">
            <Clock className="w-5 h-5 text-[#4A154B] mb-2" />
            <h4 className="text-xs font-bold uppercase text-gray-400">Nutritionists On Staff</h4>
            <p className="text-xs text-gray-600 mt-1">Certified companion animal diet advisors available for chat</p>
          </div>
        </div>

        <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-xs">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Send us a message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#4A154B]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#4A154B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Topic / Pet Question</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Food sensitivity inquiry for Bruno"
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#4A154B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Message</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what food or support you're looking for..."
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#4A154B]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#4A154B] text-white text-xs font-bold hover:bg-[#3B1443] flex items-center gap-2 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
