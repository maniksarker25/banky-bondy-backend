import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import projectMemberController from './projectMember.controller';
import { uploadFile } from '../../helper/fileUploader';

const router = express.Router();

router.get(
    '/get-project-members/:id',
    auth(USER_ROLE.user),
    uploadFile(),
    (req, res, next) => {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        next();
    },
    projectMemberController.getAllProjectMember
);

export const projectMemberRoutes = router;
