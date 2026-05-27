import express from 'express';
import { useMockDB, getMockDBData, saveMockDBData } from '../config/db.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Input incomplete. Requires name, email, and message.' });
    }

    const newMessage = {
      _id: 'msg_' + Date.now(),
      name,
      email,
      subject: subject || 'General Inquiry',
      message,
      date: new Date().toISOString(),
      status: 'unread'
    };

    let contacts = [];
    try {
      contacts = getMockDBData('contacts');
    } catch (e) {
      contacts = [];
    }

    contacts.push(newMessage);
    saveMockDBData('contacts', contacts);

    // If MongoDB is running, we could save it to a Message model. 
    // Since our database configuration covers both, keeping all messages in a local log file / mock data
    // ensures the admin dashboard can read it instantly under any deployment without database mismatches.
    
    res.status(201).json({ 
      success: true, 
      message: 'Message securely transmitted through the cyberpunk neural network!' 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all contact messages (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    const contacts = getMockDBData('contacts');
    res.json(contacts.sort((a, b) => new Date(b.date) - new Date(a.date)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete message (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const contacts = getMockDBData('contacts');
    const filtered = contacts.filter(m => m._id !== req.params.id);
    if (filtered.length === contacts.length) {
      return res.status(404).json({ message: 'Message not found' });
    }
    saveMockDBData('contacts', filtered);
    res.json({ message: 'Message successfully deleted from logs.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
