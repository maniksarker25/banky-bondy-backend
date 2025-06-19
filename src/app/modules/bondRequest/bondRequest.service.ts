import httpStatus from "http-status";
import AppError from "../../error/appError";
import { IBondRequest } from "./bondRequest.interface";
import bondRequestModel from "./bondRequest.model";

const updateUserProfile = async (id: string, payload: Partial<IBondRequest>) => {
    if (payload.email || payload.username) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot change the email or username");
    }
    const user = await bondRequestModel.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }
    return await bondRequestModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};

const BondRequestServices = { updateUserProfile };
export default BondRequestServices;