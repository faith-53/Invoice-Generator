const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Please add item description']
    },
    quantity: {
        type: Number,
        required: [true, 'Please add item quantity']
    },
    rate: {
        type: Number,
        required: [true, 'Please add item rate']
    },
    amount: {
        type: Number,
        required: [true, 'Please add item amount']
    }
}
    
)
module.exports = mongoose.model('item', ItemSchema);