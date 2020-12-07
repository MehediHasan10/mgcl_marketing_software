const router = require('express').Router();

const Agent = require('../../schema/auth_schema/agent_model');
const GraniteList = require('../../schema/admin/granite_list');
const GranitePurchase = require('../../schema/agent/granite_purchase');

//POST  -  /purchaseReq
//Granite Buy Request by Agent to Admin
router.post('/purchaseReq/:id', async (req, res) => {
    try{
        const agent = await Agent.findById(req.params.id);

        const newGranitePurchase = new GranitePurchase({
            agent: agent,
            type: req.body.type,
            requestAmount: req.body.requestAmount
        });

        const savedPurchaseReq = await newGranitePurchase.save();
        if ( !savedPurchaseReq ) throw Error("Something went wrong saving the Agent's purchase request record"); 
        
        res.send({ success: true, message: "Purchase Request is delivered."})

    } catch (error) {
        res.send({ success: false, message: error.message })
    }
})

module.exports = router;