import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink, FiFolder } from 'react-icons/fi';
import { FILE_BASE_URL } from '../config.js';

export default function ProjectCard({ project, delay = 0 }) {
  const { title, description, tags, githubLink, liveLink, image, category } = project;

  // Handle local uploaded file paths vs public url links
  const imageUrl = image && image.startsWith('/uploads') 
    ? `${FILE_BASE_URL}${image}` 
    : (image || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: delay }}
      whileHover={{ y: -8 }}
      className="glassmorphism rounded-2xl overflow-hidden group flex flex-col h-full border border-white/5 hover:border-cyan-500/30 transition-all duration-300 shadow-xl"
    >
      {/* Project Image Panel */}
      <div className="h-48 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-transparent to-transparent z-10 opacity-60" />
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <span className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-[10px] font-mono font-semibold bg-black/60 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider backdrop-blur-sm">
          {category}
        </span>
      </div>

      {/* Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FiFolder className="text-purple-400 w-4 h-4" />
            <h3 className="font-sans font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">
              {title}
            </h3>
          </div>
          
          <p className="text-gray-400 text-sm leading-relaxed mb-6 font-sans">
            {description}
          </p>
        </div>

        <div>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tags && tags.map((tag, i) => (
              <span 
                key={i} 
                className="px-2 py-0.5 text-[10px] font-mono text-gray-300 bg-white/5 rounded border border-white/5"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action Links */}
          <div className="flex gap-4 border-t border-white/5 pt-4">
            {githubLink && githubLink !== '#' && (
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <FiGithub className="w-4 h-4" /> GitHub
              </a>
            )}
            
            {liveLink && liveLink !== '#' && (
              <a
                href={liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-cyan-400 transition-colors ml-auto"
              >
                <FiExternalLink className="w-4 h-4" /> Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
