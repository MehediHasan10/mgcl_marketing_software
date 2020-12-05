const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

//reference of express module
const app = express();

//parsing the json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//mongo config and connection
// const url = "mongodb+srv://el06:test1234@cluster0.a9rlb.mongodb.net/mgcl_marketing";
// const url = "mongodb://localhost:27017/mgcl_marketing";
mongoose.connect(process.env.database_url , {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).catch((err) => console.log(err)); //Handles initial connection error

const db = mongoose.connection;
db.on('error', () => {
    console.log('> Error occurred from database...');
});
db.once('open', () => {
    console.log('> Database is connected successfully...');
});

//routes handler
app.use('/adminAuth', require('./routes/auth/admin_auth'));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`> Server listening on port ${port}..`));
