const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const User = require('./models/User');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('.'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({mongoUrl: process.env.MONGODB_URI}),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Middleware to load user from session - Adding user to request object
app.use(async (req, res, next) => {
  if (req.session.userId) {
    try {
      req.user = await User.findById(req.session.userId).select('-password');
    } catch (error) {
      console.error('Error loading user from session:', error);
    }
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Serve HTML files
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/accounts.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/home.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/cart.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/profile.html'));
});

app.get('/thankyou', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/thankyou.html'));
});

app.get('/admin', (req, res) => {
  req.user && req.user.role === 'admin'
    ? res.sendFile(path.join(__dirname, 'public/admin.html'))
    : res.status(403).sendFile(path.join(__dirname, 'public/404.html'));
});

/*// Redirect root to home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});*/

// 404 Error Handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public/404.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
