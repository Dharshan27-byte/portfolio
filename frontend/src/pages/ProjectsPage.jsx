import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import axios from 'axios';
import { API_BASE_URL } from '../config.js';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Resilient hardcoded local backup projects
  const backupProjects = [
    {
      _id: "p1",
      title: "Care360 AI Health Assistant",
      description: "An AI-powered healthcare assistant designed to analyze patient symptoms, provide medical predictions, and manage patient care workflows efficiently.",
      tags: ["React", "Express", "MongoDB", "Gemini API", "Python"],
      githubLink: "https://github.com/yogadharshan/care360",
      liveLink: "https://care360-ai.vercel.app",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80",
      category: "Artificial Intelligence"
    },
    {
      _id: "p2",
      title: "AI Chatbot Assistant",
      description: "A dynamic chatbot application that uses natural language processing to answer user queries, guide navigation, and offer interactive assistance.",
      tags: ["React", "Tailwind CSS", "Node.js", "Express", "NLP"],
      githubLink: "https://github.com/yogadharshan/ai-chatbot",
      liveLink: "https://ai-chatbot-demo.vercel.app",
      image: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&w=600&q=80",
      category: "Artificial Intelligence"
    },
    {
      _id: "p3",
      title: "Student Grade Prediction System",
      description: "Machine learning model and web interface that predicts student academic performance based on historical and demographic attributes.",
      tags: ["Python", "Flask", "Scikit-Learn", "HTML/CSS", "Pandas"],
      githubLink: "https://github.com/yogadharshan/grade-predictor",
      liveLink: "#",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
      category: "Machine Learning"
    },
    {
      _id: "p4",
      title: "Task Management Website",
      description: "Collaborative project management dashboard supporting kanban boards, task assignments, deadline tracking, and visual analytics.",
      tags: ["React", "Framer Motion", "Express", "MongoDB", "Tailwind"],
      githubLink: "https://github.com/yogadharshan/task-manager",
      liveLink: "https://taskflow-pro.vercel.app",
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=600&q=80",
      category: "Full Stack Development"
    },
    {
      _id: "p5",
      title: "Chess Game",
      description: "A fully responsive web-based chess game featuring local multiplayer gameplay, move highlights, and clean modern aesthetics.",
      tags: ["React", "CSS", "Algorithms", "Game Logic"],
      githubLink: "https://github.com/yogadharshan/chess-game",
      liveLink: "https://chess-yoga.vercel.app",
      image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=600&q=80",
      category: "Game Development"
    }
  ];

  const categories = ['All', 'Artificial Intelligence', 'Machine Learning', 'Full Stack Development', 'Game Development'];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/projects`);
        if (res.data && res.data.length > 0) {
          setProjects(res.data);
        } else {
          setProjects(backupProjects);
        }
      } catch (err) {
        console.warn("Backend project service offline. Loading sandbox database data.", err);
        setProjects(backupProjects);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <section id="projects" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4"
        >
          // <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Deployments</span>
        </motion.h2>
        <p className="text-gray-400 font-mono text-xs sm:text-sm">ACTIVE SOFTWARE CORE INSTANCES</p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full border text-xs font-mono transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                : 'border-white/5 bg-white/5 text-gray-400 hover:text-white hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glassmorphism rounded-2xl h-96 animate-pulse p-6 border border-white/5">
              <div className="bg-white/5 rounded-xl h-48 w-full mb-6" />
              <div className="bg-white/5 h-6 rounded w-3/4 mb-4" />
              <div className="bg-white/5 h-4 rounded w-full mb-2" />
              <div className="bg-white/5 h-4 rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project, idx) => (
            <div key={project._id}>
              <ProjectCard project={project} delay={idx * 0.1} />
            </div>
          ))}
        </motion.div>
      )}

      {!loading && filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 font-mono">No nodes matching current filters found in workspace database.</p>
        </div>
      )}
    </section>
  );
}
