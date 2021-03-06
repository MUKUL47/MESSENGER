const register = {
    type : 'object',
    property : {
        identity : { type : 'string' },
    },
    required : ['identity']
};
export default {
    '/register' : register,
    '/login' : register,
    '/profile' : {
        type : 'object',
        property : {
            displayName : 'string'
        },
        required : ['displayName']
    }
}
const params = {
    '/social/search' : { type : 'object', property : { name : { type : 'string' } }, required : ['name'] },
    '/messages' : { type : 'object', property : { targetId : { type : 'string' } }, required : ['targetId'] }
}
export { params }
export const objectFields = {
    '/register' : ['identity'],
    '/login' : ['identity'],
}