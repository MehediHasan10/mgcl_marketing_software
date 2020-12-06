const router = require('express').Router();

const Agent = require('../../schema/auth_schema/agent_model');
const GraniteList = require('../../schema/admin/granite_list');

//@POST  - /removeAgent
//Delete option to remove an agent by Admin
router.post('/removeAgent/:id', async (req, res) => {
    try {      
        await Agent.deleteOne({ _id: req.params.id });
        res.send({ success: true, message: `Agent is removed.` });
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
});

//Admin Granite sell post

//@POST  - /addGranite
//Add granite list to sell
router.post('/addGranite', async (req,res) => {
   try {
        const addGraniteList = new GraniteList(req.body);
        await addGraniteList.save();
        res.send({  success: true, message: `Created new Granite sell List.`});
   } catch (error) {
        res.send({ success: false, message: error.message });
   }
});  

//@POST  - /editGranite
//Edit the Granite sell list
router.post('/editGranite/:id', async (req, res) => {
    try{
        const updatedList = await GraniteList.findOneAndUpdate(
            {_id: req.params.id},
            { $set: { 
                type: req.body.type,
                amount: req.body.amount,
                price: req.body.price
            }}            
        );
        updatedList.save();
        res.send({ success: true, message: `Granite sell post is being updated.` });
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
});

//@POST  - /removeGraniteList
//Delete option to remove Granite List by Admin
router.post('/removeGraniteList/:id', async (req, res) => {
    try {      
        await GraniteList.deleteOne({ _id: req.params.id });
        res.send({ success: true, message: `Granite list is removed.` });
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
});

module.exports = router;
