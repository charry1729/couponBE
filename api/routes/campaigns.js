const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const checkAuth = require('../middleware/check-auth');

const Campaign = require('../models/campaigns');

router.get('/',(req,res,next)=>{
    Campaign.find()
    .select('name price _id vouchers status startdate enddate balancevouchers')
    .exec()
    .then(doc =>{
        if(doc){
            const result = {
                count : doc.length,
                campaigns : doc.map(docs =>{
                    return {
                        name : docs.name,
                        price : docs.price,
                        ID  : docs._id,
                        vouchers : docs.vouchers,
                        startdate : docs.startdate,
                        enddate : docs.enddate,
                        status : docs.status,
                        balancevouchers : docs.balancevouchers,
                        request : {
                            type : 'GET',
                            url : 'http://localhost:3000/campaings/'+docs._id
                        }
                    }
                })
            }
            res.status(200).json(result);
        }else{
            res.status(404).json({
                message : 'No valid entry found for campainId'
            });
        }
        
    }).catch(err =>{
        console.log(err);
        res.status(500).json({error : err});
    });  
});


router.post('/',checkAuth,(req,res,next)=>{
  

    const campaign = new Campaign({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price,
        startdate : req.body.startdate,
        enddate : req.body.enddate,
        vouchers : req.body.vouchers,
        balancevouchers : req.body.vouchers,
        status : req.body.status
    });
    campaign.save().then(result =>{
        console.log(result);
        res.status(200).json({
            message : 'Created Campaign',
            createdCampaign : {
                name : result.name,
                price : result.price,
                ID : result._id,
                request : {
                    type : 'GET',
                    url : 'http://localhost:3000/campaigns/'+result._id
                }
            }
        });
    }).catch(err =>{
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
  
});

router.get('/:campaignId',(req,res,next)=>{
    const ID = req.params.campaignId;
    Campaign.findById(ID)
    .select('name price _id status vouchers')
    .exec().then(doc =>{
        console.log(doc);
        if(doc){
            res.status(200).json({
                campaign : doc,
                request : {
                    type : 'GET',
                    description : 'Get All Campaigns',
                    url : 'http://localhost:3000/campaigns'
                }
            });

        }else{
            res.status(404).json({
                message : 'No valid entry found for campaignId'
            });
        }
        
    }).catch(err =>{
        console.log(err);
        res.status(500).json({error : err});
    });  

});
router.patch('/:campaignId',(req,res,next)=>{
    const ID = req.params.campaignId;
    const updateOps ={};
    for (const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Campaign.update({_id:ID},{ $set : updateOps})
    .exec()
    .then(result =>{
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error : err});
    });
   
});
router.delete('/:campaignId',(req,res,next)=>{
    const ID = req.params.campaignId;
    Campaign.remove({_id : ID}).exec().then(result =>{
        console.log(result);
            res.status(200).json(result);
        
        
    }).catch(err =>{
        console.log(err);
        res.status(500).json({error : err});
    });  
});

module.exports = router;