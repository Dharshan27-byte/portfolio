import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowDown, FiMail, FiLinkedin, FiGithub } from 'react-icons/fi';

export default function Hero() {
  const [typedText, setTypedText] = useState('');
  const fullPhrases = [
    "AI & Data Science Student",
    "Full Stack Developer",
    "GenAI Enthusiast"
  ];
  
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = fullPhrases[phraseIdx];
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setTypedText(currentPhrase.substring(0, charIdx - 1));
        setCharIdx(prev => prev - 1);
      }, 40);
    } else {
      timer = setTimeout(() => {
        setTypedText(currentPhrase.substring(0, charIdx + 1));
        setCharIdx(prev => prev + 1);
      }, 80);
    }

    if (!isDeleting && charIdx === currentPhrase.length) {
      // Pause at full text
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setPhraseIdx((prev) => (prev + 1) % fullPhrases.length);
    }

    return () => clearTimeout(timer);
  }, [charIdx, isDeleting, phraseIdx]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home" 
      className="min-h-screen flex flex-col justify-center items-center relative px-6 pt-20"
    >
      {/* Abstract background grids */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse-glow z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse-glow [animation-delay:1.5s] z-0" />

      {/* Cyber Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40" />

      <div className="max-w-4xl text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#00ff87] animate-ping" />
          <span className="text-[10px] sm:text-xs font-mono font-semibold tracking-widest text-[#00f2fe] uppercase">
            System Online // Personal Core v1.0
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-7xl font-bold tracking-tight text-white mb-6"
        >
          Hi, I am <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-glow">Yoga Dharshan</span>
        </motion.h1>

        {/* Typing effect output */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="h-12 flex items-center justify-center mb-8"
        >
          <span className="text-xl sm:text-3xl font-mono text-gray-300 typing-cursor">
            {typedText}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-sans"
        >
          Engineering solutions at the intersection of Data Science and Web Intelligence. Designing premium, interactive interfaces backed by predictive neural models.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap gap-4 justify-center items-center mb-16"
        >
          <button
            onClick={() => scrollToSection('projects')}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 transition-opacity font-semibold tracking-wide shadow-lg border border-cyan-400/20 cursor-pointer"
          >
            Explore Deployments
          </button>
          
          <button
            onClick={() => scrollToSection('contact')}
            className="px-8 py-3 rounded-xl border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/10 font-semibold tracking-wide transition-all cursor-pointer glassmorphism"
          >
            Transmit Message
          </button>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex justify-center gap-6"
        >
          <a
            href="https://github.com/Dharshan27-byte"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full border border-white/5 bg-white/5 hover:text-cyan-400 hover:border-cyan-500/30 hover:scale-110 transition-all cursor-pointer"
            aria-label="GitHub Profile"
          >
            <FiGithub className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/yoga-dharshan-8676b232b"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full border border-white/5 bg-white/5 hover:text-cyan-400 hover:border-cyan-500/30 hover:scale-110 transition-all cursor-pointer"
            aria-label="LinkedIn Profile"
          >
            <FiLinkedin className="w-5 h-5" />
          </a>
          <a
            href="mailto:ydharshan06@gmail.com"
            className="p-3 rounded-full border border-white/5 bg-white/5 hover:text-cyan-400 hover:border-cyan-500/30 hover:scale-110 transition-all cursor-pointer"
            aria-label="Send Email"
          >
            <FiMail className="w-5 h-5" />
          </a>
        </motion.div>
      </div>

      {/* Down Scroll Indicator */}
      <motion.button
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        onClick={() => scrollToSection('about')}
        className="absolute bottom-10 p-2 text-gray-500 hover:text-cyan-400 transition-colors cursor-pointer"
        aria-label="Scroll Down"
      >
        <FiArrowDown className="w-6 h-6" />
      </motion.button>
    </section>
  );
}
