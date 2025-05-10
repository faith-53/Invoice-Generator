const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add client name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add client email'],
    unique: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,7})+$/,
      'Please add a valid email address'
    ]
  },
  address: {
    type: String,
    required: [true, 'Please add client address'],
    trim: true
  },
  phone: {
    type: String,
    trim: true
  }
});

ClientSchema.pre('save', async function(next) {
    next();
  });

module.exports = mongoose.model('client', ClientSchema);

