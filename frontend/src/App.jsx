import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import Chatbot from './components/Chatbot';

// Pages
import Hero from './pages/Hero';
import About from './pages/About';
import Skills from './pages/Skills';
import ProjectsPage from './pages/ProjectsPage';
import Certifications from './pages/Certifications';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Main Layout Page
function PortfolioLayout({ activeSection, setActiveSection }) {
  const location = useLocation();

  useEffect(() => {
    // Handle scrolling when navigated back to home from admin pages
    if (location.state && location.state.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
          setActiveSection(location.state.scrollTo);
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="relative z-10">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      {/* Sections */}
      <Hero />
      <About />
      <Skills />
      <ProjectsPage />
      <Certifications />
      <Blog />
      <Contact />
      
      {/* Floating Chatbot Assistant */}
      <Chatbot />
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <Router>
      <div className="relative min-h-screen bg-[#0a0b10] text-[#f8fafc] overflow-hidden selection:bg-cyan-500/35 selection:text-white">
        {/* Futuristic Floating Particles */}
        <ParticleBackground />

        {/* Route Mappings */}
        <Routes>
          <Route 
            path="/" 
            element={
              <PortfolioLayout 
                activeSection={activeSection} 
                setActiveSection={setActiveSection} 
              />
            } 
          />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}