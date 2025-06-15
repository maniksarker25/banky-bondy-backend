import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import projectJoinRequestController from './projectJoinRequest.controller';

const router = express.Router();

router.post(
    '/send-join-request/:id',
    auth(USER_ROLE.user),
    projectJoinRequestController.sendJoinRequest
);

export const projectJoinRequestRoutes = router;
