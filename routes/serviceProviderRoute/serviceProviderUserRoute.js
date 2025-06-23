const express = require('express');
const serviceProviderUserRouter = express.Router();

const{handleServiceProviderUserRegister,handleLoginServiceProviderUser}= require('../../controllers/serviceProviderController/serviceProviderController')
const { authServiceProviderUserCreateSchema, authLoginSchema, validateSchema } = require('../../middlewares/userValidation');

// Apply validation middleware properly
serviceProviderUserRouter.post('/Register', validateSchema(authServiceProviderUserCreateSchema), handleServiceProviderUserRegister);
serviceProviderUserRouter.post('/Login', validateSchema(authLoginSchema), handleLoginServiceProviderUser);

module.exports = serviceProviderUserRouter;