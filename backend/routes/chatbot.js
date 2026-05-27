import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// System knowledge context about Yoga Dharshan
const YOGA_CONTEXT = `
You are the AI assistant representing Yoga Dharshan, a brilliant student studying Artificial Intelligence and Data Science.
Here is the core information about Yoga Dharshan:
- Role: AI & Data Science Student | Full Stack Developer | GenAI Enthusiast.
- Bio: Passionate about building intelligent systems, full-stack web applications, and leveraging generative AI technologies to solve real-world problems.
- Tech Stack:
  - Frontend: React.js, Vite, Tailwind CSS, Framer Motion, HTML5, CSS3, JavaScript.
  - Backend: Node.js, Express.js, Flask.
  - Database: MongoDB, SQL.
  - AI & Data Science: Python, Machine Learning, Deep Learning, Natural Language Processing, Generative AI (Gemini API, OpenAI API).
- Core Projects:
  1. Care360 AI Health Assistant: AI-powered healthcare platform to analyze symptoms, predict diseases, and manage care schedules.
  2. AI Chatbot: NLP-powered chat widget to assist website navigation and answer queries.
  3. Student Grade Prediction System: ML models predicting grades based on student variables.
  4. Task Management Website: A collaborative project tracker dashboard.
  5. Chess Game: Interactive board game with advanced game state algorithms.
- Contact: yodharshan@gmail.com.
- Certifications: DeepLearning.AI Neural Networks, Stanford Machine Learning, MongoDB Developer Associate.
- Objective: Seeking opportunities in AI development, Full Stack engineering, and Data Science.

Your tone should be cybernetic, futuristic, helpful, and professional. Always keep answers concise and highlight his capabilities. Refer to Yoga Dharshan in the third person or as "my creator/master" or "the developer".
`;

// Helper: Rule-based fallback matcher for local deployment without API keys
const getRuleBasedResponse = (query) => {
  const q = query.toLowerCase();
  
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('greetings')) {
    return "Greetings, User! I am Yoga's AI Assistant. How can I assist you in navigating his digital portal today?";
  }
  if (q.includes('who are you') || q.includes('who is yoga') || q.includes('about')) {
    return "Yoga Dharshan is an Artificial Intelligence and Data Science engineering student, Full Stack Developer, and Generative AI enthusiast. He builds high-performance web applications integrated with machine learning models.";
  }
  if (q.includes('skill') || q.includes('languages') || q.includes('technologies')) {
    return "Yoga's neural core is skilled in: \n- **Frontend**: React, Tailwind CSS, Framer Motion\n- **Backend**: Node.js, Express, Flask\n- **AI/ML**: Python, Machine Learning, Deep Learning, Generative AI APIs\n- **Databases**: MongoDB, SQL.";
  }
  if (q.includes('project') || q.includes('work') || q.includes('portfolio')) {
    return "Yoga's key deployments include:\n1. **Care360 AI Health Assistant**: Symptom analysis & scheduling.\n2. **AI Chatbot**: Conversational user assistant.\n3. **Student Grade Prediction**: ML regression models.\n4. **Task Management Portal**: Collaborative boards.\n5. **Chess Game**: Interactive gameplay.\nWhich of these would you like to inspect?";
  }
  if (q.includes('care360') || q.includes('health')) {
    return "Care360 AI Health Assistant is a full-stack platform built with React, Express, and MongoDB. It utilizes the Gemini API to analyze patient symptoms, predict health issues, and provide helpful care guidelines.";
  }
  if (q.includes('grade') || q.includes('prediction') || q.includes('student')) {
    return "The Student Grade Prediction System is a Machine Learning project built using Python, Flask, and Scikit-Learn. It analyzes demographics and study habits to predict student grades.";
  }
  if (q.includes('chess')) {
    return "The Chess Game is an interactive web-based chess app built with React, incorporating chess rule algorithms, board validation, and high fidelity movement animations.";
  }
  if (q.includes('task') || q.includes('management')) {
    return "The Task Management Website is a team collaboration tool built with React, Framer Motion, Node.js, and MongoDB, offering smooth Kanban board transitions and productivity analytics.";
  }
  if (q.includes('contact') || q.includes('email') || q.includes('reach')) {
    return "You can establish a communications link with Yoga Dharshan via email at **yodharshan@gmail.com** or send a transmission through the Contact Form on this site.";
  }
  if (q.includes('resume') || q.includes('cv')) {
    return "Yoga's resume is available in the Resume section of this portfolio, where you can inspect his educational timeline and download the complete PDF transmission.";
  }
  if (q.includes('certificate') || q.includes('credential')) {
    return "Yoga holds certifications in 'Neural Networks and Deep Learning' from DeepLearning.AI, 'Supervised Machine Learning' from Stanford, and is a MongoDB certified associate. Check the Certifications grid above!";
  }
  
  return "Query processed. I recommend exploring Yoga's Projects or Skills section to witness his capabilities, or sending a direct email transmission to yodharshan@gmail.com.";
};

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Neural command missing: empty message query.' });
    }

    if (!GEMINI_API_KEY) {
      // Local fallback
      const reply = getRuleBasedResponse(message);
      return res.json({ reply });
    }

    // Call Gemini API if key is present
    try {
      const ai = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `${YOGA_CONTEXT}\n\nUser Question: ${message}\nAI Reply:`;
      const result = await model.generateContent(prompt);
      const reply = result.response.text();
      
      res.json({ reply });
    } catch (apiErr) {
      console.error('Gemini API query failed, falling back to local resolver:', apiErr.message);
      const reply = getRuleBasedResponse(message);
      res.json({ reply });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
