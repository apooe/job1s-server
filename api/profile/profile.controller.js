const profileService = require("./profile.service");

const add = async (req, res, next) => {
  try {
    const profile = req.body;
    console.log(profile);
    const result = await profileService.add(profile);
    return res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const profile = req.body;
    const result = await profileService.update(profile);
    return res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    await profileService.deleteById(id);
    return res.sendStatus(200); // Convert 200 to ok && set status to 200
  } catch (e) {
    next(e);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await profileService.getById(id);
    return res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const getByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await profileService.getByUserId(userId);
    return res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const getAll = async (req, res, next) => {
  try {
    const { q } = req.query;
    const query = q || {};
    const results = await profileService.getAll(query);
    return res.status(200).json(results);
  } catch (e) {
    next(e);
  }
};

const uploadPicture = async (req, res, next) => {
  try {
    const { picture } = req.query;
    const pic = await profileService.uploadPicture(picture);
    return res.json(pic);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  add,
  update,
  deleteById,
  getById,
  getByUserId,
  getAll,
  uploadPicture,
};
