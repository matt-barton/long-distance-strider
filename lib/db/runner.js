const mongoose = require('mongoose')
  uniqueArrayPlugin = require('mongoose-unique-array');

let RaceSchema = new mongoose.Schema();

let RunnerSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    totalDistance: { type: Number, required: true, default: 0 },
    races: [{
      _id: { type: mongoose.Schema.ObjectId, unique: true },
      name: { type: String, required: true },
      distance: { type: Number, required: true }
    }]
});

RunnerSchema.plugin(uniqueArrayPlugin);

module.exports = mongoose.model('Runner', RunnerSchema);