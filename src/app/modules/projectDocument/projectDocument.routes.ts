import express, { Request, Response, NextFunction } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import projectDocumentController from './projectDocument.controller';
import { uploadFile } from '../../helper/mutler-s3-uploader';

const router = express.Router();

router.post(
    '/create-project-document',
    auth(USER_ROLE.superAdmin),
    uploadFile(),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        next();
    },
    projectDocumentController.createProjectDocument
);

router.get(
    '/get-all-project-documents',
    projectDocumentController.getAllProjectDocuments
);

router.patch(
    '/update-project-document/:id',
    auth(USER_ROLE.superAdmin),
    uploadFile(),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        next();
    },
    projectDocumentController.updateProjectDocument
);

router.delete(
    '/delete-project-document/:id',
    auth(USER_ROLE.superAdmin),
    projectDocumentController.deleteProjectDocument
);

export const projectDocumentRoutes = router;
