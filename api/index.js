// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');

const app = express();

// Configuration Constants
const salt = bcrypt.genSaltSync(10);
const secret = 'sfdhgstedjhjsrtyfgsg45hst'; // Consider storing this securely using environment variables

// CORS Configuration
app.use(cors({
    origin: 'http://localhost:3000', // Adjust this to match your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Multer Configuration for In-Memory Storage
const uploadMiddleware = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
        }
    },
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://user:cPFdhWLmrcYmZxMd@cluster0.jzwsk.mongodb.net/mern-blog?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(error => console.error('MongoDB connection error:', error));

// Root Route
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

// Register Route
app.post('/register', async (req, res) => {
    const { Username, Password } = req.body;
    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ Username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        // Create new user with hashed password
        const hashedPassword = bcrypt.hashSync(Password, salt);
        const userDoc = await User.create({ Username, Password: hashedPassword });
        res.json(userDoc);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Login Route
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

        // Create JWT token
        jwt.sign(
            { Username, id: userDoc._id }, // Use _id for consistency
            secret,
            { expiresIn: '7d' }, // Token expiration (optional)
            (err, token) => {
                if (err) throw err;
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                }).json({
                    id: userDoc._id,
                    Username,
                });
            }
        );

    } catch (error) {
        // Handle any other errors
        console.error(error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
});

// Profile Route
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

// Logout Route
app.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0), // Expire the cookie immediately
    }).json('ok');
});

// Create a New Post with Image Upload
app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    try {
        const { token } = req.cookies;

        // Verify JWT token
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired token' });
            }

            const { title, summary, content } = req.body;

            // Check if file is provided
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            // Create a new Post with image data
            const postDoc = await Post.create({
                title,
                summary,
                content,
                cover: {
                    data: req.file.buffer,                  // Store image buffer
                    contentType: req.file.mimetype,        // Store MIME type
                },
                author: info.id,
            });

            res.json(postDoc);
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update an Existing Post with Optional Image Upload
app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    try {
        // Verify JWT token
        const { token } = req.cookies;
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired token' });
            }

            const { id, title, summary, content } = req.body;

            if (!id || !title || !summary || !content) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            // Find the post and verify the author
            const postDoc = await Post.findById(id);
            if (!postDoc) {
                return res.status(404).json({ message: 'Post not found' });
            }

            const isAuthor = postDoc.author.toString() === info.id;
            if (!isAuthor) {
                return res.status(403).json({ message: 'You are not the author of this post' });
            }

            // Prepare update data
            const updateData = {
                title,
                summary,
                content,
            };

            // If a new file is uploaded, update the cover
            if (req.file) {
                updateData.cover = {
                    data: req.file.buffer,
                    contentType: req.file.mimetype,
                };
            }

            // Update the post
            const updatedPost = await Post.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            );

            res.json(updatedPost);
        });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get All Posts (Limited to 20, sorted by latest)
app.get('/post', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', ['Username'])
            .sort({ createdAt: -1 })
            .limit(20); // Limit to latest 20 posts

        // Exclude image data from the list response for efficiency
        const postsWithoutImage = posts.map(post => ({
            _id: post._id,
            title: post.title,
            summary: post.summary,
            content: post.content,
            author: post.author,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        }));

        res.json(postsWithoutImage); // Send posts as JSON response
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get a Single Post by ID (Includes Image Data)
app.get('/post/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const postDoc = await Post.findById(id).populate('author', ['Username']);

        if (!postDoc) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Convert image buffer to Base64 string
        let coverImage = null;
        if (postDoc.cover && postDoc.cover.data) {
            const base64Image = postDoc.cover.data.toString('base64');
            coverImage = `data:${postDoc.cover.contentType};base64,${base64Image}`;
        }

        res.json({
            _id: postDoc._id,
            title: postDoc.title,
            summary: postDoc.summary,
            content: postDoc.content,
            cover: coverImage, // Base64-encoded image
            author: postDoc.author,
            createdAt: postDoc.createdAt,
            updatedAt: postDoc.updatedAt,
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get Image for a Specific Post
app.get('/post/:id/image', async (req, res) => {
    try {
        const { id } = req.params;
        const postDoc = await Post.findById(id);

        if (!postDoc || !postDoc.cover || !postDoc.cover.data) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.set('Content-Type', postDoc.cover.contentType);
        res.send(postDoc.cover.data);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Start the Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on blog-app-silk-gamma.vercel.app`);
});
