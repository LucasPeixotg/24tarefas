const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    username: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    email: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    password: {
        type: mongoose.SchemaTypes.String,
        required: true,
    }
})

module.exports = mongoose.model('user', UserSchema)