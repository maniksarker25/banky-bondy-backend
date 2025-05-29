import httpStatus from "http-status";
import AppError from "../../error/appError";
import { IAudio-topic } from "./audio-topic.interface";
import audio-topicModel from "./audio-topic.model";

const updateUserProfile = async (id: string, payload: Partial<IAudio-topic>) => {
    if (payload.email || payload.username) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot change the email or username");
    }
    const user = await audio-topicModel.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }
    return await audio-topicModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};

const Audio-topicServices = { updateUserProfile };
export default Audio-topicServices;