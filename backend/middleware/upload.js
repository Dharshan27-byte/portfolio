import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = './uploads';

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Copy default mock resume if it doesn't exist so resume download doesn't break
const DEFAULT_RESUME_PATH = path.join(UPLOAD_DIR, 'resume-default.pdf');
if (!fs.existsSync(DEFAULT_RESUME_PATH)) {
  // Create a simple dummy text file representing a resume PDF
  fs.writeFileSync(DEFAULT_RESUME_PATH, 'Yoga Dharshan - Artificial Intelligence and Data Science Engineering Student. Contact: yogadharshan@example.com. Skills: React, Node.js, ML, Gemini API.');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images/documents
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Format not supported! Acceptable formats: png, jpg, jpeg, pdf, doc, docx'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});
