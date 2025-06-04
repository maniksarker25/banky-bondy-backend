import express, { Request, Response, NextFunction } from 'express';

import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import SkillController from './skill.controller';
import { uploadFile } from '../../helper/mutler-s3-uploader';

const router = express.Router();

// Route to create a new skill
router.post(
    '/create-skill',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    uploadFile(),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        next();
    },
    SkillController.createSkill
);

// Route to get all skills
router.get(
    '/all-skills',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
    SkillController.getAllSkills
);

// Route to get a skill by ID
router.get(
    '/single-skill/:skillId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
    SkillController.getSkillById
);

// Route to update a skill by ID
router.patch(
    '/update-skill/:skillId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    uploadFile(),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        next();
    },
    SkillController.updateSkill
);

// Route to delete a skill by ID
router.delete(
    '/delete-skill/:skillId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    SkillController.deleteSkill
);

export const skillRoutes = router;
