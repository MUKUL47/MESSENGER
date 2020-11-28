const AWS = require('aws-sdk');
AWS.config.update({region: process.env.AWS_REGION});
AWS.config.credentials = {
    accessKeyId : process.env.AWS_KEYID,
    secretAccessKey : process.env.AWS_SECRET
}

exports.sendEmails = (SUBJECT, HTML_CONTENT, EMAILS_DESTINATION, EMAIL_SOURCE) => {
    AWS.config.region = process.env.AWS_REGION_SES
    var params = {
        
        Destination: { ToAddresses: typeof EMAILS_DESTINATION == 'string' ? [EMAILS_DESTINATION] : EMAILS_DESTINATION},
        Message: {
            Body: {
            Html: { Charset: "UTF-8", Data: HTML_CONTENT },
            Text: { Charset: "UTF-8", Data: "TEXT_FORMAT_BODY" }
            },
            Subject: { Charset: 'UTF-8', Data: SUBJECT }
            },
        Source: EMAIL_SOURCE, 
        };
    return new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise()
}

exports.sendSMS = ( msg, phn ) => {
    AWS.config.region = process.env.AWS_REGION_SNS
    return new AWS.SNS({apiVersion: '2010-03-31'}). publish({ Message: msg, PhoneNumber: phn }).promise();
}