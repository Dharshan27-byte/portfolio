import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import User from '../models/User.js';
import { useMockDB, getMockDBData, saveMockDBData } from '../config/db.js';
import { auth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'CYBER_SECRET_KEY_998877';

// Auto-seed admin user if none exists
export const seedAdmin = async () => {
  const defaultUser = {
    username: 'admin',
    passwordHash: await bcrypt.hash('admin123', 10)
  };

  if (useMockDB) {
    let users = [];
    try {
      users = getMockDBData('users');
    } catch (e) {
      users = [];
    }
    if (users.length === 0) {
      users.push({
        _id: 'admin_id',
        username: defaultUser.username,
        password: defaultUser.passwordHash
      });
      saveMockDBData('users', users);
      console.log('🔑 Seeded Default Mock Admin: admin / admin123');
    }
  } else {
    try {
      const count = await User.countDocuments();
      if (count === 0) {
        const user = new User({
          username: defaultUser.username,
          password: defaultUser.passwordHash
        });
        await user.save();
        console.log('🔑 Seeded Default MongoDB Admin: admin / admin123');
      }
    } catch (err) {
      console.error('Error seeding admin user:', err.message);
    }
  }
};

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Input dimensions incomplete. Enter credentials.' });
    }

    let user;
    if (useMockDB) {
      const users = getMockDBData('users');
      user = users.find(u => u.username === username);
    } else {
      user = await User.findOne({ username });
    }

    if (!user) {
      return res.status(400).json({ message: 'Credential signature rejected. Access denied.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credential signature rejected. Access denied.' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify Token Route
router.get('/verify', auth, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Resume Upload Route (Admin only)
router.post('/resume', auth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file transmitted.' });
    }

    const defaultResumePath = './uploads/resume-default.pdf';
    fs.copyFileSync(req.file.path, defaultResumePath);
    fs.unlinkSync(req.file.path);

    res.json({ 
      success: true, 
      message: 'Resume node successfully updated on host server.',
      url: '/uploads/resume-default.pdf'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
