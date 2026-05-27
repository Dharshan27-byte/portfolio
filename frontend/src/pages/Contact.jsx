import { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { FiSend, FiMail, FiMapPin, FiDownload, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL, FILE_BASE_URL } from '../config.js';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await axios.post(`${API_BASE_URL}/contact`, formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Transmission failed. Neural pathway unstable.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadResume = () => {
    // Standard direct link to static or uploaded resume PDF
    window.open(`${FILE_BASE_URL}/uploads/resume-default.pdf`, '_blank');
  };

  return (
    <section id="contact" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4"
        >
          // <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Comms bridge</span>
        </motion.h2>
        <p className="text-gray-400 font-mono text-xs sm:text-sm">ESTABLISH NEURAL TRANSMISSION LINK</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Contact Info Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <GlassCard className="border border-cyan-500/10 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-mono font-bold text-white mb-6">
                LINK_COORDINATES
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-cyan-400">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Digital Address</p>
                    <a href="mailto:ydharshan06@gmail.com" className="text-sm font-sans font-semibold text-white hover:text-cyan-400 transition-colors mt-0.5 block">
                      ydharshan06@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-purple-400">
                    <FiMapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Geographic Hub</p>
                    <p className="text-sm font-sans font-semibold text-white mt-0.5">
                      India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 mt-8">
              <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-4">
                Resume Transmitter
              </h4>
              <button
                onClick={handleDownloadResume}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 text-white font-semibold transition-all cursor-pointer"
              >
                <FiDownload className="w-4.5 h-4.5" /> Download Resume PDF
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7">
          <GlassCard className="border border-purple-500/10 h-full">
            <h3 className="text-xl font-mono font-bold text-white mb-6">
              SECURE_TRANSMISSION_FORM
            </h3>

            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-[80%] flex flex-col items-center justify-center text-center p-6"
              >
                <FiCheckCircle className="w-16 h-16 text-[#00ff87] mb-4 animate-bounce" />
                <h4 className="text-xl font-bold text-white mb-2">Transmission Transmitted!</h4>
                <p className="text-sm text-gray-400 max-w-sm">
                  Your communication package was successfully uploaded to Yoga's dashboard. A response protocol will trigger shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-6 px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs border border-white/10 transition-colors"
                >
                  Send another transmission
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Signature Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Elon Musk"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Return Address (Email)</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. elon@spacex.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Subject Descriptor</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. System upgrade proposal"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Encryption Payload (Message)</label>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Encrypt details here..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 resize-none"
                  />
                </div>

                {error && (
                  <p className="text-xs font-mono text-red-400 text-glow">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold shadow-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Encrypting Payload...
                    </span>
                  ) : (
                    <>
                      <FiSend /> Broadcast Transmission
                    </>
                  )}
                </button>
              </form>
            )}
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
