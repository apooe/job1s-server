const { Router } = require("express");
const profileController = require("./profile.controller");
//const {validate} = require('../../lib/helpers/middlewares');
//const profileValidator = require('./profile.validator');
//const {isAuth} = require('./user.middlewares');

const initProfileRoutes = (globalRouter) => {
  //create a new router
  const ProfileRouter = new Router();
  //define prefix for all routes
  globalRouter.use("/profiles", ProfileRouter);
  //define routes
  ProfileRouter.post("/", profileController.add); //  validate("body", profileValidator)
  ProfileRouter.put("/", profileController.update);
  ProfileRouter.delete("/:id", profileController.deleteById);
  ProfileRouter.get("/:userId", profileController.getByUserId);
  ProfileRouter.get("/:id", profileController.getById);
  ProfileRouter.get("/", profileController.getAll);
  ProfileRouter.post("/uploadImg", profileController.uploadPicture);
};

module.exports = { initProfileRoutes };
