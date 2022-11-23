const mongoose = require('mongoose');

const EmployerProfile = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    business: {
        type: [String],
        required: true
    },
    picture: {},
    description: {
        type: String
    }
})


//TODO: check how to add profile pics
module.exports = Employer = mongoose.model('employer', EmployerProfile);