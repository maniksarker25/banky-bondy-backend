import httpStatus from "http-status";
import AppError from "../../error/appError";
import { IRelative } from "./relative.interface";
import relativeModel from "./relative.model";

const updateUserProfile = async (id: string, payload: Partial<IRelative>) => {
    if (payload.email || payload.username) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot change the email or username");
    }
    const user = await relativeModel.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }
    return await relativeModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};

const RelativeServices = { updateUserProfile };
export default RelativeServices;