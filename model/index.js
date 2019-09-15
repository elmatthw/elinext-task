const mongoose = require('mongoose')

var ArchiveSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title required']
    },
    description: String,
    expire: Date
})

module.exports = mongoose.model('archive', ArchiveSchema)