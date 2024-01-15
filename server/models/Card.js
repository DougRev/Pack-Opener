const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  template: { type: Schema.Types.ObjectId, ref: 'CardTemplate', required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  team: { type: String, required: true },
  position: { type: String, required: true },
  imageUrl: { type: String, required: true },
  rarity: { type: String, enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'], required: true },
  offensiveSkills: {
    shooting: Number,
    dribbling: Number,
    passing: Number
  },
  defensiveSkills: {
    onBallDefense: Number,
    stealing: Number,
    blocking: Number
  },
  physicalAttributes: {
    speed: Number,
    acceleration: Number,
    strength: Number,
    verticalLeap: Number,
    stamina: Number
  },
  mentalAttributes: {
    basketballIQ: Number,
    intangibles: Number,
    consistency: Number
  },
});

const Card = mongoose.model('Card', cardSchema);
module.exports = Card;
