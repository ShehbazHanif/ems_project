const express = require('express');
const authServiceProviderRouter = express.Router();

const{handleServiceProviderUserRegister,handleLoginServiceProviderUser}= require('../../controllers/serviceProviderController/authServiceProviderController')
const { authServiceProviderUserCreateSchema, authLoginSchema, validateSchema } = require('../../middlewares/userValidation');

// Apply validation middleware properly
authServiceProviderRouter.post('/register', validateSchema(authServiceProviderUserCreateSchema), handleServiceProviderUserRegister);
authServiceProviderRouter.post('/login', validateSchema(authLoginSchema), handleLoginServiceProviderUser);

module.exports = authServiceProviderRouter;