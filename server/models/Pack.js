const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true, },
  rarityDistribution: {
    common: { type: Number, default: 70 }, // percentage for common cards
    uncommon: { type: Number, default: 20 },
    rare: { type: Number, default: 8 },
    epic: { type: Number, default: 2 },
    legendary: { type: Number, default: 0 }
  },
  // Include a reference to possible cards or card templates if needed
});

const Pack = mongoose.model('Pack', packSchema);
module.exports = Pack;

  