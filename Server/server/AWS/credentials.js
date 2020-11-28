const AWS = require('aws-sdk');
AWS.config.update({region: process.env.AWS_REGION});
AWS.config.credentials = {
    accessKeyId : process.env.AWS_KEYID,
    secretAccessKey : process.env.AWS_SECRET
}
exports.AWS = AWS;