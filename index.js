require('dotenv').config();
const express = require('express');
const dbConnect = require('./dbConnection/dbConnection');
const authCustomerRoute = require('./routes/authCustomerRoute');
const authserviceProviderRoute = require('./routes/authServiceProviderRoute');
const otpRoute = require('./routes/otpRoute');
const serviceRouter = require('./routes/serviceProviderRoute');
const jobRouter = require('./routes/jobRoute');
const catRouter = require('./routes/categoryRoute');

const app = express();
const port = process.env.PORT || 4000;

dbConnect();
app.use(express.json());
app.use('/api/customer', authCustomerRoute);
app.use('/api/serviceProviderUser', authserviceProviderRoute);
app.use('/api/otp', otpRoute);
app.use('/api/service', serviceRouter);
app.use('/api/job',jobRouter)
app.use('/api/category',catRouter)
app.listen(port, () => {
    console.log(`Server is live on..........:${port}`)
});


// const createCats = async () => {
//     const categories = [
       
//     ];
//     await categoryModel.insertMany(categories);
// }


//createCats().catch((err) => console.log(err))