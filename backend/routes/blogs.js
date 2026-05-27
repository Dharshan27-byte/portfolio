import express from 'express';
import Blog from '../models/Blog.js';
import { useMockDB, getMockDBData, saveMockDBData } from '../config/db.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all blogs
router.get('/', async (req, res) => {
  try {
    if (useMockDB) {
      const blogs = getMockDBData('blogs');
      return res.json(blogs);
    }
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    if (useMockDB) {
      const blogs = getMockDBData('blogs');
      const blog = blogs.find(b => b._id === req.params.id);
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
      return res.json(blog);
    }
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create blog (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, tags, readTime, author } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const tagList = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []);
    
    if (useMockDB) {
      const blogs = getMockDBData('blogs');
      const newBlog = {
        _id: 'blog_' + Date.now(),
        title,
        content,
        tags: tagList,
        date: new Date().toISOString().split('T')[0],
        readTime: readTime || '3 min read',
        author: author || 'Yoga Dharshan',
        createdAt: new Date().toISOString()
      };
      blogs.push(newBlog);
      saveMockDBData('blogs', blogs);
      return res.status(201).json(newBlog);
    }

    const newBlog = new Blog({
      title,
      content,
      tags: tagList,
      readTime,
      author
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update blog (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, tags, readTime } = req.body;
    const tagList = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : undefined);

    if (useMockDB) {
      const blogs = getMockDBData('blogs');
      const idx = blogs.findIndex(b => b._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Blog not found' });

      blogs[idx] = {
        ...blogs[idx],
        title: title || blogs[idx].title,
        content: content || blogs[idx].content,
        tags: tagList !== undefined ? tagList : blogs[idx].tags,
        readTime: readTime || blogs[idx].readTime,
        updatedAt: new Date().toISOString()
      };
      saveMockDBData('blogs', blogs);
      return res.json(blogs[idx]);
    }

    const updateFields = { title, content, readTime };
    if (tagList !== undefined) updateFields.tags = tagList;

    // Remove undefined values
    Object.keys(updateFields).forEach(key => updateFields[key] === undefined && delete updateFields[key]);

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!updatedBlog) return res.status(404).json({ message: 'Blog not found' });
    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete blog (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (useMockDB) {
      const blogs = getMockDBData('blogs');
      const filtered = blogs.filter(b => b._id !== req.params.id);
      if (filtered.length === blogs.length) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      saveMockDBData('blogs', filtered);
      return res.json({ message: 'Blog deleted successfully' });
    }

    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
