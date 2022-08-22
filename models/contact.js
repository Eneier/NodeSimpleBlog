const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    num: {
        type: String,
        required: true
    }
});

const Petuhs = mongoose.model('Petuhs', contactSchema);
module.exports = Petuhs;
