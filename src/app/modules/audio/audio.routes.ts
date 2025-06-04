import express from 'express';

import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import AudioController from './audio.controller';
import validateRequest from '../../middlewares/validateRequest';
import AudioValidations from './audio.validation';

const router = express.Router();

// Create Audio
router.post(
    '/create-audio',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(AudioValidations.createAudioValidationSchema),
    AudioController.createAudio
);

// Get All Audios
router.get(
    '/all-audios',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
    AudioController.getAllAudios
);
router.get('/my-audios', auth(USER_ROLE.user), AudioController.getMyAudios);

// Get Audio by ID
router.get(
    '/single-audio/:audioId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
    AudioController.getAudioById
);

// Update Audio
router.patch(
    '/update-audio/:audioId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(AudioValidations.updateAudioValidationSchema),
    AudioController.updateAudio
);

// Delete Audio
router.delete(
    '/delete-audio/:audioId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    AudioController.deleteAudio
);

export const audioRoutes = router;
