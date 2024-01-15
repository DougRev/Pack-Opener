const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  inventory: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
  currency: { type: Number, default: 0 } 

});

const User = mongoose.model('User', userSchema);
module.exports = User;
