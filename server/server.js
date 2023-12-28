require('dotenv').config({ path: __dirname + '/.env' });
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Card = require('./models/Card'); // Adjust the path as necessary to where your model is located.
const packRoutes = require('./routes/packs'); // Adjust the path as necessary
const cardRoutes = require('./routes/cards'); // Import the cards routes
const templateRoutes = require('./routes/cardTemplate'); // Adjust the path as necessary

app.use(express.json()); // for parsing application/json
app.use('/Images', express.static('Images'));

// Enable All CORS Requests for development purpose
app.use(cors());
const authRoutes = require('./routes/auth');
const inventoryRoutes = require('./routes/inventory');
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);

const PORT = process.env.PORT || 5000;
app.use('/api/packs', packRoutes);
app.use('/api/cards', cardRoutes); // Use the cards routes


// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;
console.log("MongoDB URI:", mongoURI);
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

// Templates
app.use('/api/cardTemplate', templateRoutes);
