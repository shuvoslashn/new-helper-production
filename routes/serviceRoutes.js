import express from 'express';
import { isAdmin, requireSignIn } from './../middlewares/authMiddleware.js';
import {
    createServiceController,
    deleteServiceController,
    getServiceController,
    getSingleServiceController,
    orderController,
    relatedServiceController,
    searchServiceController,
    serviceCategoryController,
    serviceCountController,
    serviceFiltersController,
    serviceListController,
    servicePhotoController,
    updateServiceController,
} from './../controllers/serviceController.js';
import formidable from 'express-formidable';

const router = express.Router();

//routes
//* Create Service
router.post(
    '/create-service',
    requireSignIn,
    isAdmin,
    formidable(),
    createServiceController
);

//* Get All Services
router.get('/get-service', getServiceController);

//* Get Single Service
router.get('/get-service/:slug', getSingleServiceController);

//* Get Photo
router.get('/service-photo/:pid', servicePhotoController);

//* Update Service
router.put(
    '/update-service/:pid',
    requireSignIn,
    isAdmin,
    formidable(),
    updateServiceController
);

//* Delete service
router.delete('/delete-service/:pid', deleteServiceController);

//* Filter Service
// router.post('/service-filters', serviceFiltersController);

//filter service
router.post('/service-filters', serviceFiltersController);

//service count
router.get('/service-count', serviceCountController);

//service per page
router.get('/service-list/:page', serviceListController);

// search service controller
router.get('/search/:keyword', searchServiceController);

// similar service
router.get('/related-service/:pid/:cid', relatedServiceController);

// category wise service
router.get('/service-category/:slug', serviceCategoryController);

// place order
router.post('/order', requireSignIn, orderController);

export default router;
