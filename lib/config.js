const dotenv = require('dotenv');
dotenv.load();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
mongoose.Promise = global.Promise;mongoose.connection.on('connected', function () {  
    console.log('Mongoose connection open to ' + process.env.MONGODB_URI);
});

module.exports = {
    disconnect: () => mongoose.connection.close()
}