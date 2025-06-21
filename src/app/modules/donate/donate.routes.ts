import express from 'express';
import { createDonate, getAllDonates } from './donate.controller';
import validateRequest from '../../middlewares/validateRequest';
import { DonateValidations } from './donate.validation';

const router = express.Router();

router.post(
    '/donate',
    validateRequest(DonateValidations.createDonateSchema),
    createDonate
);
router.get('/get-all-donner', getAllDonates);

export const DonateRoutes = router;
