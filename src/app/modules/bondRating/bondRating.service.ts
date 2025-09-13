import httpStatus from "http-status";
import AppError from "../../error/appError";
import { IBondRating } from "./bondRating.interface";
import bondRatingModel from "./bondRating.model";

const updateUserProfile = async (id: string, payload: Partial<IBondRating>) => {
    if (payload.email || payload.username) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot change the email or username");
    }
    const user = await bondRatingModel.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }
    return await bondRatingModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};

const BondRatingServices = { updateUserProfile };
export default BondRatingServices;