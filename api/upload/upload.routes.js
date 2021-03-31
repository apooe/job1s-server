const {Router} = require('express');
const multer = require('multer');
const path = require('path');

// Set file storage options
const fileStorageImg = multer.diskStorage({
    destination: function (req, file, cb) {
        // set the stored path
        const filePath = path.resolve('./public/uploadsImg');
        cb(null, filePath)
    },
    filename: function (req, file, cb) {
        // Set the store filename
        const storedFileName = `u_${Date.now() + path.extname(file.originalname)}`; // Date.now (current millisecond for unique file name && append extension
        cb(null, storedFileName) //Appending extension
    }
});

// Set file storage options
const fileStorageForResume = multer.diskStorage({
    destination: function (req, file, cb) {
        // set the stored path
        const filePath = path.resolve('./public/uploadsResume');
        cb(null, filePath)
    },
    filename: function (req, file, cb) {
        // Set the store filename
        const storedFileName = `resume${path.extname(file.originalname)}`;
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

    cb("Error: Image upload only supports the "
        + "following filetypes - " + filetypes);
}

const onlyResumeFilter = (req, file, cb) => {
    // Set the filetypes, it is optional
    const filetypes = /pdf|docx|doc/;
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
const uploaderForImg = multer({storage: fileStorageImg, fileFilter: onlyImageFilter});
const uploaderForResume = multer({storage: fileStorageForResume, fileFilter: onlyResumeFilter});
//Filename in the client form
const imgLabel = "img";
const resumeLabel = "resume";


const intUploadImgRoutes = (globalRouter) => {

    //create a new router
    const uploadRouter = new Router();

    globalRouter.use('/uploadImg', uploadRouter);

    //define prefix for all routes
    uploadRouter.post('/', uploaderForImg.single(imgLabel), (req, res, next) => {
        console.log(req.file);
        const linkPrefix = `/static/uploadsImg/`;
        const fullLink = linkPrefix + req.file.filename;
        return res.json({link: fullLink});
    });
}


const intUploadResumeRoutes = (globalRouter) => {

    //create a new router
    const uploadRouter = new Router();

    globalRouter.use('/uploadResume', uploadRouter);

    //define prefix for all routes
    uploadRouter.post('/', uploaderForResume.single(resumeLabel), (req, res, next) => {
        console.log("req.file => ", req.file);
        const linkPrefix = `/static/uploadsResume/`;
        const fullLink = linkPrefix + req.file.filename;
        return res.json({link: fullLink});
    });
}

module.exports = {intUploadImgRoutes, intUploadResumeRoutes};
