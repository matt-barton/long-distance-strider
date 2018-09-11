const mongoose = require('mongoose');

let RaceSchema = new mongoose.Schema();

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

RunnerSchema.statics.getAll = function () {
  let self = this;
  return new Promise(resolve => {
    return self.find().exec().then(runners => {
      console.log(runners);
    });
  });
};

module.exports = mongoose.model('Runner', RunnerSchema);