require('dotenv').config();
const mongoose = require('mongoose');
const RarityDistribution = require('./models/RarityDistribution'); // adjust the path as necessary

const mongoURI = process.env.MONGODB_URI;
console.log("MongoDB URI:", mongoURI);
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const rarityDistributions = [
  {
    name: "Starter Pack",
    rarityDistribution: {
      Common: 70,
      Uncommon: 20,
      Rare: 8,
      Epic: 2,
      Legendary: 0
    }
  },
  {
    name: "Premium Pack",
    rarityDistribution: {
      Common: 50,
      Uncommon: 30,
      Rare: 15,
      Epic: 4,
      Legendary: 1
    }
  }
  // ... more distributions
];

async function insertRarityDistributions() {
  try {
    for (const distribution of rarityDistributions) {
      const newDistribution = new RarityDistribution(distribution);
      await newDistribution.save();
    }
    console.log('Rarity distributions have been inserted successfully.');
  } catch (error) {
    console.error('Error inserting rarity distributions:', error);
  }
  mongoose.disconnect();
}

insertRarityDistributions();
