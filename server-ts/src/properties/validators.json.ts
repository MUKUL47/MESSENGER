const register = {
    type : 'object',
    property : {
        identity : { type : 'string' },
        password : { type : 'string' },
    },
    required : ['identity', 'password']
};
export default {
    '/register' : register,
    '/login' : register
}
export const objectFields = {
    '/register' : ['identity', 'password'],
    '/login' : ['identity', 'password'],
}