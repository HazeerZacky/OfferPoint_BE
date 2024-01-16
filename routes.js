const appRoutes = require('express').Router();
const BrandRoutes = require('./Controllers/BrandController');
const CategoryRoutes = require('./Controllers/CategoryController');
const FileRoutes = require('./Controllers/FileController');
const OfferRoutes = require('./Controllers/OfferController');
const UserRoutes = require('./Controllers/UserController');

appRoutes.use('/Brand', BrandRoutes);
appRoutes.use('/Category', CategoryRoutes);
appRoutes.use('/File', FileRoutes);
appRoutes.use('/Offer', OfferRoutes);
appRoutes.use('/User', UserRoutes);

module.exports = appRoutes;
