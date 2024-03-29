const { Router } = require("express");
const recruiterController = require("./recruiter.controller");
const userValidator = require("./../user/user.validator");
const { isAuth } = require("./../user/user.middlewares");
const { validate } = require("./../../lib/helpers/middlewares");

const initRecruiterRoutes = (globalRouter) => {
  //create a new router
  const recruiterRouter = new Router();

  //define prefix for all routes
  globalRouter.use("/recruiters", recruiterRouter);

  //define routes
  recruiterRouter.post(
    "/",
    validate("body", userValidator),
    recruiterController.add
  );

  recruiterRouter.put("/", recruiterController.update);
  recruiterRouter.delete("/:id", recruiterController.deleteById);
  recruiterRouter.get("/search", recruiterController.searchJobPosts);
  recruiterRouter.get(
    "/findRelatedJobSeeker",
    recruiterController.findRelatedJobSeeker
  );
  recruiterRouter.get(
    "/findRelatedRecruiters",
    recruiterController.findRelatedRecruiters
  );
  recruiterRouter.get("/:id", recruiterController.getById);
  recruiterRouter.get("/", recruiterController.getAll);
  recruiterRouter.post("/login", recruiterController.login);
  recruiterRouter.post("/uploadImg", recruiterController.uploadPicture);

  recruiterRouter.post("/home", isAuth, (req, res) => {
    console.log(req.token);
  });
};

module.exports = { initRecruiterRoutes };
