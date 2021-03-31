const {Router} = require('express');
const userController = require('./user.controller');
const {validate} = require('../../lib/helpers/middlewares');
const userValidator = require('./user.validator');
const {isAuth} = require('./user.middlewares');



const initUserRoutes = (globalRouter) => {

    //create a new router
    const userRouter = new Router();

    //define prefix for all routes
    globalRouter.use('/users', userRouter);

    //define routes
    userRouter.post('/', validate("body", userValidator), userController.add);
    userRouter.put('/', userController.update);
    userRouter.delete('/:id', userController.deleteById);
    userRouter.get('/search', userController.searchProfiles);
    userRouter.get('/:id', userController.getById);
    userRouter.get('/', userController.getAll);
    userRouter.post('/login', userController.login);
    userRouter.post('/change-password', userController.changePassword);
    userRouter.post('/home', isAuth, (req, res) => {
        console.log(req.token);
    })
    userRouter.post('/uploadResume', userController.uploadResume);
    userRouter.post('/sendFormToUser', userController.sendFormToUser);


}

module.exports = {initUserRoutes};
