const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const Voucher = require('../models/voucher');
const Campaign = require('../models/campaigns');
const User = require('../models/user');

router.get('/',(req,res,next)=>{
   Voucher.find()
   .select('_id quantity campaign')
   .populate('campaign','name _id')
   .exec()
   .then(result => {
       console.log(result);
       res.status(200).json({
           count : result.length,
           Vouchers : result
       });
   })
   .catch(err => {
       res.status(500).json({
           error : err
       });
   });
   
});


router.post('/',(req,res,next)=>{
    Campaign.findById(req.body.campaignId)
    .then(campaign => {
        if(!campaign){
            return res.status(404).json({
                message : 'campaign not found'
            });
        }
        console.log(campaign.balancevouchers);
        User.find({phonenumber: req.body.customerId})
        .then(user => {
            if(!user){
                return res.status(404).json({
                    message : 'User Not Found'
                })
            }
        }) 
var bal = campaign.balancevouchers - req.body.quantity;
console.log(bal);
        Campaign.updateOne({_id : req.body.campaignId},
            {$set : {
                balancevouchers : bal
            }}).exec();
        const voucher = new Voucher({
            _id : new mongoose.Types.ObjectId(),
            quantity : req.body.quantity,
            campaign : req.body.campaignId,
            campaignname : campaign.name,
            customerId : req.body.customerId,
            startdate : req.body.startdate,
            enddate : req.body.enddate,
            status : req.body.status,
            amount : req.body.amount
        });
        return voucher.save();

    })
    .then(result => {
        console.log(result);
        
        res.status(201).json({
            message : "Voucher Stored",
            CreatedVoucher : {
                ID : result._id,
                campaign : result.campaign,
                campaignname : result.campaignname,
                quantity : result.quantity
            },
            request :{
                type : 'GET',
                url : 'http://localhost:3000/vouchers/'+result._id
            }
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error : err
        });
    });


});

router.get('/:voucherId',(req,res,next)=>{
    Voucher.findById(req.params.voucherId)
    .populate('campaign')
    .exec()
    .then(result => {
        res.status(200).json({
            result
        });
    })
    .catch(err =>{
        res.status(500).json({
            error : err
        });
    });
    
});
router.patch('/:voucherId',(req,res,next)=>{
    res.status(200).json({
        message : 'Voucher Updated'
    });
});
router.delete('/:voucherId',(req,res,next)=>{
    Voucher.remove({_id: req.params.voucherId})
    .exec()
    .then(result => {
        res.status(200).json({
            message : 'Voucher has been deleted'
        });
    })
    .catch(err =>{
        res.status(500).json({
            error : err
        });
    });
    
    
});

module.exports = router;