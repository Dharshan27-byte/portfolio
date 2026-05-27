import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiCpu } from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL } from '../config.js';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: "System initialized. Hello, I am Yoga's neural proxy assistant. Ask me anything about his skills, projects, certifications, or background." 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const chatEndRef = useRef(null);

  const suggestionPills = [
    "Who is Yoga Dharshan?",
    "What are his skills?",
    "Show his key projects",
    "How to contact him?"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (!textToSend) setInput('');

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/chatbot`, { message: text });
      setMessages(prev => [...prev, { sender: 'bot', text: response.data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: "Error establishing connection. The neural bridge has failed. Please verify local connection or backend endpoints." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="w-[90vw] sm:w-[380px] h-[500px] glassmorphism rounded-2xl border border-cyan-500/20 shadow-2xl flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-cyan-950/80 to-purple-950/80 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FiCpu className="text-cyan-400 w-5 h-5 animate-pulse" />
                <div>
                  <h3 className="font-mono text-sm font-bold text-white tracking-wide">YOGA.AI_PROXY</h3>
                  <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span> ONLINE
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 font-sans text-sm">
              {messages.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-xl px-4 py-2.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-tr-none'
                      : 'bg-white/5 border border-white/5 text-gray-300 rounded-tl-none font-mono text-xs'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 text-cyan-400 rounded-xl rounded-tl-none px-4 py-2.5 flex items-center gap-2 font-mono text-xs">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    Analyzing query...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && !loading && (
              <div className="p-3 flex flex-wrap gap-2 justify-center border-t border-white/5 bg-black/20">
                {suggestionPills.map((pill, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(pill)}
                    className="text-[11px] font-mono px-3 py-1 rounded-full border border-cyan-500/20 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-300 transition-colors cursor-pointer"
                  >
                    {pill}
                  </button>
                ))}
              </div>
            )}

            {/* Input Footer */}
            <div className="p-3 border-t border-white/10 bg-black/40 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about skills, projects, certificates..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 text-xs font-mono"
              />
              <button
                onClick={() => handleSend()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center"
              >
                <FiSend className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-2xl flex items-center justify-center cursor-pointer border border-cyan-400/30 relative"
      >
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping pointer-events-none" />
        {isOpen ? <FiX className="w-6 h-6" /> : <FiMessageSquare className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}
