const register = {
    type : 'object',
    property : {
        identity : { type : 'string' },
    },
    required : ['identity']
};
export default {
    '/register' : register,
    '/login' : register
}
export const objectFields = {
    '/register' : ['identity'],
    '/login' : ['identity'],
}