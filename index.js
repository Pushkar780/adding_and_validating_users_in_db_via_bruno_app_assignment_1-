
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Make sure path is correct
const { resolve } = require('path');

const app = express();
const port = 3010;

// Middleware to parse JSON
app.use(express.json());
app.use(express.static('static'));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/marketplace', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Route: Registration
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // 1. Check for empty fields
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create and save user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // 4. Respond with success
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Static home page
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});