
const mongoose = require('mongoose');
const messageModel = require('./messageSchema').messageChunk;
exports.initalizeMessageModel = async function(){
    try{        
        await mongoose.connect('mongodb://localhost/messenger', {useNewUrlParser : true})        
    }
    catch(ee){
        console.error('initMessageModel ee ->> ',ee)
    }
}

exports.messageModel = mongoose.model('messageModel', messageModel);
