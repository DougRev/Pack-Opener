const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    transactionType: { type: String, enum: ['sell', 'buy'], required: true },
    cardId: { type: Schema.Types.ObjectId, ref: 'Card' },
    createdAt: { type: Date, default: Date.now }
  });
  
  module.exports = transactionSchema;
