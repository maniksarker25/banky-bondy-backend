import httpStatus from "http-status";
import AppError from "../../error/appError";
import { IProjectDocument } from "./projectDocument.interface";
import projectDocumentModel from "./projectDocument.model";

const updateUserProfile = async (id: string, payload: Partial<IProjectDocument>) => {
    if (payload.email || payload.username) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot change the email or username");
    }
    const user = await projectDocumentModel.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }
    return await projectDocumentModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};

const ProjectDocumentServices = { updateUserProfile };
export default ProjectDocumentServices;