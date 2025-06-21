import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import bondLinkController from './bondLink.controller';
import validateRequest from '../../middlewares/validateRequest';
import BondLinkValidations from './bondLink.validation';

const router = express.Router();

router.post(
    '/create',
    auth(USER_ROLE.user),
    validateRequest(BondLinkValidations.createBondLinkSchema),

    bondLinkController.createBondLink
);
router.get(
    '/my-bond-links',
    auth(USER_ROLE.user),
    bondLinkController.getMyBondLinks
);

export const bondLinkRoutes = router;
