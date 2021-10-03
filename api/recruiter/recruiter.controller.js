const recruiterService = require("./recruiter.service");

const add = async (req, res, next) => {
  try {
    const recruiter = req.body;
    const result = await recruiterService.add(recruiter);
    return res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const recruiter = req.body;
    const result = await recruiterService.update(recruiter);
    return res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    await recruiterService.deleteById(id);
    return res.sendStatus(200); // Convert 200 to ok && set status to 200
  } catch (e) {
    next(e);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await recruiterService.getById(id);
    return res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const getAll = async (req, res, next) => {
  try {
    const { q } = req.query;
    const query = q || {};
    const results = await recruiterService.getAll(query);
    return res.status(200).json(results);
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const recruiter = req.body;
    const { token } = await recruiterService.login(recruiter);
    return res.json({ token }); // Convert 200 to ok && set status to 200
  } catch (e) {
    next(e);
  }
};

const uploadPicture = async (req, res, next) => {
  try {
    const { picture } = req.query;
    const pic = await recruiterService.uploadPicture(picture);
    return res.json(pic);
  } catch (e) {
    next(e);
  }
};

const searchJobPosts = async (req, res, next) => {
  try {
    const { job } = req.query;
    const profiles = await recruiterService.searchJobPosts(job);
    return res.json(profiles);
  } catch (e) {
    next(e);
  }
};

const findRelatedJobSeeker = async (req, res, next) => {
  try {
    const { id } = req.query;
    const profiles = await recruiterService.findRelatedJobSeeker(id);
    return res.json(profiles);
  } catch (e) {
    next(e);
  }
};

const findRelatedRecruiters = async (req, res, next) => {
  try {
    const { job } = req.query;
    const profiles = await recruiterService.findRelatedRecruiters(job);
    return res.json(profiles);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  add,
  update,
  deleteById,
  getById,
  getAll,
  login,
  findRelatedJobSeeker,
  findRelatedRecruiters,
  uploadPicture,
  searchJobPosts,
};
