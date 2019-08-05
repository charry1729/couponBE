const mongoose = require('mongoose');

const voucherSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    campaign : {type : mongoose.Schema.Types.ObjectId,ref : 'Campaign',required : true} ,
    campaignname:{type : String , required : true},
    quantity : {type : Number,default : 1},
    customerId :  {type : Number,ref : 'User',required : true} ,
    startdate : {type : Date,required : true},
    enddate : {type : Date , required : true},
    status : {type : String , required : true},
    amount : {type : Number ,required : true}
});

module.exports = mongoose.model('Voucher',voucherSchema);