## AWS Image Rekognition

### Prerequisites

*Creat AWS profile with rekognition permisions.

*Create IAM user with Rekognition and S3 access.

*Copy “accessKeyId” and “secretAccessKey”

*If you are going to use analyze S3 hosted images/videos then create S3 bucket with relevant permissions.

 
### Environment Variables

**AWS_ACCESS_KEY** - an AWS access id with access to S3 and Rekognition

**AWS_SECRET_KEY** - a matching AWS secret key

**AWS_PROFILE** - the AWS profile that you want to run image recognition

**AWS_REGION** - the AWS region you'd like to use. eg: 'us-west-1'


### NPM Functions

1. detectModerationLabelsFromLocalFile(filepath) 
    * input : filepath of .jpg or .png image
    * output : 
        * recognize visible labels and respective confidence values from the given local image
        * recognize image orientation in degrees

2. detectFacesFromLocalFile(filepath)
    * input : filepath of .jpg or .png image
    * output : 
        * recognize visible faces, pose, orientation from image

3. detectLabelFromS3WithOwnAWSAccountAndBucket(resource)
    * input : 
    ```javascript
        var resources ={
            accessKeyId: "AKyyyyyyyyBRA",
            secretAccessKey: "OTNhdceixxxxxxxOpG5Wldha+kX",
            region: "us-east-1",
            bucketName:"rekognition-bucket-name",
            image: "moderation-image.jpg" 
        }; 
    ```
    * output : 
        * recognize lables from S3 bucket hosted image file

### Usage

```javascript

var recognitionService = require('image-recognition-aws'); // import awe-rekognition-npm library
 
recognitionService.detectFacesFromLocalFile('Local-file-path/profile.jpg', function(err, result){
    if(!err)
     console.log(result); // get JSON output
}); 


var resources = {
    accessKeyId: "AKyyyyyyyyBRA",
    secretAccessKey: "OTNhdceixxxxxxxOpG5Wldha+kX",
    region: "us-east-1",
    bucketName:"rekognition-bucket-name",
    image: "moderation-image.jpg" 
}; 
recognitionService.detectLabelFromS3WithOwnAWSAccountAndBucket(resources, function(err, result){
    if(!err)
     console.log(result); // get JSON output
});  

```

### TODO

- [ ] Add Celebrity detection API
- [ ] Add capability to apply rekognition to web image URL insted of using local filepath
- [ ] Add More Image rekognition Functionalities