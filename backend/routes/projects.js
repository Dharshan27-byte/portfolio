import express from 'express';
import Project from '../models/Project.js';
import { useMockDB, getMockDBData, saveMockDBData } from '../config/db.js';
import { auth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    if (useMockDB) {
      const projects = getMockDBData('projects');
      return res.json(projects);
    }
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create project (Admin only)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, tags, githubLink, liveLink, category } = req.body;
    let imageUrl = req.body.imageUrl || '';

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const tagList = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []);

    if (useMockDB) {
      const projects = getMockDBData('projects');
      const newProject = {
        _id: 'proj_' + Date.now(),
        title,
        description,
        tags: tagList,
        githubLink,
        liveLink,
        image: imageUrl || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80',
        category: category || 'Full Stack Development',
        createdAt: new Date().toISOString()
      };
      projects.push(newProject);
      saveMockDBData('projects', projects);
      return res.status(201).json(newProject);
    }

    const newProject = new Project({
      title,
      description,
      tags: tagList,
      githubLink,
      liveLink,
      image: imageUrl || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80',
      category: category || 'Full Stack Development'
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update project (Admin only)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, tags, githubLink, liveLink, category } = req.body;
    let imageUrl = req.body.imageUrl;

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const tagList = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : undefined);

    if (useMockDB) {
      const projects = getMockDBData('projects');
      const idx = projects.findIndex(p => p._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Project not found' });
      
      projects[idx] = {
        ...projects[idx],
        title: title || projects[idx].title,
        description: description || projects[idx].description,
        tags: tagList !== undefined ? tagList : projects[idx].tags,
        githubLink: githubLink !== undefined ? githubLink : projects[idx].githubLink,
        liveLink: liveLink !== undefined ? liveLink : projects[idx].liveLink,
        image: imageUrl || projects[idx].image,
        category: category || projects[idx].category,
        updatedAt: new Date().toISOString()
      };
      saveMockDBData('projects', projects);
      return res.json(projects[idx]);
    }

    const updateFields = {
      title,
      description,
      githubLink,
      liveLink,
      category
    };

    if (imageUrl) updateFields.image = imageUrl;
    if (tagList !== undefined) updateFields.tags = tagList;

    // Remove undefined values
    Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!updatedProject) return res.status(404).json({ message: 'Project not found' });
    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete project (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (useMockDB) {
      const projects = getMockDBData('projects');
      const filtered = projects.filter(p => p._id !== req.params.id);
      if (filtered.length === projects.length) {
        return res.status(404).json({ message: 'Project not found' });
      }
      saveMockDBData('projects', filtered);
      return res.json({ message: 'Project deleted successfully' });
    }

    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
