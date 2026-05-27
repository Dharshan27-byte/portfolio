import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hoverEffect = true, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: delay }}
      className={`glassmorphism rounded-2xl p-6 relative overflow-hidden ${
        hoverEffect ? 'glassmorphism-hover' : ''
      } ${className}`}
    >
      {/* Decorative Glow Spot */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-cyan-500/10 rounded-full blur-xl pointer-events-none" />
      
      {children}
    </motion.div>
  );
}
