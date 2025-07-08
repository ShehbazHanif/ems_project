const express = require('express');
const authCustomerRouter = express.Router();

const { handleCustomerRegister, handleLoginCustomer } = require('../controllers/customerController')
const { authCustomerCreateSchema, authLoginSchema, validateSchema } = require('../zod/userValidation');

// Apply validation middleware properly
authCustomerRouter.post('/register', validateSchema(authCustomerCreateSchema), handleCustomerRegister);
authCustomerRouter.post('/login', validateSchema(authLoginSchema), handleLoginCustomer);

module.exports = authCustomerRouter;