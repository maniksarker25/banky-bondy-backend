import httpStatus from "http-status";
import AppError from "../../error/appError";
import { IPlaylist } from "./playlist.interface";
import playlistModel from "./playlist.model";

const updateUserProfile = async (id: string, payload: Partial<IPlaylist>) => {
    if (payload.email || payload.username) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot change the email or username");
    }
    const user = await playlistModel.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Profile not found");
    }
    return await playlistModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};

const PlaylistServices = { updateUserProfile };
export default PlaylistServices;