import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

export let isConnected = false;
export let useMockDB = false;

// Path to store mock JSON database files in case MongoDB is unavailable
const MOCK_DB_DIR = path.resolve('./mock_db');

export const initMockDB = () => {
  if (!fs.existsSync(MOCK_DB_DIR)) {
    fs.mkdirSync(MOCK_DB_DIR, { recursive: true });
  }
  
  const files = ['projects.json', 'blogs.json', 'certificates.json', 'contacts.json', 'resume.json'];
  files.forEach(file => {
    const filePath = path.join(MOCK_DB_DIR, file);
    if (!fs.existsSync(filePath)) {
      let defaultData = [];
      if (file === 'projects.json') {
        defaultData = [
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
      } else if (file === 'certificates.json') {
        defaultData = [
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
      } else if (file === 'blogs.json') {
        defaultData = [
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
      } else if (file === 'resume.json') {
        defaultData = {
          fileName: "Yoga_Dharshan_Resume.pdf",
          filePath: "/uploads/resume-default.pdf",
          uploadedAt: new Date().toISOString()
        };
      }
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
  });
};

export const getMockDBData = (collection) => {
  const filePath = path.join(MOCK_DB_DIR, `${collection}.json`);
  if (!fs.existsSync(filePath)) {
    initMockDB();
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

export const saveMockDBData = (collection, data) => {
  const filePath = path.join(MOCK_DB_DIR, `${collection}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const connectDB = async () => {
  if (!MONGODB_URI) {
    console.warn("⚠️ No MONGODB_URI environment variable defined. Falling back to Local File-Based Mock Database.");
    useMockDB = true;
    initMockDB();
    return;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });
    console.log(`🔌 MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.warn("⚠️ Falling back to Local File-Based Mock Database.");
    useMockDB = true;
    initMockDB();
  }
};
