const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/User');
const app = express();

app.use(cors());
app.use(express.json());

 mongoose.connect('mongodb+srv://blog:<g7foOcIPt8zIC3gt>@cluster0.u2j3s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

app.post('/register', async(req, res) => {
    const{Username,Password} = req.body;
  const userDoc = await User.create({Username,Password});
    res.json(userDoc);
    
});

app.listen(4000);
//mongodb+srv://blog:<taCdbvTsDh0GLGc>@cluster0.u2j3s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//mongodb+srv://blog:<taCdbvTsDh0GLGc>@cluster0.u2j3s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0