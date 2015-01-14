var mongoose = require('mongoose');
 
exports.User = mongoose.model('User',{
    username: String,
    password: String,
    email: String,
    admin: Boolean,
    sites: [mongoose.Schema.Types.ObjectId]
});