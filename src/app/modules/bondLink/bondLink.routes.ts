import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import bondLinkController from './bondLink.controller';

const router = express.Router();

router.patch(
    '/my-bond-links',
    auth(USER_ROLE.user),

    bondLinkController.getMyBondLinks
);

export const bondLinkRoutes = router;
