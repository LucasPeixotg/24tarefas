const mongoose = require('mongoose')

const TaskSchema = mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    title: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    done: {
        type: mongoose.SchemaTypes.Boolean,
        default: false,
    },
    deleteDate: {
        type: Date,
        default: Date.now() + 24*60*60*1000 // 24 hours from now
    }
})

module.exports = mongoose.model('task', TaskSchema)