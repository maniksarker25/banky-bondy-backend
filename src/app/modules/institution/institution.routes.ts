import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import InstitutionController from './institution.controller';
import validateRequest from '../../middlewares/validateRequest';
import InstitutionValidations from './institution.validation';

const router = express.Router();

router.post(
    '/create',
    auth(USER_ROLE.user),
    validateRequest(InstitutionValidations.createInstitutionValidationSchema),
    InstitutionController.createInstitution
);

router.get(
    '/',
    auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
    InstitutionController.getAllInstitutions
);

router.get(
    '/:institutionId',
    auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
    InstitutionController.getInstitutionById
);

router.patch(
    '/update/:institutionId',
    auth(USER_ROLE.user),
    validateRequest(InstitutionValidations.updateInstitutionValidationSchema),
    InstitutionController.updateInstitution
);

router.delete(
    '/delete/:institutionId',
    auth(USER_ROLE.user),
    InstitutionController.deleteInstitution
);

export const institutionRoutes = router;
