const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    // other fields as necessary
  });
  
  const Pack = mongoose.model('Pack', packSchema);
  module.exports = Pack;
  