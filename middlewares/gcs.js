const gcsHelpers = require('../helpers/google-cloud-storage');

const { storage } = gcsHelpers;

/**
 * Middleware for uploading file to GCS.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return {*}
 */
exports.sendUploadToGCS = (req, res, next) => {
    if (!req.file) {
      return next()
    }
    

    const bucketName = 'nfcard-bucket';
    const bucket = storage.bucket(bucketName);
    const gcsFileName = `${req.file.originalname}`;
    const file = bucket.file(gcsFileName);

    const stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype,
        },
    });

    stream.on('error',/* istanbul ignore next */ (err) => {
        /* istanbul ignore next */
        req.file.cloudStorageError = err;
        /* istanbul ignore next */
        next(err);
    });

    stream.on('finish', () => {
        req.file.cloudStorageObject = gcsFileName;
        return file.makePublic()
          .then(() => {
              
              req.file.gcsUrl = gcsHelpers.getPublicUrl(bucketName, gcsFileName);
              next();
          });
    });

    stream.end(req.file.buffer);
};