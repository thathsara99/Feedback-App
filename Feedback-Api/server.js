const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors({
    origin: '*'
}));

const SECRET_KEY = 'your_secret_key';

app.use(bodyParser.json());

const dataDir = path.join(__dirname, 'data');
const usersFile = path.join(dataDir, 'users.json');
const companiesFile = path.join(dataDir, 'companies.json');
const templatesFile = path.join(dataDir, 'templates.json');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, '[]');
if (!fs.existsSync(companiesFile)) fs.writeFileSync(companiesFile, '[]');
if (!fs.existsSync(templatesFile)) fs.writeFileSync(templatesFile, '[]');

const readJSON = (file) => JSON.parse(fs.readFileSync(file, 'utf-8') || '[]');
const writeJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tcroos365@gmail.com',
    pass: 'agqf nvat hsbh kynl'
  }
});

const sendPasswordEmail = async (email, password) => {
  await transporter.sendMail({
    from: 'technical.support@pathtosuccessconsultants.co.uk',
    to: email,
    subject: 'Your Account Credentials',
    text: `Your login password: ${password}`
  });
};

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (e) {
    res.sendStatus(403);
  }
};

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const users = readJSON(usersFile);
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'User not found' });

  bcrypt.compare(password, user.password, (err, result) => {
    if (!result) return res.status(401).json({ message: 'Invalid credentails.' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, companyId: user.companyId }, SECRET_KEY);
    res.json({ token });
  });
});

// Create company (system admin only)
app.post('/api/companies', authMiddleware, (req, res) => {
  if (req.user.role !== 'system_admin') return res.sendStatus(403);
  const companies = readJSON(companiesFile);
  const newCompany = { id: Date.now(), name: req.body.name };
  companies.push(newCompany);
  writeJSON(companiesFile, companies);
  res.status(201).json(newCompany);
});

// Create user (system admin only)
app.post('/api/users', authMiddleware, async (req, res) => {
    if (req.user.role !== 'system_admin') return res.sendStatus(403);
  
    const { email, password, role, companyId } = req.body;
  
    // Only allow creating users with role "company_admin"
    if (role !== 'company_admin') {
      return res.status(400).json({ message: 'Only company_admin users can be created.' });
    }
  
    const users = readJSON(usersFile);
    if (users.some(u => u.email === email)) {
      return res.status(400).json({ message: 'User already exists.' });
    }
  
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now(),
      email,
      password: passwordHash,
      role,
      companyId
    };
  
    users.push(newUser);
    writeJSON(usersFile, users);
  
    await sendPasswordEmail(email, password);
    res.status(201).json({ message: 'User created successfully.' });
});

//Forgot Password
app.post('/api/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const users = readJSON(usersFile);
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex === -1) {
    // Don't reveal user existence
    return res.status(200).json({ message: 'If your email is registered, your password has been reset.' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  users[userIndex].password = hashedPassword;
  writeJSON(usersFile, users);

  return res.status(200).json({ message: 'Password reset successfully.' });
});

// Get templates (auth required)
app.get('/api/templates', authMiddleware, (req, res) => {
  const templates = readJSON(templatesFile);
  if (req.user.role === 'system_admin') return res.json(templates);
  const filtered = templates.filter(t => t.companyId === req.user.companyId);
  res.json(filtered);
});

// Save template
app.post('/api/templates', authMiddleware, (req, res) => {
  const templates = readJSON(templatesFile);
  const newTemplate = req.body;
  const existingIndex = templates.findIndex(t => t.key === newTemplate.key && t.companyId === req.user.companyId);

  newTemplate.companyId = req.user.companyId;

  if (existingIndex !== -1) templates[existingIndex] = newTemplate;
  else templates.push(newTemplate);

  writeJSON(templatesFile, templates);
  res.json({ message: 'Template saved' });
});

// Delete template
app.delete('/api/templates/:key', authMiddleware, (req, res) => {
  let templates = readJSON(templatesFile);
  templates = templates.filter(t => !(t.key === req.params.key && t.companyId === req.user.companyId));
  writeJSON(templatesFile, templates);
  res.json({ message: 'Deleted' });
});

app.listen(port, () => console.log(`Server running on:${port}`));