import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import institutionMemberController from './institutionMember.controller';

const router = express.Router();

router.patch(
    '/all-member',
    auth(USER_ROLE.user, USER_ROLE.superAdmin, USER_ROLE.admin),
    institutionMemberController.getAllInstitutionMember
);

export const institutionMemberRoutes = router;
