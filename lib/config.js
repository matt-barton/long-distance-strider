const dotenv = require('dotenv');
dotenv.load();

const mongoose = require('mongoose');

mongoose.connect(process.env.mongoDb, { useMongoClient: true });
mongoose.Promise = global.Promise;mongoose.connection.on('connected', function () {  
    console.log('Mongoose connection open to ' + process.env.mongoDb);
});

module.exports = {
    disconnect: () => mongoose.connection.close()
}