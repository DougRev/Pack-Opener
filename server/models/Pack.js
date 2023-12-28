const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  rarityDistribution: {
    Common: { type: Number, required: true },
    Uncommon: { type: Number, required: true },
    Rare: { type: Number, required: true },
    Epic: { type: Number, required: true },
    Legendary: { type: Number, required: true },
  },
  // other fields as necessary
});
  
  const Pack = mongoose.model('Pack', packSchema);
  module.exports = Pack;
  