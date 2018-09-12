const mongoose = require('mongoose');

let RunnerSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    totalDistance: { type: Number, required: true, default: 0 },
    gender: { type: String, enum: [ 'man', 'woman', 'unknown' ], default: 'unknown' },
    races: [{
      _id: { type: mongoose.Schema.ObjectId },
      name: { type: String, required: true },
      distance: { type: Number, required: true }
    }]
});

module.exports = mongoose.model('Runner', RunnerSchema);