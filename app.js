const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

//reference of express module
const app = express();

app.use(cors());
//parsing the json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//mongo config and connection
mongoose.connect(process.env.database_url , {
    useNewUrlParser: true,
    useFindAndModify: false,
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

app.get('/dev',(req,res) => {
    const author = {
        name : 'Zahid',
        profession : 'Node js Developer'
    };
    res.send(author);
});
//routes handler
app.use('/adminAuth', require('./routes/auth/admin_auth'));
app.use('/agentAuth', require('./routes/auth/agent_auth'));

app.use('/adminAction', require('./routes/admin/admin_action'));
app.use('/agentAction', require('./routes/agent/agent_action'));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`> Server listening on port ${port}..`));
