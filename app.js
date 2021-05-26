const express = require('express')
const config = require('./config');
const loadApp = require('./lib/loaders')
const cors = require('cors')
async function startServer(){
    //create a new server of express
    const app = express();
    app.use(cors());

    //loaders
    await loadApp(app);

    app.listen(config.port, err => {
        if(err){
            console.error(err);
            process.exit(1);
            return;
        }

        console.log('***********************************************');
        console.log(`  SERVER RUNNING at http://localhost:${config.port}/`);
        console.log('***********************************************');
    });
}

startServer();
