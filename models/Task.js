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
    dueDate: {
        type: mongoose.SchemaTypes.Date,
    }
})

module.exports = mongoose.model('task', TaskSchema)