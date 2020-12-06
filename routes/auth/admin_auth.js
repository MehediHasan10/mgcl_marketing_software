const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Admin = require('../../schema/auth_schema/admin_model');

//@POST - /signup
//Admin Registration
router.post('/signup', async (req,res) => {
    const { name, email, password } = req.body;
    
    // Simple validation
    if (!name || !email || !password) {
        return res.status(400).json({ message : 'Please enter all fields' });
    };

    //check for existing user
    try {
        const user = await Admin.findOne({ email });        
        if (user) throw Error('User already exists');

        //Create salt & hash
        const salt = await bcrypt.genSalt(10);
        if (!salt) throw Error('Something went wrong with bcrypt');
        
        const hash = await bcrypt.hash(password, salt);
        if (!hash) throw Error('Something went wrong hashing the password');

        const newAdmin = new Admin({
            name,
            email,
            password: hash,            
        });

        const savedAdmin = await newAdmin.save();
        if (!savedAdmin) throw Error('Something went wrong saving the user');
        
        const token = jwt.sign({ id: savedAdmin._id }, process.env.jwt_secret, {
            expiresIn: 3600
        });

        // res.status(200).json({
        //     token,
        //     user: {
        //       id: savedAdmin.id,
        //       name: savedAdmin.name,
        //       email: savedAdmin.email
        //     }
        // });     

        res.send({success: true, message: `New Admin user ${savedAdmin.name} is created`})
        
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
});


//@POST  - /signin
//Admin Login
router.post('/signin', async (req,res) => {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
        return res.status(400).json({ message : 'Please enter all fields' });
    };

    try {
        // Check for existing user
        const user = await Admin.findOne({ email });
        if (!user) throw Error('Admin user does not exist');
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw Error('Invalid credentials');
    
        const token = jwt.sign({ id: user._id, email: user.email, type: user.type}, process.env.jwt_secret, { expiresIn: 3600 });
        if (!token) throw Error('Couldnt sign the token');
        
        res.send({success: true, message: `Admin user ${user.name} is logged in..`})
    } catch (error) {
        res.send({ success: false, message: error.message })
    }
});

module.exports = router;
