const express = require("express");
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');

const campaignRoutes = require('./api/routes/campaigns');
const voucherRoutes = require('./api/routes/vouchers');
const userRoutes = require('./api/routes/user');

mongoose.connect(
    'mongodb+srv://apps:'
+process.env.MONGO_ATLAS_PW+
'@node-practise-avqsi.mongodb.net/',{dbName :'test'}
);
//mongoose.Promise = global.Promise;
app.use(morgan('dev'));

app.use('/uploads',express.static('uploads'));

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use((req,res,next) =>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    if (req.method === 'options'){
        res.header('Access-Control-Allow-Methods','PUT,POST,GET,PATCH,DELETE');
        return res.status(200).json({});
    }
    next();
});

//routes which handle the requests 
app.use('/campaigns',campaignRoutes);
app.use('/vouchers',voucherRoutes);
app.use('/user',userRoutes);

app.use((req,res,next) =>{
    const error = new Error('Not Found');
    error.status=404;
    next(error);
});

app.use((error,req,res,next) =>{
    res.status(error.status ||500);
    res.json({
        error : {
            message : error.message
        }
    });
});

module.exports = app;