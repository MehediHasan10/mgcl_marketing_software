const { model, Schema } = require('mongoose');
const {isEmail} = require('validator');

//Admin model constructor
const AdminSchema = new Schema({ 
    name: {
        type: String,
        required: [true, 'Please, provide an username.'] 
    },
    email: {
        type: String,
        required: [true, 'Please, provide an email.'],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please, enter a valid username."]
    },
    password: {
        type: String,
        required: [true, 'Please, provide a password.'],
        minlength: [8, 'Minimum length of the password is 8.'] 
    }, 
    type: {
        type: String,
        default: "admin"
    }   
});

module.exports = model('admin', AdminSchema);
