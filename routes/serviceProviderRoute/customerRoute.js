const express = require('express');
const customerRouter = express.Router();

const{handleCustomerRegister,handleLoginCustomer}= require('../../controllers/customerController/customerController')
const { authCreateSchema, authLoginSchema, validateSchema } = require('../../middlewares/userValidation');

// Apply validation middleware properly
customerRouter.post('/customerRegister', validateSchema(authCreateSchema), handleCustomerRegister);
customerRouter.post('/customerLogin', validateSchema(authLoginSchema), handleLoginCustomer);

module.exports = customerRouter;