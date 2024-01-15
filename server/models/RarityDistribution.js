const mongoose = require('mongoose');

const RarityDistributionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  packType: {
    type: String,
    enum: ['Standard', 'Premium', 'Deluxe'],
    required: true,
  },
  rarityDistribution: {
    Common: { type: Number, required: true },
    Uncommon: { type: Number, required: true },
    Rare: { type: Number, required: true },
    Epic: { type: Number, required: true },
    Legendary: { type: Number, required: true }
  }
});

module.exports = mongoose.model('RarityDistribution', RarityDistributionSchema);
