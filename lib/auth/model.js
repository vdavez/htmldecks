var mongoose = require('mongoose');
 
exports.User = mongoose.model('User',{
    username: String,
    password: String,
    email: String,
    sites: [mongoose.Schema.Types.ObjectId]
});