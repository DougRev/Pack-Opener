const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Enum for NBA teams
const teamsEnum = [
    'Atlanta Hawks', 'Boston Celtics', 'Brooklyn Nets',
    'Charlotte Hornets', 'Chicago Bulls', 'Cleveland Cavaliers',
    'Dallas Mavericks', 'Denver Nuggets', 'Detroit Pistons',
    'Golden State Warriors', 'Houston Rockets', 'Indiana Pacers',
    'LA Clippers', 'Los Angeles Lakers', 'Memphis Grizzlies',
    'Miami Heat', 'Milwaukee Bucks', 'Minnesota Timberwolves',
    'New Orleans Pelicans', 'New York Knicks', 'Oklahoma City Thunder',
    'Orlando Magic', 'Philadelphia 76ers', 'Phoenix Suns',
    'Portland Trail Blazers', 'Sacramento Kings', 'San Antonio Spurs',
    'Toronto Raptors', 'Utah Jazz', 'Washington Wizards'
  ];
  
// Enum for NBA positions
const positionsEnum = [
    'Point Guard', 'Shooting Guard', 'Small Forward',
    'Power Forward', 'Center'
  ];

const cardTemplateSchema = new Schema({
  packId: {type: String, required: false},
  name: { type: String, required: true },
  team: { 
    type: String, 
    required: true,
    enum: teamsEnum
  },
  position: { 
    type: String, 
    required: true,
    enum: positionsEnum
  },
  overallRating: { type: Number },
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
  imageUrl: { type: String, required: true },
  rarities: [{
    level: { type: String, enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'] },
    imageUrl: { type: String },
    statModifier: { type: Number }
  }],  
});

cardTemplateSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('offensiveSkills') || this.isModified('defensiveSkills') || this.isModified('physicalAttributes') || this.isModified('mentalAttributes')) {
      const statsSum = this.offensiveSkills.shooting + this.offensiveSkills.dribbling + this.offensiveSkills.passing +
                       this.defensiveSkills.onBallDefense + this.defensiveSkills.stealing + this.defensiveSkills.blocking +
                       this.physicalAttributes.speed + this.physicalAttributes.acceleration + this.physicalAttributes.strength +
                       this.physicalAttributes.verticalLeap + this.physicalAttributes.stamina +
                       this.mentalAttributes.basketballIQ + this.mentalAttributes.intangibles + this.mentalAttributes.consistency;
      const numberOfStats = 14;
      this.overallRating = Math.round(statsSum / numberOfStats);
    }
    next();
  });
  

const CardTemplate = mongoose.model('CardTemplate', cardTemplateSchema);
module.exports = CardTemplate;
