const {Router} = require('express');
const {initUserRoutes} = require('./user/user.routes');
const {initPlacesRoutes} = require('./place/place.routes');
const {initProfileRoutes} = require('./profile/profile.routes');
const {intUploadRoutes} = require('./upload/upload.routes')
const loadAllApiRoutes = () => {
    const globalRouter = new Router();

    initUserRoutes(globalRouter);
    initPlacesRoutes(globalRouter);
    initProfileRoutes(globalRouter);
    intUploadRoutes(globalRouter);


    return globalRouter;
}

module.exports = loadAllApiRoutes;
