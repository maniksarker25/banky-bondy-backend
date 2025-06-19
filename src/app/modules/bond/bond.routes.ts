import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import bondValidation from './bond.validation';
import bondController from './bond.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
    '/create',
    auth(USER_ROLE.user),
    validateRequest(bondValidation.createBondValidationSchema),
    bondController.createBond
);

router.get('/all-bonds', bondController.getAllBonds);
router.get('/get-single-bond/:id', bondController.getSingleBond);

router.patch(
    '/update-bond/:id',
    auth(USER_ROLE.superAdmin),
    validateRequest(bondValidation.updateBondValidationSchema),
    bondController.updateBond
);

router.delete(
    '/delete-bond/:id',
    auth(USER_ROLE.superAdmin),
    bondController.deleteBond
);

export const bondRoutes = router;
