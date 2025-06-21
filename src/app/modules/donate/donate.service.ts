import httpStatus from "http-status";
import AppError from "../../error/appError";
import { IDonate } from "./donate.interface";
import donateModel from "./donate.model";

const updateUserProfile = async (id: string, payload: Partial<IDonate>) => {
    if (payload.email || payload.username) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot change the email or username");
    }
    const user = await donateModel.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }
    return await donateModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};

const DonateServices = { updateUserProfile };
export default DonateServices;