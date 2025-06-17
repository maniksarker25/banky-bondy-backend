import httpStatus from "http-status";
import AppError from "../../error/appError";
import { IInstitutionMember } from "./institutionMember.interface";
import institutionMemberModel from "./institutionMember.model";

const updateUserProfile = async (id: string, payload: Partial<IInstitutionMember>) => {
    if (payload.email || payload.username) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot change the email or username");
    }
    const user = await institutionMemberModel.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }
    return await institutionMemberModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};

const InstitutionMemberServices = { updateUserProfile };
export default InstitutionMemberServices;