const express = require('express');
const customerRouter = express.Router();

const{handleCustomerRegister,handleLoginCustomer}= require('../../controllers/customerController/customerController')
const { authCustomerCreateSchema, authLoginSchema, validateSchema } = require('../../middlewares/userValidation');

// Apply validation middleware properly
customerRouter.post('/Register', validateSchema(authCustomerCreateSchema), handleCustomerRegister);
customerRouter.post('/Login', validateSchema(authLoginSchema), handleLoginCustomer);

module.exports = customerRouter;