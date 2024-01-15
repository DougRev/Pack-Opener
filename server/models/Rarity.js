// models/Rarity.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const raritySchema = new Schema({
  level: { type: String, enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'], required: true },
  imageUrl: { type: String, required: true },
  statModifier: { type: Number, default: 1, required: true } // Modifier for stats based on rarity
});

module.exports = raritySchema;
