# MERN Stack Blog Application

A full-stack blog application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. This application allows users to register, log in, create, edit, and view blog posts with rich text content and image uploads.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Demo](#demo)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Backend Setup (API)](#backend-setup-api)
  - [Frontend Setup (React App)](#frontend-setup-react-app)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Posts](#posts)
- [Technologies Used](#technologies-used)
- [License](#license)
- [Contact](#contact)

## Introduction

This project is a simple blogging platform that demonstrates how to build a full-stack application using the MERN stack. Users can perform CRUD operations on blog posts, with support for rich text editing and image uploads.

## Features

- User authentication (registration and login)
- Create, read, update, and delete blog posts
- Rich text editor for creating and editing posts
- Image upload functionality
- Responsive design for various screen sizes
- JWT-based authentication and authorization
- RESTful API built with Express.js and MongoDB

## Demo

[Include screenshots or a link to a live demo if available.]

## Prerequisites

- **Node.js** and **npm** installed on your machine
- **MongoDB** installed and running (or a MongoDB Atlas account)
- Basic understanding of JavaScript, React, and Node.js

## Installation

### Backend Setup (API)

1. **Navigate to the `api` directory:**

   ```bash
   cd api

2. **Install backend dependencies:**

    ```bash
    npm install
    ```

3. **Set Up Environment Variables**

    - Create a `.env` file in the `api` directory.
    - Add the following variables:

    ```env
    MONGODB_URI=your-mongodb-connection-string
    JWT_SECRET=your-jwt-secret-key
    ```

4. **Start the Backend Server**

    ```bash
    node index.js
    ```
    The backend server will run on [http://localhost:4000](http://localhost:4000).

### Frontend Setup (React App)

1. **Navigate back to the root directory:**

    ```bash
    cd ../
    ```

2. **Install Frontend Dependencies:**

    ```bash
    npm install
    ```

3. **Start the Frontend Development Server:**

    ```bash
    npm start
    ```
    The frontend app will run on [http://localhost:3000](http://localhost:3000).

## Usage

1. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).
2. Register a new account or log in with existing credentials.
3. Create, edit, and view blog posts created by other users.

## Project Structure

```plaintext
your-project/
├── api/                     # Backend (Express.js)
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── uploads/             # Uploaded images
│   └── index.js
├── src/                     # Frontend (React.js)
│   ├── pages/
│   │   ├── CreatePost.js
│   │   ├── EditPost.js
│   │   ├── IndexPage.js
│   │   ├── LoginPage.js
│   │   ├── PostPage.js
│   │   └── RegisterPage.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   ├── Layout.js
│   ├── Post.js
│   └── UserContext.js
├── package.json
└── README.md

```

API Endpoints

### Authentication
- POST /register - Register a new user
- POST /login - Log in a user
- POST /logout - Log out the current user
- GET /profile - Get the authenticated user's profile

### Posts
- GET /post - Retrieve all posts
- GET /post/:id - Retrieve a single post by ID
- POST /post - Create a new post (requires authentication)
- PUT /post - Update an existing post (requires authentication)


## Technologies Used

### Frontend:
- React.js
- React Router DOM
- React Context API
- React Quill (Rich Text Editor)
- date-fns (Date formatting)

### Backend:
- Node.js
- Express.js
- MongoDB with Mongoose
- bcryptjs (Password hashing)
- jsonwebtoken (JWT authentication)
- multer (File uploads)
- cookie-parser

### Other:
- CSS for styling
- Fetch API for HTTP requests

 
## Contact
shrivatsatrivedi@gmail.com
