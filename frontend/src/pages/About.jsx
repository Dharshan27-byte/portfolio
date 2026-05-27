import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { FiBookOpen, FiActivity, FiSearch, FiCode } from 'react-icons/fi';

export default function About() {
  const bioMetrics = [
    { label: "Engineering Major", val: "AI & Data Science", icon: <FiBookOpen className="w-5 h-5 text-cyan-400" /> },
    { label: "Neural Modeling", val: "ML/DL & NLP", icon: <FiActivity className="w-5 h-5 text-purple-400" /> },
    { label: "Focus Field", val: "Generative AI Integration", icon: <FiSearch className="w-5 h-5 text-emerald-400" /> },
    { label: "Full Stack Skill", val: "MERN & Flask Pipelines", icon: <FiCode className="w-5 h-5 text-amber-400" /> }
  ];

  return (
    <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4"
        >
          // <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Identity core</span>
        </motion.h2>
        <p className="text-gray-400 font-mono text-xs sm:text-sm">BIOGRAPHICAL CORE DATA VECTOR</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Bio Glass Panel */}
        <div className="lg:col-span-7 space-y-6">
          <GlassCard className="border border-cyan-500/10">
            <h3 className="text-xl font-mono font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              BIOGRAPHY_VECTOR.md
            </h3>
            
            <div className="space-y-4 text-gray-300 font-sans text-sm sm:text-base leading-relaxed">
              <p>
                I am Yoga Dharshan P, currently pursuing a <strong className="text-cyan-400">B.Tech in Artificial Intelligence and Data Science</strong> at Sri Krishna College of Engineering and Technology. I operate at the boundary between analytical data models and full-stack software deployment.
              </p>
              <p>
                My experience includes working as a <strong className="text-purple-400">Full Stack Development Intern</strong> at Ramraj enterprises, where I built automated pipelines to process and archive communication data. I specialize in structuring clean database schemas, deploying MERN applications, and integrating machine learning workflows.
              </p>
              <p>
                I am actively seeking software engineering internships and collaborative roles where I can leverage my problem-solving capabilities, C++, Python, and full-stack capabilities to develop impactful real-world systems.
              </p>
            </div>
          </GlassCard>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bioMetrics.map((m, idx) => (
              <GlassCard key={idx} delay={idx * 0.1} className="flex items-center gap-4 py-4 px-5">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  {m.icon}
                </div>
                <div>
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{m.label}</p>
                  <p className="text-sm font-sans font-bold text-white mt-0.5">{m.val}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Right timeline Panel */}
        <div className="lg:col-span-5">
          <GlassCard className="border border-purple-500/10 h-full">
            <h3 className="text-xl font-mono font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              EXPERIENCE_AND_EDUCATION
            </h3>

            <div className="relative border-l border-white/10 ml-3 space-y-8 py-2">
              {/* Experience Item */}
              <div className="relative pl-8">
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-purple-500 border border-black shadow-[0_0_10px_#7f00ff]" />
                <span className="text-[10px] font-mono text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/20">
                  Jan 2026 - Feb 2026
                </span>
                <h4 className="text-base font-bold text-white mt-2">
                  Full Stack Development Intern
                </h4>
                <p className="text-xs text-gray-400 font-mono mt-0.5">Ramraj enterprises (Chennai)</p>
                <p className="text-xs text-gray-500 leading-relaxed mt-2">
                  Developed an individual automation system that monitors unread emails, parses content, and logs them into Google Sheets. Completed and deployed the workflow successfully.
                </p>
              </div>

              {/* Education Item */}
              <div className="relative pl-8">
                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-cyan-500 border border-black shadow-[0_0_10px_#00f2fe]" />
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                  2024 - 2028
                </span>
                <h4 className="text-base font-bold text-white mt-2">
                  B.Tech Artificial Intelligence & Data Science
                </h4>
                <p className="text-xs text-gray-400 font-mono mt-0.5">Sri Krishna College of Engineering and Technology</p>
                <p className="text-xs text-gray-500 leading-relaxed mt-2">
                  Engaged in coursework: Data Structures, OOP (C++/Java), DBMS, SQL, Machine Learning, and Web Application pipelines.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
