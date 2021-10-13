const route = require('express').Router();

route.use('/auth', require('./auth'));
route.use('/dashboard', require('./dashboard'));

module.exports = route;
