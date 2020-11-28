const utils = require('../../../utils');
const response = require('../../responseController');
exports.social = class Social extends utils.GetterSetters{
    id; from_id; created_at;
    constructor(id, from_id, created_at){
        super(['id', 'from_id', 'created_at'],[id, from_id, created_at])
        this.id = id;
        this.from_id = from_id;
        this.created_at = created_at;
        return this;
    }

    static successResponse = (identity, url) => {
        return utils.SET_RESPONSE(
            utils.TWO_HUNDRED, 
            response.ResponseMessages.social.requestSend(identity),
            response.ErrorResponseCode.social.requestSend,
            utils.CURRENT_DATE, 
            url)
    }

    static noTargetUser = ( identity, url ) => {
        return utils.SET_RESPONSE(
            utils.FOUR_HUNDRED_FOUR,
            response.ResponseMessages.common.noTargetUser(identity),
            response.ErrorResponseCode.common.noTargetUser,
            utils.CURRENT_DATE,
            url            
        )
    }

    static removedRequest = url => {
        return utils.SET_RESPONSE(
            utils.TWO_HUNDRED,
            response.ResponseMessages.social.removedRequest,
            response.ErrorResponseCode.social.removedRequest,
            utils.CURRENT_DATE,
            url            
        )
    }

}

exports.common = class Common{
    static invalidIdentity = url => {
        return utils.SET_RESPONSE(utils.FOUR_HUNDRED, 
            response.ResponseMessages.common.invalidIdentity, 
            response.ErrorResponseCode.common.invalidIdentity, 
            utils.CURRENT_DATE, 
            url);
    }
}

exports.search = class Search{
    static searchSuccess = (identities, url) => {
        return utils.SET_RESPONSE(utils.TWO_HUNDRED, 
                                identities, 
                                response.ErrorResponseCode.common.searchResult, 
                                utils.CURRENT_DATE, 
                                url)
    }
}