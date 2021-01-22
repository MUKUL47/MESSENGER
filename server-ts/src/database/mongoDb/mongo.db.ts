import mongoose from "mongoose";
const messageChunk = new mongoose.Schema({
    createdAt: Date,
    updatedAt: Date,
    owner: String,
    participants: [],
    messages: [{
        author: String,
        createdAt: Date,
        content: String //actual message
    }]
})
export class MongoDB{
    public initializeModel() : Promise<any>{
        return mongoose.connect(process.env.MONGO_URL, {useNewUrlParser : true, useUnifiedTopology : true});
    }
}
export const MongoClient : any = mongoose.model('messageModel', messageChunk)