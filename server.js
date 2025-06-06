
const express=require("express");
const mongoose=require("mongoose")
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();


const app=express();
const authRoutes=require("./Routes/authRoutes");
const blogRoutes=require("./Routes/blogRoutes")

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);





mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})