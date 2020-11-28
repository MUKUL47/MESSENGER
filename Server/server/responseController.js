const config = require('../config');
const utils = require('../utils');

class ResponseMessages {
    static login = {
        userNotFound    : "User not found."
    }

    static common = {
        keygen          : keygen => keygen,
        invalidFields   : fields => 'Invalid field(s) :'+fields,
        missingKeys     : keys => "Missing key(s) :"+keys,
        invalidJson     : "Invalid json format",
        invalidIdentity : 'Invalid email or mobile',
        invalidSecret   : "Secret token is invalid or expired.",
        noTargetUser    : user => `user ${user} not found.`
    }

    static register = {
        userExist       : 'User exist',
        incorrectOtp    : 'Incorrect Otp',
    }

    static social = {
        invalidSearchParams : 'Invalid start or count parameters',
        invalidSearchName : 'Invalid username',
        requestSend : friend => 'Your request has been sent to : '+friend,
        removedRequest : 'Request removed',
        requestPending : 'Invalid request operation for this user',
        requestNotFound : 'Request not found',
        userNotFound : 'User not found',
        invalidProfile : 'Your profile is not created'
    }

    static profile = {
        invalidNameLength : 'Name length cannot be greator than 20',
        invalidName : 'Name is invalid',
        duplicateName : 'Name already taken'
    }

}

class responseCode {
    static login = {
        userNotFound    : 7
    }

    static register = {
        userExist       : 3,
        incorrectOtp    : 5,
        userRegistered  : 6
    }

    static common = {
        keygen          : 4,
        missingKeys     : 1,
        invalidFields   : 2,
        invalidJson     : 8,
        invalidIdentity : 9,
        searchResult    :10,
        invalidSecret   :11,
        noTargetUser    :13
    }

    static social = {
        requestSend : 12,
        removedRequest : 14
    }

    static profile = {
        invalidNameLength : 15
    }
}

exports.ResponseMessages = ResponseMessages;
exports.ErrorResponseCode = responseCode;