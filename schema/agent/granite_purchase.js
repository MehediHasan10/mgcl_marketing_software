const { model, Schema } = require('mongoose');

//Granite Purchase request model constructor
const GranitePurchaseRequestSchema = new Schema({
    agent:{
        type: Schema.Types.ObjectId,
        ref: 'agent'
    },
    type: {
        type: String,
        required: true
    },
    requestAmount: {
        type: Number,
        required: true
    }    
}); 

module.exports = model('granite_purchase_req', GranitePurchaseRequestSchema);
