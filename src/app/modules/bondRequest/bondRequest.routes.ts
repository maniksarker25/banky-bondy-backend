import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import bondRequestValidation from './bondRequest.validation';
import bondRequestController from './bondRequest.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
    '/create-bond-request',
    auth(USER_ROLE.superAdmin),
    validateRequest(bondRequestValidation.createBondRequestValidationSchema),
    bondRequestController.createBondRequest
);

router.get('/all-bond-requests', bondRequestController.getAllBondRequests);
router.get('/my-bond-requests', bondRequestController.getAllBondRequests);
router.get(
    '/get-single-bond-request/:id',
    bondRequestController.getSingleBondRequest
);

router.patch(
    '/update-bond-request/:id',
    auth(USER_ROLE.superAdmin),
    validateRequest(bondRequestValidation.updateBondRequestValidationSchema),
    bondRequestController.updateBondRequest
);

router.delete(
    '/delete-bond-request/:id',
    auth(USER_ROLE.superAdmin),
    bondRequestController.deleteBondRequest
);

export const bondRequestRoutes = router;
