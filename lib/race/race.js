const mongoose = require('mongoose');

let runnerSchema = new mongoose.Schema({
    name: String,
    gender: String
});

let RaceSchema = new mongoose.Schema({
    url: { type: String, required: true, unique: true },
    distance: { type: Number },
    reportName: { type: String, required: true },
    reportHtml: { type: String, required: true },
    runners: { type: [ runnerSchema ] },
    processed: { type: Boolean, required: true, default: false },
    ignore: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('Race', RaceSchema);