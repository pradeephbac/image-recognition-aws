var AWS = require("aws-sdk");
const fs = require('fs');
var s3 = new AWS.S3();
var promise = require('bluebird');
var async = require('async');

// assign aws profile with rekognition permissions
var credentials = new AWS.SharedIniFileCredentials({
    profile: process.env.AWS_PROFILE
});
AWS.config.credentials = credentials;

// initiate rekognition object with aws access_key, secret_key and region from environment variables
var rekognition = new AWS.Rekognition({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
});


function detectModerationLabels(filepath) {
    return new Promise(resolve => {
        // pull base64 representation of image from file system (or somewhere else)
        fs.readFile(filepath, 'base64', (err, data) => {
            // create a new base64 buffer out of the string passed to us by fs.readFile()
            const buffer = new Buffer(data, 'base64');

            rekognition.detectModerationLabels({
                Image: {
                    Bytes: buffer
                }
            }, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                } else {

                    resolve(data)
                }
            });
        });
    });
}

function detectFacesfromLocalImage(filepath) {

    return new Promise((resolve, reject) => {
        fs.readFile(filepath, 'base64', (err, data) => {
            const imageBuffer = {
                Image: {
                    Bytes: new Buffer(data, 'base64')
                }
            };

            rekognition.detectFaces(imageBuffer, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    });
};


var detectLabelFromS3WithAWSAccountAndBucket = (resources) => {

    return new Promise((resolve, reject) => {
        var rekognitionAPI = new AWS.Rekognition({
            accessKeyId: credentials.accessKeyId,
            secretAccessKey: credentials.secretAccessKey,
            region: credentials.region
        });

        var params = {
            Image: {
                S3Object: {
                    Bucket: resources.bucketName,
                    Name: resources.image
                }
            }
        };

        rekognition.detectLabels(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

/*
Description: 
recognize visible labels and respective confidence values from the given local image
recognize image orientation in degrees

Input: File path from local folder in your computer 

Output: JSON Object
{ 
    Labels:
    [ { Name: 'Human', Confidence: 99.31000518798828 },...],
    OrientationCorrection: 'ROTATE_0' 
}

*/
module.exports.detectModerationLabelsFromLocalFile = async (filepath, cb) => {  
    try {
        cb(null, await detectModerationLabels(filepath));
    } catch (err) {
        cb(err);
    }
};

/*
Description: 
recognize faces from image
Generate boundary cordinations, Pose, quality and confidence value
from respective local image

Input: File path from local folder in your computer 

Output: JSON Object
{ FaceDetails:
   [ { BoundingBox: [Object]],                     ,
       Landmarks: [Array],
       Pose: [Object],   ],
       Quality: [Object],      
       Confidence: 100 } ],
  OrientationCorrection: 'ROTATE_0' }

*/
module.exports.detectFacesFromLocalFile = async (filepath, cb) => { //detectFacesFromLocalFile 
    try {
        cb(null, await detectFacesfromLocalImage(filepath));
    } catch (err) {
        cb(err);
    }
};

/*
Description: 
recognize Moderation values, confidence level fron image from AWS s3 bucket.

Input: 

var resources ={
    accessKeyId: "AKIAJPwewewewe2BRA",
    secretAccessKey: "OTNhdcei56565677775gV9YOpG5Wldha+kX",
    region: "us-east-1",
    bucketName:"rekognition-bucket-name",
    image: "moderation-image.jpg" 
}; 

Output:  
JSON Object
{ ModerationLabels: [] }

*/

module.exports.detectLabelFromS3WithOwnAWSAccountAndBucket = async (resources, cb) => { //detectLabelFromS3WithOwnAWSAccountAndBucket 
    try {
        cb(null, await detectLabelFromS3WithAWSAccountAndBucket(resources));
    } catch (err) {
        cb(err);
    }
}; 