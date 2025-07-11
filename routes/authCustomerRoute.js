const express = require('express');
const authCustomerRouter = express.Router();
const{authenticateToken}= require('../middlewares/auth')

const { handleCustomerRegister, handleLoginCustomer } = require('../controllers/customerController')
const { authCustomerCreateSchema, authLoginSchema, validateSchema } = require('../zod/userValidation');

// Apply validation middleware properly
authCustomerRouter.post('/register', validateSchema(authCustomerCreateSchema), handleCustomerRegister);
authCustomerRouter.post('/login', validateSchema(authLoginSchema), handleLoginCustomer);
authCustomerRouter.get('/',authenticateToken,(req,res)=>{
    res.status(201).json({
        user:req.user
    })
});


module.exports = authCustomerRouter;