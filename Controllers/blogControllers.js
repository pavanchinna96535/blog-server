
const Blog = require('../Models/blogModel');

// Create blog
exports.createBlog = async (req, res) => {
  const { title, content } = req.body;
  try {
    console.log(req.user);
    const blog = new Blog({ title, content, author: req.user.id });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ msg: 'Error creating blog' });
  }
};

// Get all blogs with pagination
exports.getAllBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  try {
    const [blogs, total] = await Promise.all([
      Blog.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name'),
      Blog.countDocuments()
    ]);

    res.status(200).json({
      blogs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ msg: 'Error fetching blogs' });
  }
};


// Get single blog
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name');
    if (!blog) return res.status(404).json({ msg: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching blog' });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  const { title, content } = req.body;
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: 'Blog not found' });
    if (blog.author.toString() !== req.user.id) return res.status(403).json({ msg: 'Unauthorized' });

    blog.title = title;
    blog.content = content;
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ msg: 'Error updating blog' });
  }
};



exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;  
    

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }

    if (blog.author.toString() !== userId) {
      return res.status(403).json({ msg: 'Not authorized to delete this blog' });
    }

    await blog.deleteOne();

    res.status(200).json({ msg: 'Blog deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
