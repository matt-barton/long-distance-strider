const mongoose = require('mongoose');

let RaceSchema = new mongoose.Schema();

let RunnerSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    totalDistance: { type: Number, required: true, default: 0 },
    gender: { type: String, enum: [ 'Man', 'Woman', null ], default: null },
    races: [{
      _id: { type: mongoose.Schema.ObjectId },
      name: { type: String, required: true },
      distance: { type: Number, required: true }
    }]
});

module.exports = mongoose.model('Runner', RunnerSchema);