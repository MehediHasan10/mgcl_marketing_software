const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Admin = require('../../schema/auth_schema/admin_model');

//@POST - /signup
router.post('/signup', (req,res) => {
    const { name, email, password } = req.body;

    // Simple validation
    if (!name || !email || !password) {
        return res.status(400).json({ message : 'Please enter all fields' });
    };

    //check for existing user
    Admin.findOne({ email })
        .then((user) => {
            if (user) return res.status(400).json({
                message: 'Admin User already exists'
            });

            
            const newAdmin = new Admin({
                name,
                email,
                password
            });

            //Create salt & hash
            bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newAdmin.password, salt, (err, hash) => {
                        if (err) throw err;
                        
                        newAdmin.password = hash;
                        newAdmin.save()
                            .then((user) => {

                                jwt.sign(
                                    {id: user.id},
                                    process.env.jwt_secret,
                                    {expiresIn: 3600},
                                    (err, token) => {
                                        if (err) throw err;
                                        
                                        res.json({
                                            token,
                                            userAdmin: {
                                                id: user.id,
                                                name: user.name,
                                                email: user.email
                                            }
                                        });
                                        
                                    }
                                )
                                
                            });
                        
                    });
                });
            
        });
});


//@POST  - /signin
router.post('/signin', (req,res) => {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
        return res.status(400).json({ message : 'Please enter all fields' });
    };

    //check for existing user
    Admin.findOne({ email })
        .then((user) => {
            if (!user) return res.status(400).json({
                message: 'Admin User doesnot exists'
            });

            
            //Validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ message: 'Invalid Cred'});
                    
                    jwt.sign(
                        {id: user.id},
                        process.env.jwt_secret,
                        {expiresIn: 3600},
                        (err, token) => {
                            if (err) throw err;
                            
                            res.json({
                                token,
                                userAdmin: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email
                                }
                            });
                            
                        }
                    )                    

                }); 
            


        });
})

module.exports = router;