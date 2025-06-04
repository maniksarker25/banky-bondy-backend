import httpStatus from "http-status";
import AppError from "../../error/appError";
import { IAudio } from "./audio.interface";
import audioModel from "./audio.model";

const updateUserProfile = async (id: string, payload: Partial<IAudio>) => {
    if (payload.email || payload.username) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot change the email or username");
    }
    const user = await audioModel.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }
    return await audioModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};

const AudioServices = { updateUserProfile };
export default AudioServices;