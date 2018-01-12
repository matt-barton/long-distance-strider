const mongoose = require('mongoose');

let RaceSchema = new mongoose.Schema({
    url: { type: String, required: true, unique: true },
    distance: { type: Number },
    reportName: { type: String, required: true },
    reportHtml: { type: String, required: true },
    runners: { type: [ String ] },
    processed: { type: Boolean, required: true, default: false },
    ignore: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('Race', RaceSchema);