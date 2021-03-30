import mongoose from "mongoose";
import { IMessage, IMessageChunk } from "../../interfaces/models.if";
import { Message, MessageChunk } from "./mongo.model";
const messageChunk = new mongoose.Schema({
    createdAt: Date,
    updatedAt: Date,
    participant: String,
    messages: [{
        author: String,
        createdAt: Date,
        message: String //actual message
    }]
})
export class MongoDB{
    public initializeModel() : Promise<any>{
        return mongoose.connect(process.env.MONGO_URL, {useNewUrlParser : true, useUnifiedTopology : true});
    }

    public static sendMessage(userId : string, targetId : string, actualMessage : string) : Promise<any>{
        return new Promise(async (resolve, reject) => {
            try{
                const ts :string = new Date().valueOf().toString()
                MongoClient.findOne(
                    { participant : 
                        { $in : 
                            [   `${userId}-${targetId}`, 
                                `${targetId}-${userId}`
                            ] 
                        } 
                    }, async (err : mongoose.NativeError, resp : any) => {
                        if(err?.message){
                            return reject(err.message)
                        }
                        if(resp){
                            await MongoClient.updateOne(
                                {_id : resp._id},
                                {
                                    $push : {
                                        messages : new Message(userId, ts, actualMessage)
                                    } as any,
                                    $set : {
                                        participiant : resp.participant,
                                        updatedAt : ts
                                    }
                                }
                            )
                            resolve(true)
                            return
                        }
                        const message = new Message(userId, ts, actualMessage)
                        const messageChunk = new MessageChunk(ts, ts, `${userId}-${targetId}`, [message])
                        await MongoClient.create(messageChunk)
                    })
            }catch(e){
                reject(e)
            }
        })
    }

    public static getMessages(userId: string, targetId: string, msgLimit ?:number): Promise<any>{
        return new Promise((resolve, reject) => {
            const limit = !msgLimit ? {} :  { messages : { $slice :  msgLimit*-1 }}  
            MongoClient.find(
                { participant : 
                    { $in : 
                        [   `${userId}-${targetId}`, 
                            `${targetId}-${userId}`
                        ] 
                    }
                },limit
            ).exec().then(resolve).catch(reject)
            // MongoClient.aggregate([
            //     {
            //         $match : {
            //             participant : 
            //                 { $in : 
            //                     [   `${userId}-${targetId}`, 
            //                         `${targetId}-${userId}`
            //                     ] 
            //                 }
            //         },
            //     },
            //     {
            //         $group: {
            //             $messages : {
            //                 slNo: {$sum: 1}
            //             }
            //         }
            //     }, 
            //     {
            //         $sort : {
            //             slNo : -1
            //         }
            //     }
            // ]).exec().then(resolve).catch(reject)
        })
    }
}
export const MongoClient : mongoose.Model<any> = mongoose.model('messageModel', messageChunk)