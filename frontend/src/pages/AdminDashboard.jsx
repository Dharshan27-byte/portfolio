import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { 
  FiFolder, FiAward, FiBookOpen, FiMail, FiFileText, 
  FiLogOut, FiPlus, FiTrash2, FiArrowLeft, FiActivity 
} from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL, FILE_BASE_URL } from '../config.js';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  // Form States
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', tags: '', githubLink: '', liveLink: '', category: 'Full Stack Development'
  });
  const [projectImage, setProjectImage] = useState(null);

  const [certForm, setCertForm] = useState({
    name: '', issuer: '', date: '', credentialId: '', link: ''
  });
  const [certFile, setCertFile] = useState(null);

  const [blogForm, setBlogForm] = useState({
    title: '', content: '', tags: '', readTime: '5 min read'
  });

  const [resumeFile, setResumeFile] = useState(null);

  const getHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return { Authorization: `Bearer ${token}` };
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const headers = getHeaders();
      const [projRes, certRes, blogRes, msgRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/projects`),
        axios.get(`${API_BASE_URL}/certificates`),
        axios.get(`${API_BASE_URL}/blogs`),
        axios.get(`${API_BASE_URL}/contact`, { headers })
      ]);
      setProjects(projRes.data);
      setCerts(certRes.data);
      setBlogs(blogRes.data);
      setMessages(msgRes.data);
    } catch (err) {
      console.error(err);
      setError('Access unauthorized or session expired. Please re-authenticate.');
      localStorage.removeItem('admin_token');
      navigate('/admin-login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [navigate]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/');
  };

  // Create Project
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(projectForm).forEach(key => formData.append(key, projectForm[key]));
      if (projectImage) formData.append('image', projectImage);

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`)/projects`, formData, {
        headers: { ...getHeaders(), 'Content-Type': 'multipart/form-data' }
      });
      setProjects([res.data, ...projects]);
      setProjectForm({ title: '', description: '', tags: '', githubLink: '', liveLink: '', category: 'Full Stack Development' });
      setProjectImage(null);
      e.target.reset();
      showSuccess('Project node added successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Error deploying project node.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Project
  const handleProjectDelete = async (id) => {
    if (!window.confirm('Confirm deletion of this project node?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/projects/${id}`, { headers: getHeaders() });
      setProjects(projects.filter(p => p._id !== id));
      showSuccess('Project successfully deleted.');
    } catch (err) {
      setError('Error deleting project node.');
    }
  };

  // Create Certificate
  const handleCertSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(certForm).forEach(key => formData.append(key, certForm[key]));
      if (certFile) formData.append('file', certFile);

      const res = await axios.post(`${API_BASE_URL}/certificates`, formData, {
        headers: { ...getHeaders(), 'Content-Type': 'multipart/form-data' }
      });
      setCerts([res.data, ...certs]);
      setCertForm({ name: '', issuer: '', date: '', credentialId: '', link: '' });
      setCertFile(null);
      e.target.reset();
      showSuccess('Certificate logged successfully!');
    } catch (err) {
      setError('Error uploading certificate.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Certificate
  const handleCertDelete = async (id) => {
    if (!window.confirm('Delete this certificate record?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/certificates/${id}`, { headers: getHeaders() });
      setCerts(certs.filter(c => c._id !== id));
      showSuccess('Certificate record deleted.');
    } catch (err) {
      setError('Error deleting certificate.');
    }
  };

  // Create Blog
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/blogs`, blogForm, { headers: getHeaders() });
      setBlogs([res.data, ...blogs]);
      setBlogForm({ title: '', content: '', tags: '', readTime: '5 min read' });
      showSuccess('Blog published successfully.');
    } catch (err) {
      setError('Error writing blog.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Blog
  const handleBlogDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/blogs/${id}`, { headers: getHeaders() });
      setBlogs(blogs.filter(b => b._id !== id));
      showSuccess('Blog post removed.');
    } catch (err) {
      setError('Error deleting blog post.');
    }
  };

  // Delete Message
  const handleMessageDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/contact/${id}`, { headers: getHeaders() });
      setMessages(messages.filter(m => m._id !== id));
      showSuccess('Message deleted from console logs.');
    } catch (err) {
      setError('Error purging message.');
    }
  };

  // Upload/Update Resume File
  const handleResumeSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', resumeFile);

      // Multer will rename file inside backend/uploads/resume-default.pdf if we specify it or overwrite it
      // Let's call /certificates endpoint or a separate route. Since resume is saved in /uploads/resume-default.pdf,
      // we can reuse the certificate single-upload endpoint by naming field 'file' and matching backend upload criteria,
      // or we can implement it as a specific project/certificate link.
      // Wait, let's look at how backend seeds resume: it looks for 'resume-default.pdf' inside 'uploads/'.
      // So let's make an endpoint in backend to explicitly update the resume PDF!
      // Wait, we didn't add a specific resume upload route, but we can easily add one to backend or handle it.
      // Let's check: can we add a route in backend to upload resume? Yes, we can modify backend to add `routes/resume.js` or just put it inside `routes/certificates.js`.
      // Wait! Let's check how we can write a dedicated resume upload route inside backend.
      // Yes, we will modify `backend/index.js` and add a small route for resume upload.
      // But first, let's write the frontend form. It can call `/api/certificates/` with custom details or we can use a dedicated `/api/auth/resume` endpoint.
      // Let's implement the backend resume upload route in certificates or in an update. We will write that file or add it. Let's verify what the frontend should call:
      // It should POST to `/api/certificates` or POST to `/api/auth/resume`.
      // Let's add `/api/auth/resume` route to backend. For now, let's make the frontend call POST to `${API_BASE_URL}/auth/resume`.
      
      const res = await axios.post(`${API_BASE_URL}/auth/resume`, formData, {
        headers: { ...getHeaders(), 'Content-Type': 'multipart/form-data' }
      });
      showSuccess('Resume file updated on server node!');
      setResumeFile(null);
      e.target.reset();
    } catch (err) {
      setError('Failed to transmit resume upload payload.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b10] text-gray-300 font-sans pb-16">
      {/* Top Navbar */}
      <nav className="border-b border-white/5 py-4 bg-black/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div 
            onClick={() => navigate('/')} 
            className="cursor-pointer font-bold text-lg text-white font-mono flex items-center gap-1 hover:text-cyan-400 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" /> &lt;CONSOLE_ROOT_SHELL /&gt;
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/20 border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold uppercase transition-colors cursor-pointer"
          >
            <FiLogOut /> Decouple
          </button>
        </div>
      </nav>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Menu */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <GlassCard className="border border-white/5 p-4 flex flex-col gap-2">
            <h3 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest px-3 mb-3">
              Control Vertices
            </h3>

            {[
              { id: 'projects', label: 'Projects', icon: <FiFolder /> },
              { id: 'certs', label: 'Certificates', icon: <FiAward /> },
              { id: 'blogs', label: 'Blogs', icon: <FiBookOpen /> },
              { id: 'messages', label: 'Messages', icon: <FiMail /> },
              { id: 'resume', label: 'Resume', icon: <FiFileText /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setError(''); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-mono transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400'
                    : 'border border-transparent hover:bg-white/5 hover:text-white'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </GlassCard>
          
          {/* Status Tracker */}
          <GlassCard className="border border-white/5 p-4">
            <h4 className="text-[10px] font-mono font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
              <FiActivity className="text-cyan-400" /> SYSTEM_HEARTBEAT
            </h4>
            <div className="space-y-1 text-[11px] font-mono">
              <p>Projects: {projects.length}</p>
              <p>Certificates: {certs.length}</p>
              <p>Blogs: {blogs.length}</p>
              <p>Inbox: {messages.length}</p>
            </div>
          </GlassCard>
        </div>

        {/* Action Panel Column */}
        <div className="lg:col-span-9 space-y-6">
          {error && (
            <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono">
              [SYSTEM_ERROR]: {error}
            </div>
          )}
          
          {successMsg && (
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-mono">
              [SUCCESS_LOG]: {successMsg}
            </div>
          )}

          {/* SESSIONS BY TAB */}
          
          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-8">
              {/* Form Card */}
              <GlassCard className="border border-cyan-500/10">
                <h3 className="text-base font-mono font-bold text-white mb-6 flex items-center gap-2">
                  <FiPlus className="text-cyan-400" /> DEPLOY_NEW_PROJECT_NODE
                </h3>
                
                <form onSubmit={handleProjectSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                      placeholder="Project Title"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                    />
                    <select
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                      className="bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                    >
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Full Stack Development">Full Stack Development</option>
                      <option value="Game Development">Game Development</option>
                    </select>
                  </div>

                  <textarea
                    required
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                    placeholder="Description / Technical Details"
                    rows="3"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={projectForm.tags}
                      onChange={(e) => setProjectForm({...projectForm, tags: e.target.value})}
                      placeholder="Tags (comma separated: React, Python)"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                    />
                    <input
                      type="text"
                      value={projectForm.githubLink}
                      onChange={(e) => setProjectForm({...projectForm, githubLink: e.target.value})}
                      placeholder="GitHub URL"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                    />
                    <input
                      type="text"
                      value={projectForm.liveLink}
                      onChange={(e) => setProjectForm({...projectForm, liveLink: e.target.value})}
                      placeholder="Live Demo URL"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-500 block">Project Mock Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProjectImage(e.target.files[0])}
                      className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 cursor-pointer"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
                  >
                    Deploy Node
                  </button>
                </form>
              </GlassCard>

              {/* List Card */}
              <GlassCard className="border border-white/5">
                <h3 className="text-base font-mono font-bold text-white mb-6">DEPLOYED_NODES_LIST</h3>
                <div className="divide-y divide-white/5">
                  {projects.map(p => (
                    <div key={p._id} className="py-4 flex justify-between items-center gap-4">
                      <div>
                        <h4 className="font-bold text-white text-sm">{p.title}</h4>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{p.category} // {p.tags?.join(', ')}</p>
                      </div>
                      <button
                        onClick={() => handleProjectDelete(p._id)}
                        className="p-2 rounded-lg bg-red-950/20 border border-red-500/20 text-red-400 hover:bg-red-500/10 cursor-pointer"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {/* Certificates Tab */}
          {activeTab === 'certs' && (
            <div className="space-y-8">
              <GlassCard className="border border-cyan-500/10">
                <h3 className="text-base font-mono font-bold text-white mb-6 flex items-center gap-2">
                  <FiPlus className="text-cyan-400" /> REGISTER_CERTIFICATE_CREDENTIAL
                </h3>
                
                <form onSubmit={handleCertSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      value={certForm.name}
                      onChange={(e) => setCertForm({...certForm, name: e.target.value})}
                      placeholder="Certificate Name"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                    />
                    <input
                      type="text"
                      required
                      value={certForm.issuer}
                      onChange={(e) => setCertForm({...certForm, issuer: e.target.value})}
                      placeholder="Issuing Authority"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="date"
                      required
                      value={certForm.date}
                      onChange={(e) => setCertForm({...certForm, date: e.target.value})}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                    />
                    <input
                      type="text"
                      value={certForm.credentialId}
                      onChange={(e) => setCertForm({...certForm, credentialId: e.target.value})}
                      placeholder="Credential ID"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                    />
                    <input
                      type="text"
                      value={certForm.link}
                      onChange={(e) => setCertForm({...certForm, link: e.target.value})}
                      placeholder="Verification Link"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-500 block">Certificate Copy PDF/Image</label>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) => setCertFile(e.target.files[0])}
                      className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 cursor-pointer"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
                  >
                    Register Certificate
                  </button>
                </form>
              </GlassCard>

              <GlassCard className="border border-white/5">
                <h3 className="text-base font-mono font-bold text-white mb-6">CERTIFICATE_RECORDS</h3>
                <div className="divide-y divide-white/5">
                  {certs.map(c => (
                    <div key={c._id} className="py-4 flex justify-between items-center gap-4">
                      <div>
                        <h4 className="font-bold text-white text-sm">{c.name}</h4>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{c.issuer} // Issued: {c.date}</p>
                      </div>
                      <button
                        onClick={() => handleCertDelete(c._id)}
                        className="p-2 rounded-lg bg-red-950/20 border border-red-500/20 text-red-400 hover:bg-red-500/10 cursor-pointer"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {/* Blogs Tab */}
          {activeTab === 'blogs' && (
            <div className="space-y-8">
              <GlassCard className="border border-cyan-500/10">
                <h3 className="text-base font-mono font-bold text-white mb-6 flex items-center gap-2">
                  <FiPlus className="text-cyan-400" /> PUBLISH_NEW_RESEARCH_LOG
                </h3>
                
                <form onSubmit={handleBlogSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                      placeholder="Article Title"
                      className="sm:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                    />
                    <input
                      type="text"
                      required
                      value={blogForm.readTime}
                      onChange={(e) => setBlogForm({...blogForm, readTime: e.target.value})}
                      placeholder="e.g. 5 min read"
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <textarea
                    required
                    rows="8"
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                    placeholder="Article Content Body"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50 resize-y"
                  />

                  <input
                    type="text"
                    value={blogForm.tags}
                    onChange={(e) => setBlogForm({...blogForm, tags: e.target.value})}
                    placeholder="Tags (comma separated: RAG, ML, Python)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50"
                  />

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
                  >
                    Publish Post
                  </button>
                </form>
              </GlassCard>

              <GlassCard className="border border-white/5">
                <h3 className="text-base font-mono font-bold text-white mb-6">PUBLISHED_POSTS</h3>
                <div className="divide-y divide-white/5">
                  {blogs.map(b => (
                    <div key={b._id} className="py-4 flex justify-between items-center gap-4">
                      <div>
                        <h4 className="font-bold text-white text-sm">{b.title}</h4>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">Date: {b.date} // Time: {b.readTime}</p>
                      </div>
                      <button
                        onClick={() => handleBlogDelete(b._id)}
                        className="p-2 rounded-lg bg-red-950/20 border border-red-500/20 text-red-400 hover:bg-red-500/10 cursor-pointer"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <GlassCard className="border border-white/5">
              <h3 className="text-base font-mono font-bold text-white mb-6">INCOMING_NEURAL_TRANSMISSIONS</h3>
              
              {messages.length === 0 ? (
                <p className="text-gray-500 font-mono text-center py-8">Inbox is empty. No incoming transmissions detected.</p>
              ) : (
                <div className="space-y-6">
                  {messages.map(msg => (
                    <div key={msg._id} className="p-4 rounded-xl bg-white/3 border border-white/5 flex flex-col gap-2 relative">
                      <button
                        onClick={() => handleMessageDelete(msg._id)}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-red-950/20 border border-red-500/20 text-red-400 hover:bg-red-500/10 cursor-pointer"
                        title="Purge Message"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-gray-400">
                        <span className="text-white font-bold">{msg.name}</span>
                        <span>({msg.email})</span>
                        <span>{new Date(msg.date).toLocaleString()}</span>
                      </div>
                      
                      <div className="text-xs font-mono text-cyan-400">Subject: {msg.subject}</div>
                      
                      <p className="text-sm text-gray-300 font-sans mt-2 whitespace-pre-wrap leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          )}

          {/* Resume Tab */}
          {activeTab === 'resume' && (
            <GlassCard className="border border-cyan-500/10">
              <h3 className="text-base font-mono font-bold text-white mb-6 flex items-center gap-2">
                <FiFileText className="text-cyan-400" /> UPDATE_DEVELOPER_RESUME
              </h3>

              <div className="p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-xl text-xs font-mono text-cyan-300 leading-relaxed mb-6">
                Uploading a file here replaces the default developer resume PDF. Visitors accessing your portfolio from the Comms Bridge section will download this updated PDF.
              </div>

              <form onSubmit={handleResumeSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-gray-500 block">Select PDF Document</label>
                  <input
                    type="file"
                    required
                    accept=".pdf"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="text-xs text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !resumeFile}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
                >
                  Upload & Overwrite
                </button>
              </form>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
