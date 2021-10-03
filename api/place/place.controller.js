const placeService = require("./place.service");

const placeAutoComplete = async (req, res, next) => {
  try {
    const { city } = req.query;
    const places = await placeService.placeAutoComplete(city);
    return res.json(places);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  placeAutoComplete,
};
