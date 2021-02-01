const {Router} = require('express');
const {initUserRoutes} = require('./user/user.routes');
const {initPlacesRoutes} = require('./place/place.routes');

const loadAllApiRoutes = () => {
    const globalRouter = new Router();

    initUserRoutes(globalRouter);
    initPlacesRoutes(globalRouter);


    return globalRouter;
}

module.exports = loadAllApiRoutes;