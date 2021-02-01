const {Router} = require('express');
const userController = require('./user.controller');

const initUserRoutes = (globalRouter) => {

    //create a new router
    const userRouter = new Router();

    //define prefix for all routes
    globalRouter.use('/users', userRouter);

    //define routes
    userRouter.post('/', userController.add);
   // userRouter.put('/', userController.update);
    userRouter.delete('/:id', userController.deleteById);
    userRouter.get('/:id', userController.getById);
    userRouter.get('/', userController.getAll);
    userRouter.post('/login', userController.login);
    userRouter.post('/change-password', userController.changePassword);
}

module.exports = {initUserRoutes};