const {Router} = require('express');
const multer = require('multer');
const path = require('path');
const aws = require('aws-sdk')
const config = require('../../config');
const multers3 = require('multer-s3');
const awsStorage = new aws.S3({
    accessKeyId: config.aws.id,
    secretAccessKey: config.aws.secret,
    correctClockSkew: true,
});
function checkExtension(ext) {
    return ['png', 'svg', 'jpg', 'jpeg', 'pdf'].includes(ext);
}

function getContentTypeByExtension(ext) {
    switch (ext) {
        case 'png':
            return 'image/png';
        case 'svg':
            return 'image/svg+xml';
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'pdf':
            return 'application/pdf';
        default:
            return 'application/octet-stream';
    }
}
const uploadAws = baseDirectory => multer({
    storage: multers3({
        s3: awsStorage,
        bucket: config.aws.bucket,
        acl: 'public-read',
        key: function(req, file, cb) {
            const extension = file.originalname.split('.').pop();

            if (!checkExtension(extension)) {
                cb(new AppError('Extension Invalid', { httpCode: 400 }));
            }
            file.contentType = getContentTypeByExtension(extension);
            const fileName = `${Date.now()}`
            const fileDestination = `job1s/${baseDirectory}/${fileName}.${extension}`;
            cb(null, fileDestination);
        },
    }),
});

// // Set file storage options
// const fileStorageImg = multer.diskStorage({
//     destination: function (req, file, cb) {
//         // set the stored path
//         const filePath = path.resolve('./public/uploadsImg');
//         cb(null, filePath)
//     },
//     filename: function (req, file, cb) {
//         // Set the store filename
//         const storedFileName = `u_${Date.now() + path.extname(file.originalname)}`; // Date.now (current millisecond for unique file name && append extension
//         cb(null, storedFileName) //Appending extension
//     }
// });

// Set file storage options
// const fileStorageForResume = multer.diskStorage({
//     destination: function (req, file, cb) {
//         // set the stored path
//         const filePath = path.resolve('./public/uploadsResume');
//         cb(null, filePath)
//     },
//     filename: function (req, file, cb) {
//         // Set the store filename
//         const storedFileName = `resume_${Date.now() + path.extname(file.originalname)}`;;
//         cb(null, storedFileName) //Appending extension
//     }
// });

// Accept only image
// const onlyImageFilter = (req, file, cb) => {
//     // Set the filetypes, it is optional
//     const filetypes = /jpeg|jpg|png/;
//     const mimetype = filetypes.test(file.mimetype);
//
//     const extname = filetypes.test(path.extname(
//         file.originalname).toLowerCase());
//
//     if (mimetype && extname) {
//         return cb(null, true);
//     }
//
//     cb("Error: Image upload only supports the "
//         + "following filetypes - " + filetypes);
// }

// const onlyResumeFilter = (req, file, cb) => {
//     // Set the filetypes, it is optional
//     const filetypes = /pdf|docx|doc/;
//     const mimetype = filetypes.test(file.mimetype);
//
//     const extname = filetypes.test(path.extname(
//         file.originalname).toLowerCase());
//
//     if (mimetype && extname) {
//         return cb(null, true);
//     }
//
//     cb("Error: File upload only supports the "
//         + "following filetypes - " + filetypes);
// }


// Create uploader
//const uploaderForImg = multer({storage: fileStorageImg, fileFilter: onlyImageFilter});
//const uploaderForResume = multer({storage: fileStorageForResume, fileFilter: onlyResumeFilter});
//Filename in the client form
const imgLabel = "img";
const resumeLabel = "resume";

const intUploadImgRoutes = (globalRouter) => {

    //create a new router
    const uploadRouter = new Router();
    // globalRouter.use(limiter);
    globalRouter.use('/uploadImg', uploadRouter);

    //define prefix for all routes
    uploadRouter.post('/', uploadAws("images").single(imgLabel), (req, res, next) => {

        console.log("TEST",req.file);
        const fullLink = req.file.location;
        return res.json({link: fullLink});
    });
}


const intUploadResumeRoutes = (globalRouter) => {

    //create a new router
    const uploadRouter = new Router();
    //  globalRouter.use(limiter);
    globalRouter.use('/uploadResume', uploadRouter);

    //define prefix for all routes
    uploadRouter.post('/', uploadAws("resumes").single(resumeLabel), (req, res, next) => {
        console.log("req.file => ", req.file);
        const linkPrefix = `/static/uploadsResume/`;
        const fullLink = linkPrefix + req.file.filename;
        return res.json({link: fullLink});
    });
}

module.exports = {intUploadImgRoutes, intUploadResumeRoutes};
