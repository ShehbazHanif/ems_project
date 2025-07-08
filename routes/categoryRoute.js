
const express = require("express");

const catRouter = express.Router();

const getCat = require('../controllers/categoryController')


catRouter.get('/getCat', getCat);

module.exports = catRouter;