import express from 'express';
import Certificate from '../models/Certificate.js';
import { useMockDB, getMockDBData, saveMockDBData } from '../config/db.js';
import { auth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Get all certificates
router.get('/', async (req, res) => {
  try {
    if (useMockDB) {
      const certificates = getMockDBData('certificates');
      return res.json(certificates);
    }
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create certificate (Admin only)
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const { name, issuer, date, credentialId } = req.body;
    let link = req.body.link || '';

    if (req.file) {
      link = `/uploads/${req.file.filename}`;
    }

    if (useMockDB) {
      const certificates = getMockDBData('certificates');
      const newCert = {
        _id: 'cert_' + Date.now(),
        name,
        issuer,
        date: date || new Date().toISOString().split('T')[0],
        link: link || '#',
        credentialId: credentialId || '',
        createdAt: new Date().toISOString()
      };
      certificates.push(newCert);
      saveMockDBData('certificates', certificates);
      return res.status(201).json(newCert);
    }

    const newCert = new Certificate({
      name,
      issuer,
      date,
      link,
      credentialId
    });

    const savedCert = await newCert.save();
    res.status(201).json(savedCert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete certificate (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (useMockDB) {
      const certificates = getMockDBData('certificates');
      const filtered = certificates.filter(c => c._id !== req.params.id);
      if (filtered.length === certificates.length) {
        return res.status(404).json({ message: 'Certificate not found' });
      }
      saveMockDBData('certificates', filtered);
      return res.json({ message: 'Certificate deleted successfully' });
    }

    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
    res.json({ message: 'Certificate deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
