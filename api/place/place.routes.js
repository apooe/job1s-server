const {Router} = require('express');
const placeController = require('./place.controller');

const initPlacesRoutes = (globalRouter) => {

    const placeRouter = new Router();

    globalRouter.use('/place', placeRouter);

    placeRouter.get('/', placeController.placeAutoComplete);
}

module.exports = {initPlacesRoutes};