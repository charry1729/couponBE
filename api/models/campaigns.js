const mongoose = require('mongoose');

const campaignSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : {type : String,required : true} ,
    price : {type : Number,required : true} ,
    startdate : {type : Date ,required : true},
    enddate : {type : Date ,required : true},
    vouchers : {type : Number ,required : true},
    balancevouchers : {type : Number , required : true},
    status : {type : String ,required : true}
});

module.exports = mongoose.model('Campaign',campaignSchema);