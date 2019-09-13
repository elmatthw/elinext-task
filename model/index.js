const mongoose = require('mongoose')

var ArchiveSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: [true, 'Title required']
    },
    description: String,
    expire: Date
})

module.exports = mongoose.model('Archive', ArchiveSchema)