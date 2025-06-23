require('dotenv').config();
const express = require('express');
const dbConnect = require('./dbConnection/dbConnection');
const customerRoute= require('./routes/customerRoute/customerRoute');
const serviceProviderUserRoute = require('./routes/serviceProviderRoute/serviceProviderUserRoute');
const otpRoute = require('./routes/otpRoute/otpRoute')
const app = express();
const port = process.env.PORT;

dbConnect();
app.use(express.json());
app.use('/api/customer',customerRoute);
app.use('/api/serviceProviderUser',serviceProviderUserRoute);
app.use('/api/otp',otpRoute);
app.listen(port,()=>{
    console.log(`Server is live on : ${port}`)
});