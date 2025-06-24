require('dotenv').config();
const express = require('express');
const dbConnect = require('./dbConnection/dbConnection');
const authCustomerRoute = require('./routes/customerRoute/authCustomerRoute');
const authserviceProviderRoute = require('./routes/serviceProviderRoute/authServiceProviderRoute');
const otpRoute = require('./routes/otpRoute/otpRoute');
const serviceRouter = require('./routes/serviceProviderRoute/serviceProviderRoute');

const app = express();
const port = process.env.PORT || 4000;

dbConnect();
app.use(express.json());
app.use('/api/customer', authCustomerRoute);
app.use('/api/serviceProviderUser', authserviceProviderRoute);
app.use('/api/otp', otpRoute);
app.use('/api/service',serviceRouter)
app.listen(port, () => {
    console.log(`Server is live on : ${port}`)
});