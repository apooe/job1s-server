const {Router} = require('express');
const multer = require('multer');
const path = require('path');

// Set file storage options
const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        // set the stored path
        const filePath = path.resolve('./public/uploads');
        cb(null,filePath )
    },
    filename: function (req, file, cb) {
        // Set the store filename
        const storedFileName =`u_${Date.now()+path.extname(file.originalname)}`; // Date.now (current millisecond for unique file name && append extension
        cb(null, storedFileName) //Appending extension
    }
});

// Accept only image
const onlyImageFilter = (req, file, cb) => {
    // Set the filetypes, it is optional
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);

    const extname = filetypes.test(path.extname(
        file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }

    cb("Error: File upload only supports the "
        + "following filetypes - " + filetypes);
}

// Create uploader
const uploader = multer({storage: fileStorage, fileFilter: onlyImageFilter});

//Filename in the client form
const fileLabel = "img";
const intUploadRoutes = (globalRouter) => {

    //create a new router
    const uploadRouter = new Router();


    globalRouter.use('/upload', uploadRouter);


    //define prefix for all routes
    uploadRouter.post('/', uploader.single(fileLabel), (req, res, next) => {
        console.log(req.file);
        // see static assets (in lib/loaders/express.js file)
        const linkPrefix = `/static/uploads/`;
        const fullLink = linkPrefix+req.file.filename;
        return res.json({link: fullLink});
    });




}

module.exports = {intUploadRoutes};
