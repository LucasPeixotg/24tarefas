const mongoose = require('mongoose')

const User = mongoose.model('person', {
    name: String,
    password: String
})

module.exports = User