const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Agent = require('../../schema/auth_schema/agent_model');

//@POST - /signup
//Agent Registration
router.post('/signup', async (req,res) => {
    const { name, email, password, licenseNo, expireDate } = req.body;

    // Simple validation
    if (!name || !email || !password || !licenseNo || !expireDate) {
        return res.status(400).json({ message : 'Please enter all fields' });
    };

    //check for existing user
    try {
        const user = await Agent.findOne({ email });        
        if (user) throw Error('User already exists');

        //Create salt & hash
        const salt = await bcrypt.genSalt(10);
        if (!salt) throw Error('Something went wrong with bcrypt');
        
        const hash = await bcrypt.hash(password, salt);
        if (!hash) throw Error('Something went wrong hashing the password');

        const newAgent = new Agent({
            name,
            email,
            password: hash,
            licenseNo,
            expireDate 
        });

        const savedAgent = await newAgent.save();
        if (!savedAgent) throw Error('Something went wrong saving the user');
        
        const token = jwt.sign({ id: savedAgent._id }, process.env.jwt_secret, {
            expiresIn: 3600
        });

        res.send({success: true, message: `New Agent user ${savedAgent.name} is created`})
        
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
});

//@POST  - /signin
//Agent Login
router.post('/signin', async (req,res) => {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
        return res.status(400).json({ message : 'Please enter all fields' });
    };

    try {
        // Check for existing user
        const user = await Agent.findOne({ email });
        if (!user) throw Error('Admin user does not exist');
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw Error('Invalid credentials');
    
        const token = jwt.sign({ id: user._id, email: user.email, type: user.type}, process.env.jwt_secret, { expiresIn: 3600 });
        if (!token) throw Error('Couldnt sign the token');
        
        res.send({success: true, token: token, message: `Agent user ${user.name} is logged in..`})
    } catch (error) {
        res.send({ success: false, message: error.message })
    }
});


module.exports = router;