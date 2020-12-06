const router = require('express').Router();

const Agent = require('../../schema/auth_schema/agent_model');

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

//@POST  - /

module.exports = router;