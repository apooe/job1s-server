const {Router} = require('express');
const multer = require('multer');
const path = require('path');
const aws = require('aws-sdk')
const config = require('../../config');
const multers3 = require('multer-s3');
const rateLimit = require("express-rate-limit");

const awsStorage = new aws.S3({
    accessKeyId: config.aws.id,
    secretAccessKey: config.aws.secret,
    correctClockSkew: true,
});

function checkExtension(ext) {
    return ['png', 'svg', 'jpg', 'jpeg', 'pdf', 'docx'].includes(ext);
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
        case 'docx':
            return 'application/docx';
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
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50 // limit each IP to 100 requests per windowMs
});

//Filename in the client form
const imgLabel = "img";
const resumeLabel = "resume";

const intUploadImgRoutes = (globalRouter) => {

    //create a new router
    const uploadRouter = new Router();
    uploadRouter.use(limiter);
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
    uploadRouter.use(limiter);

    //  globalRouter.use(limiter);
    globalRouter.use('/uploadResume', uploadRouter);

    //define prefix for all routes
    uploadRouter.post('/', uploadAws("resumes").single(resumeLabel), (req, res, next) => {
        console.log("req.file => ", req.file);
        const fullLink = req.file.location;
        return res.json({link: fullLink});
    });
}

module.exports = {intUploadImgRoutes, intUploadResumeRoutes};
