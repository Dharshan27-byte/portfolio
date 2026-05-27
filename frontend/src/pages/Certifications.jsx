import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { FiAward, FiExternalLink, FiCalendar } from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL } from '../config.js';

export default function Certifications() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const backupCerts = [
    {
      _id: "c1",
      name: "Neural Networks and Deep Learning",
      issuer: "DeepLearning.AI (Coursera)",
      date: "2025-10-12",
      link: "https://coursera.org/verify/deeplearning-nn",
      credentialId: "DL-NN-982390"
    },
    {
      _id: "c2",
      name: "Supervised Machine Learning",
      issuer: "Stanford University & DeepLearning.AI",
      date: "2025-05-18",
      link: "https://coursera.org/verify/stanford-ml",
      credentialId: "STANFORD-ML-44810"
    },
    {
      _id: "c3",
      name: "MongoDB Developer Associate",
      issuer: "MongoDB Academy",
      date: "2026-01-20",
      link: "https://university.mongodb.com/course_completion",
      credentialId: "MDB-DEV-38290"
    }
  ];

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/certificates`);
        if (res.data && res.data.length > 0) {
          setCerts(res.data);
        } else {
          setCerts(backupCerts);
        }
      } catch (err) {
        console.warn("Certificates endpoint failed. Using offline backup.", err);
        setCerts(backupCerts);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  return (
    <section id="certifications" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4"
        >
          // <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Credentials</span>
        </motion.h2>
        <p className="text-gray-400 font-mono text-xs sm:text-sm">VERIFIED KNOWLEDGE NODES</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glassmorphism rounded-2xl h-44 animate-pulse p-6 border border-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert, idx) => (
            <GlassCard 
              key={cert._id} 
              delay={idx * 0.1}
              className="border border-cyan-500/10 flex flex-col justify-between hover:border-cyan-500/40"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-cyan-400">
                    <FiAward className="w-6 h-6" />
                  </div>
                  {cert.link && cert.link !== '#' && (
                    <a 
                      href={cert.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-cyan-400 transition-colors p-1"
                      aria-label="View Certificate"
                    >
                      <FiExternalLink className="w-4.5 h-4.5" />
                    </a>
                  )}
                </div>
                
                <h3 className="font-sans font-bold text-base text-white mb-1.5 leading-snug group-hover:text-cyan-300">
                  {cert.name}
                </h3>
                <p className="text-xs text-gray-400 font-mono mb-4">{cert.issuer}</p>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4 text-[10px] font-mono text-gray-500">
                <span className="flex items-center gap-1">
                  <FiCalendar /> {cert.date}
                </span>
                {cert.credentialId && (
                  <span>ID: {cert.credentialId}</span>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </section>
  );
}
