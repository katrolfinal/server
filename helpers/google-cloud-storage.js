	
  const GoogleCloudStorage = require('@google-cloud/storage');
  
  const GOOGLE_CLOUD_PROJECT_ID = 'hacktiv8-244310'; // Replace with your project ID
  const GOOGLE_CLOUD_KEYFILE = `./keyfile.json`; // Replace with the path to the downloaded private key
  
  const storage = new GoogleCloudStorage.Storage({
    projectId: GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: GOOGLE_CLOUD_KEYFILE,
  });
  
  exports.storage = storage

  exports.getPublicUrl = (bucketName, fileName) => `https://storage.googleapis.com/${bucketName}/${fileName}`;


  exports.copyFileToGCS = (localFilePath, bucketName, options) => {
    options = options || {};

    const bucket = storage.bucket(bucketName);
    const fileName = path.basename(localFilePath);
    const file = bucket.file(fileName);

    return bucket.upload(localFilePath, options)
        .then(() => file.makePublic())
        .then(() => exports.getPublicUrl(bucketName, gcsName));
}; 