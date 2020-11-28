exports.messageChunk = new require('mongoose').Schema({
    createdAt       : Date,
    updatedAt       : Date,
    owner           : String,
    participants    : [],
    messages        : [{
        author : String, //owner id
        createdAt : Date,
        content : String //actual message
    }]        
})