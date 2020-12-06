const { model, Schema } = require('mongoose');

//Granite Sell post model constructor
const GraniteListSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    amount: { 
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    price: {
        type: Number,
        required: true
    }
});

module.exports = model('granitelist', GraniteListSchema);
