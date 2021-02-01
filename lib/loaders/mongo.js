const mongoose = require('mongoose');
const config = require('../../config');

async function loadMongo(){
    //connect to mongodb
    const c  = await mongoose.connect(config.databaseURL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
    });


    return c.connection.db;
}

module.exports = loadMongo;