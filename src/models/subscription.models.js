import mongoose from "mongoose" ;

const subscriptionSchema = new mongoose.Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId , // One who is subscribing
        ref: "User"
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId , // Subscriber
        ref: "User"
    }
}, 
{
    timestamps: true
}
);


export const subscription = mongoose.model("subscription", subscriptionSchema); 