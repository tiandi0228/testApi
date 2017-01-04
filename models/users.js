var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsersSchema = new Schema(
    {   
        username: {type:String},
        password: {type:String},
        email: {type:String},
        create_date: {type:String},
        avatar: {type:String},
        phone: {type:String}
    }
);

var Users = mongoose.model('Users', UsersSchema);

module.exports = Users;