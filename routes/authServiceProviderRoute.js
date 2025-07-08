const express = require('express');
const authServiceProviderRouter = express.Router();

const { handleServiceProviderUserRegister, handleLoginServiceProviderUser } = require('../controllers/authServiceProviderController')
const { authServiceProviderUserCreateSchema, authLoginSchema, validateSchema } = require('../zod/userValidation');

// Apply validation middleware properly
authServiceProviderRouter.post('/register', handleServiceProviderUserRegister);
authServiceProviderRouter.post('/login', validateSchema(authLoginSchema), handleLoginServiceProviderUser);

module.exports = authServiceProviderRouter;