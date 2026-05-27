import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { FiCalendar, FiClock, FiUser, FiX, FiArrowRight } from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL } from '../config.js';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBlog, setActiveBlog] = useState(null);

  const backupBlogs = [
    {
      _id: "b1",
      title: "The Rise of Agentic AI: Beyond Simple Prompting",
      content: "Agentic AI represents a massive shift in artificial intelligence. Instead of just replying to static inputs, AI agents are now capable of planning, utilizing tools, correcting their own errors, and executing multi-step workflows autonomously. In this post, we discuss the core architecture of an AI agent, including planning loops, memory systems, and tool interfaces, and how they are transforming development workflows.",
      tags: ["Artificial Intelligence", "Generative AI", "Agentic Workflows"],
      date: "2026-05-15",
      readTime: "5 min read",
      author: "Yoga Dharshan"
    },
    {
      _id: "b2",
      title: "Demystifying RAG: Retrieval-Augmented Generation Explained",
      content: "Retrieval-Augmented Generation (RAG) is the gold standard for reducing hallucinations in large language models. By connecting LLMs to external data sources, we enable them to fetch up-to-date and domain-specific knowledge before generating responses. We will explore how vector databases like Pinecone and ChromaDB work, and build a simple RAG pipeline from scratch using Python.",
      tags: ["Machine Learning", "RAG", "Vector Search"],
      date: "2026-04-28",
      readTime: "7 min read",
      author: "Yoga Dharshan"
    }
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/blogs`);
        if (res.data && res.data.length > 0) {
          setBlogs(res.data);
        } else {
          setBlogs(backupBlogs);
        }
      } catch (err) {
        console.warn("Blogs endpoint offline. Using local backup.", err);
        setBlogs(backupBlogs);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <section id="blog" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4"
        >
          // <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Chronicles</span>
        </motion.h2>
        <p className="text-gray-400 font-mono text-xs sm:text-sm">RESEARCH LOGS AND KNOWLEDGE RECORDS</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((n) => (
            <div key={n} className="glassmorphism rounded-2xl h-60 animate-pulse p-6 border border-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((blog, idx) => (
            <GlassCard 
              key={blog._id} 
              delay={idx * 0.15}
              className="border border-purple-500/10 flex flex-col justify-between hover:border-purple-500/30 group"
            >
              <div>
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-500 mb-4">
                  <span className="flex items-center gap-1.5"><FiCalendar className="text-purple-400" /> {blog.date}</span>
                  <span className="flex items-center gap-1.5"><FiClock className="text-cyan-400" /> {blog.readTime}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                  {blog.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {blog.content}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                <div className="flex gap-2">
                  {blog.tags && blog.tags.slice(0, 2).map((tag, tIdx) => (
                    <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/10">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <button
                  onClick={() => setActiveBlog(blog)}
                  className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  Decrypt Log <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Blog Article Reader Modal */}
      <AnimatePresence>
        {activeBlog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveBlog(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-full max-w-3xl max-h-[85vh] glassmorphism rounded-2xl border border-white/10 z-10 overflow-y-auto flex flex-col relative"
            >
              {/* Close Button */}
              <button 
                onClick={() => setActiveBlog(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer hover:scale-105"
              >
                <FiX className="w-5 h-5" />
              </button>

              <div className="p-8 sm:p-10">
                <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-gray-400 mb-6 border-b border-white/5 pb-4">
                  <span className="flex items-center gap-1.5"><FiCalendar className="text-purple-400" /> {activeBlog.date}</span>
                  <span className="flex items-center gap-1.5"><FiClock className="text-cyan-400" /> {activeBlog.readTime}</span>
                  <span className="flex items-center gap-1.5"><FiUser className="text-emerald-400" /> {activeBlog.author}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 leading-tight">
                  {activeBlog.title}
                </h2>

                <div className="text-gray-300 space-y-4 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans">
                  {activeBlog.content}
                </div>

                <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-white/5">
                  {activeBlog.tags && activeBlog.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-xs font-mono px-3 py-1 rounded bg-white/5 text-gray-300 border border-white/5">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
