const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  template: { type: Schema.Types.ObjectId, ref: 'CardTemplate', required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' }, // Assuming you have a User model
  overallRating: { type: Number, required: true },
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
  // You can include additional user-specific fields here as needed
});

// If you plan to calculate the overallRating on the fly, you can use a method or virtual

cardSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('offensiveSkills') || this.isModified('defensiveSkills') || this.isModified('physicalAttributes') || this.isModified('mentalAttributes')) {
    // Calculate overallRating based on skills and attributes here, similar to what you have in cardTemplateSchema
    const statsSum = Object.values(this.offensiveSkills).reduce((acc, cur) => acc + cur, 0) +
                     Object.values(this.defensiveSkills).reduce((acc, cur) => acc + cur, 0) +
                     Object.values(this.physicalAttributes).reduce((acc, cur) => acc + cur, 0) +
                     Object.values(this.mentalAttributes).reduce((acc, cur) => acc + cur, 0);
    const numberOfStats = Object.keys(this.offensiveSkills).length +
                          Object.keys(this.defensiveSkills).length +
                          Object.keys(this.physicalAttributes).length +
                          Object.keys(this.mentalAttributes).length;
    this.overallRating = Math.round(statsSum / numberOfStats);
  }
  next();
});

const Card = mongoose.model('Card', cardSchema);
module.exports = Card;
