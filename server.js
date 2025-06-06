const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const authRoutes = require("./Routes/authRoutes");
const blogRoutes = require("./Routes/blogRoutes");

app.use(cors({
  origin: 'https://blog-client-nu-mauve.vercel.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true 
}));


app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// Add a simple root route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Connect to MongoDB (optional: you might want to move this outside the handler if issues arise)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Remove this for serverless deployment
// const PORT = process.env.PORT;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

module.exports = app;  // Export app for Vercel
