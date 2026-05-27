import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { 
  SiPython, SiJavascript, SiHtml5, SiReact, 
  SiTailwindcss, SiNodedotjs, SiExpress, SiMongodb, 
  SiPytorch, SiScikitlearn, SiPandas, SiLangchain, SiGoogle 
} from 'react-icons/si';
import { FiDatabase } from 'react-icons/fi';

export default function Skills() {
  const skillCategories = [
    {
      title: "Data Science & AI",
      color: "border-emerald-500/20 text-emerald-400",
      skills: [
        { name: "Python", icon: <SiPython className="w-5 h-5 text-emerald-400" /> },
        { name: "Machine Learning", icon: <SiScikitlearn className="w-5 h-5 text-emerald-300" /> },
        { name: "Deep Learning / PyTorch", icon: <SiPytorch className="w-5 h-5 text-red-400" /> },
        { name: "Pandas & Numpy", icon: <SiPandas className="w-5 h-5 text-sky-400" /> },
        { name: "Generative AI / LLMs", icon: <SiGoogle className="w-5 h-5 text-cyan-400" /> },
        { name: "LangChain / Prompting", icon: <SiLangchain className="w-5 h-5 text-yellow-400" /> }
      ]
    },
    {
      title: "Backend & Databases",
      color: "border-purple-500/20 text-purple-400",
      skills: [
        { name: "Node.js", icon: <SiNodedotjs className="w-5 h-5 text-green-400" /> },
        { name: "Express.js", icon: <SiExpress className="w-5 h-5 text-white" /> },
        { name: "MongoDB", icon: <SiMongodb className="w-5 h-5 text-green-500" /> },
        { name: "SQL / Relational DBs", icon: <FiDatabase className="w-5 h-5 text-blue-400" /> }
      ]
    },
    {
      title: "Frontend Engineering",
      color: "border-cyan-500/20 text-cyan-400",
      skills: [
        { name: "React.js / Vite", icon: <SiReact className="w-5 h-5 text-cyan-400" /> },
        { name: "Tailwind CSS", icon: <SiTailwindcss className="w-5 h-5 text-sky-400" /> },
        { name: "JavaScript (ES6+)", icon: <SiJavascript className="w-5 h-5 text-yellow-400" /> },
        { name: "HTML5 & CSS3", icon: <SiHtml5 className="w-5 h-5 text-orange-500" /> }
      ]
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  return (
    <section id="skills" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4"
        >
          // <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Neural matrix</span>
        </motion.h2>
        <p className="text-gray-400 font-mono text-xs sm:text-sm">DEVELOPER CAPABILITIES AND TOOLKITS</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {skillCategories.map((cat, idx) => (
          <GlassCard 
            key={idx} 
            className={`border ${cat.color} flex flex-col h-full`}
            hoverEffect={true}
          >
            <h3 className="text-lg font-mono font-bold text-white mb-6 border-b border-white/5 pb-3">
              {cat.title}
            </h3>

            <div className="flex-1 grid grid-cols-1 gap-4">
              {cat.skills.map((skill, sIdx) => (
                <motion.div
                  key={sIdx}
                  variants={itemVariants}
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-white/3 border border-white/5 hover:border-cyan-500/20 hover:bg-white/5 transition-all duration-300 group"
                >
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5 group-hover:scale-110 transition-transform">
                    {skill.icon}
                  </div>
                  <span className="text-sm font-sans font-medium text-gray-300 group-hover:text-white transition-colors">
                    {skill.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        ))}
      </motion.div>
    </section>
  );
}
