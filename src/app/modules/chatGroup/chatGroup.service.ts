import httpStatus from "http-status";
import AppError from "../../error/appError";
import { IChatGroup } from "./chatGroup.interface";
import chatGroupModel from "./chatGroup.model";

const updateUserProfile = async (id: string, payload: Partial<IChatGroup>) => {
    if (payload.email || payload.username) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot change the email or username");
    }
    const user = await chatGroupModel.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }
    return await chatGroupModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};

const ChatGroupServices = { updateUserProfile };
export default ChatGroupServices;