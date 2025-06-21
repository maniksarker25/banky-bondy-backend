import httpStatus from "http-status";
import AppError from "../../error/appError";
import { IBondLink } from "./bondLink.interface";
import bondLinkModel from "./bondLink.model";

const updateUserProfile = async (id: string, payload: Partial<IBondLink>) => {
    if (payload.email || payload.username) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot change the email or username");
    }
    const user = await bondLinkModel.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }
    return await bondLinkModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};

const BondLinkServices = { updateUserProfile };
export default BondLinkServices;