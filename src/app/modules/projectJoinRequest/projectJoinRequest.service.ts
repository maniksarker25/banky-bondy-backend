import httpStatus from "http-status";
import AppError from "../../error/appError";
import { IProjectJoinRequest } from "./projectJoinRequest.interface";
import projectJoinRequestModel from "./projectJoinRequest.model";

const updateUserProfile = async (id: string, payload: Partial<IProjectJoinRequest>) => {
    if (payload.email || payload.username) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot change the email or username");
    }
    const user = await projectJoinRequestModel.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }
    return await projectJoinRequestModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};

const ProjectJoinRequestServices = { updateUserProfile };
export default ProjectJoinRequestServices;