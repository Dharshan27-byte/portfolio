import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { FiLock, FiUser, FiArrowLeft, FiTerminal } from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL } from '../config.js';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        try {
          await axios.get(`${API_BASE_URL}/auth/verify`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          navigate('/admin-dashboard');
        } catch (err) {
          localStorage.removeItem('admin_token');
        }
      }
    };
    verifyToken();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password
      });
      localStorage.setItem('admin_token', response.data.token);
      navigate('/admin-dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Access Denied. Signature mismatch.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative bg-[#0a0b10]">
      {/* Background Orbs */}
      <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl" />
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full bg-purple-500/5 blur-3xl" />
      
      {/* Go Back button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer"
      >
        <FiArrowLeft /> Return to Home
      </button>

      <div className="w-full max-w-md">
        <GlassCard className="border border-cyan-500/10">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 mb-4">
              <FiTerminal className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-xl font-mono font-bold text-white tracking-wider">ADMIN_AUTHENTICATION</h2>
            <p className="text-gray-500 font-mono text-[10px] mt-1">RESTRICTED DEVELOPMENT CONSOLE</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-400 uppercase block">Admin Identifier</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"><FiUser /></span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-400 uppercase block">Verification Key</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"><FiLock /></span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. admin123"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs font-mono text-red-400 text-glow">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold uppercase text-xs tracking-wider transition-opacity cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                'Initialize Shell'
              )}
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
