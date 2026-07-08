const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

async function register(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const existing = await userModel.findByUsernameOrEmail(username, email);
  if (existing) {
    return res.status(409).json({ error: 'Username or email is already taken.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = await userModel.createUser(username, email, passwordHash);

  req.session.userId = userId;
  res.status(201).json({ id: userId, username, email });
}

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const user = await userModel.findByUsername(username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  req.session.userId = user.id;
  res.json({ id: user.id, username: user.username, email: user.email });
}

function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to log out.' });
    }
    res.clearCookie('session_cookie');
    res.json({ message: 'Logged out.' });
  });
}

async function getCurrentUser(req, res) {
  const user = await userModel.findById(req.session.userId);
  res.json(user);
}

module.exports = { register, login, logout, getCurrentUser };
