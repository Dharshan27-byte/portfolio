import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  tags: [String],
  date: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  readTime: {
    type: String,
    default: "3 min read"
  },
  author: {
    type: String,
    default: "Yoga Dharshan"
  }
}, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
export default Blog;
