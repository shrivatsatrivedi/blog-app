const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer =  require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});
const fs = require('fs');
const path = require('path');
const salt = bcrypt.genSaltSync(10);
const secret = 'sfdhgstedjhjsrtyfgsg45hst';
// CORS configuration to allow requests from frontend origin
const corsOptions = {
    origin: 'http://localhost:3000', // Adjust this to match your frontend origin
    methods: ['GET', 'POST'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type'], // Specify allowed headers
    credentials: true
};

app.use(cors({credentials:true, origin:'http://localhost:3000', credentials: true,}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));

// Connect to MongoDB using the correct connection URI
mongoose.connect('mongodb+srv://user:cPFdhWLmrcYmZxMd@cluster0.jzwsk.mongodb.net/mern-blog?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(error => console.error('MongoDB connection error:', error));

// Define a root route for the homepage
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>My Blog App</title>
            </head>
            <body>
                <h1>Welcome to My Blog App</h1>
                <p>This is the homepage of my MERN blog application.</p>
                <p>Use /register to register a new user.</p>
            </body>
        </html>
    `);
});

// Define the register route
app.post('/register', async (req, res) => {
    const { Username, Password } = req.body;
    try {
        const userDoc = await User.create({ Username, Password:bcrypt.hashSync(Password,salt),});
        res.json(userDoc);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
   
});

app.post('/login', async (req, res) => {
  const { Username, Password } = req.body;

  try {
      // Find the user in the database
      const userDoc = await User.findOne({ Username });

      // If user is not found, return an error response
      if (!userDoc) {
          return res.status(400).json({ message: 'User not found' });
      }

      // Compare the password using bcrypt
      const passok = bcrypt.compareSync(Password, userDoc.Password);

      if (!passok) {
          return res.status(400).json({ message: 'Incorrect password' });
      }

     jwt.sign({Username,id:userDoc. id}, secret, {}, (err,token) => {
             if(err) throw err;  
             res.cookie('token',token).json({
                id:userDoc._id,
                Username,
             });
               });

  } catch (error) {
      // Handle any other errors
      console.error(error);
      res.status(500).json({ message: 'An error occurred during login' });
  }
});

app.get('/profile', (req, res) => {
    const token = req.cookies.token;
    
    // Check if the token is missing
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    
    // Verify the token if it exists
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        res.json(info); // Send back user info if verification is successful
    });
});


app.post('/logout',(req,res) =>{
    res.cookie('token', '').json('ok');
});


app.post('/post', uploadMiddleware.single('file'), async(req, res) => {
    const { originalname, path: oldPath } = req.file; // req.file.path is the temp path
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = `${oldPath}.${ext}`; // Append the file extension to the old path
// Rename the uploaded file to include the correct extension
    fs.renameSync(oldPath, newPath);
const{token} = req.cookies;
jwt.verify(token , secret , {} , async(err,info) => {
    if(err) throw err;
    const{title,summary,content} = req.body;
    const postDoc =  await Post.create({
            title,
            summary,
            content,
            cover:newPath,
             author: info.id,
    });
    res.json(postDoc);
    
});


     
    
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    try {
      // Handle file upload if a new file is provided
      let newPath = null;
      if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = `${path}.${ext}`;
        fs.renameSync(path, newPath);
      }
  
      // Verify JWT token
      const { token } = req.cookies;
      jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid or expired token' });
        }
  
        // Extract and validate request data
        const { id, title, summary, content } = req.body;
        if (!id || !title || !summary || !content) {
          return res.status(400).json({ message: 'Missing required fields' });
        }
  
        // Find the post document and verify the author
        const postDoc = await Post.findById(id);
        if (!postDoc) {
          return res.status(404).json({ message: 'Post not found' });
        }
  
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
          return res.status(403).json({ message: 'You are not the author of this post' });
        }
  
        // Update the post
        const updatedPost = await Post.findByIdAndUpdate(
          id,
          {
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover, // Use newPath if a new file was uploaded
          },
          { new: true } // Return the updated document
        );
  
        res.json(updatedPost); // Send the updated post document as response
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

app.get('/post', async (req, res) => {
   
        const posts = await Post.find()
        .populate('author', ['Username'])
        .sort({createdAt: -1})
        .limit(20); // Sort by latest created
        res.json(posts); // Send posts as JSON response
    
});


app.get('/post/:id' , async(req,res) =>{
    const {id} = req.params;
   const postDoc =await Post.findById(id).populate('author' , ['Username']);
   res.json(postDoc);
})
// Start the server
app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});
