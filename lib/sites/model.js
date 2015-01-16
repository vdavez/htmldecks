var mongoose  = require('mongoose')

exports.Site = mongoose.model('Site', {
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    title: String,
    content: String,
    date_created: String,
    theme: String
})