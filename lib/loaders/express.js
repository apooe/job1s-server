const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const config = require('../../config')
const loadApiRoutes = require('../../api')
const express = require('express');
const path = require('path');
function loadExpress(app){

    //for accepting req from everywhere
    app.use(cors());
    //to secure my app
    app.use(helmet());

    //allow to read body of req
    app.use(bodyParser.json());

    //allow to read variables sent from a form
    app.use(bodyParser.urlencoded({extended:true}));

    //use route fo static file
    app.use('/static', express.static(path.resolve('./public')));

    //definition of routes with prefix
    app.use(config.api.prefix, loadApiRoutes());


    app.use((req, res, next) => {
        const { originalUrl } = req;
        const err ={
            message : `Not Found ${originalUrl}`,
            status: 404,
        };
        next(err);
    });

    app.use((err, req, res, next) => {

        res.status( err.status|| 500);
        res.send(err.message);
     });

}

module.exports = loadExpress;
