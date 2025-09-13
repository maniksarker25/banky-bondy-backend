import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../error/appError';
import { BondLink } from '../bondLink/bondLink.model';
import { IBondRating } from './bondRating.interface';
import BondRating from './bondRating.model';

const addRating = async (
    profileId: string,
    payload: IBondRating & { userId: string }
) => {
    const bondLink = await BondLink.findOne({
        _id: payload.bondLink,
        participants: new mongoose.Types.ObjectId(profileId),
    });

    if (!bondLink) {
        throw new AppError(httpStatus.NOT_FOUND, 'Bond link not found');
    }

    const existingRating = await BondRating.findOne({
        rated: payload.userId,
        ratedBy: profileId,
        bondLink: payload.bondLink,
    });

    if (!existingRating) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'You already gave rating to that user for this bond'
        );
    }
    const result = await BondRating.create({
        rated: payload.userId,
        ratedBy: profileId,
        bondLink: payload.bondLink,
    });

    return result;
};

const BondRatingServices = { addRating };
export default BondRatingServices;
