const loadExpress = require('./express');
const loadMongo = require('./mongo');

async function loadApp(app) {
    // Load Mongo
    await loadMongo();
    console.log('Connected to Database.');

    // Load Express
    await loadExpress(app);
    console.log('Express Loaded !');


}
module.exports = loadApp;