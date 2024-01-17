require('dotenv').config({ path: __dirname + '/.env' });
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Models
const Card = require('./models/Card');
const Pack = require('./models/Pack');
const RarityDistribution = require('./models/RarityDistribution');

// Routes
const userRoutes = require('./routes/user');
const packRoutes = require('./routes/packs');
const cardRoutes = require('./routes/cards');
const templateRoutes = require('./routes/cardTemplate');
const adminRoutes = require('./routes/admin'); 
const authRoutes = require('./routes/auth');
const inventoryRoutes = require('./routes/inventory');

app.use(express.json());
app.use(cors());

// Static folder for images
app.use('/Images', express.static('Images'));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/packs', packRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/cardTemplate', templateRoutes);
app.use('/api', adminRoutes); 
app.use('/api/user', userRoutes);

app.use((error, req, res, next) => {
    console.error(error.stack); // Log stack trace for the error
    res.status(500).send('Something broke!');
  });
  

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;
console.log("MongoDB URI:", mongoURI);
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
