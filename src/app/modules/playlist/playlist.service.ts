import httpStatus from 'http-status';
import AppError from '../../error/appError';
import QueryBuilder from '../../builder/QueryBuilder';
import Playlist from './playlist.model';
import { IPlaylist } from './playlist.interface';
import { deleteFileFromS3 } from '../../helper/deleteFromS3';

// Create Playlist
const createPlaylist = async (userId: string, payload: IPlaylist) => {
    const result = await Playlist.create({ ...payload, user: userId });
    return result;
};

// Get All Playlists with QueryBuilder
const getAllPlaylists = async (query: Record<string, unknown>) => {
    const playlistQuery = new QueryBuilder(
        Playlist.find().populate({
            path: 'user',
            select: 'name profile_image',
        }),
        // .populate('audios'),
        query
    )
        .search(['name', 'description'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await playlistQuery.modelQuery;
    const meta = await playlistQuery.countTotal();

    return {
        meta,
        result,
    };
};
// Get All Playlists with QueryBuilder
const getMyPlaylists = async (
    userId: string,
    query: Record<string, unknown>
) => {
    const playlistQuery = new QueryBuilder(
        Playlist.find({ user: userId }).populate('audios'),
        query
    )
        .search(['name', 'description'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await playlistQuery.modelQuery;
    const meta = await playlistQuery.countTotal();

    return {
        meta,
        result,
    };
};

// Get Playlist by ID
const getPlaylistById = async (playlistId: string) => {
    const playlist = await Playlist.findById(playlistId)
        .populate({ path: 'user', select: 'name profile_image' })
        .populate('audios');
    if (!playlist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Playlist not found');
    }
    return playlist;
};

// Update Playlist
const updatePlaylist = async (
    userId: string,
    playlistId: string,
    payload: Partial<IPlaylist>
) => {
    const playlist = await Playlist.findOne({ user: userId, _id: playlistId });
    if (!playlist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Playlist not found');
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        payload,
        { new: true }
    );

    if (payload.cover_image && playlist.cover_image) {
        deleteFileFromS3(playlist.cover_image);
    }

    return updatedPlaylist;
};

// Delete Playlist
const deletePlaylist = async (userId: string, playlistId: string) => {
    const playlist = await Playlist.findOne({ user: userId, _id: playlistId });
    if (!playlist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Playlist not found');
    }
    const result = await Playlist.findByIdAndDelete(playlistId);
    if (playlist.cover_image) {
        deleteFileFromS3(playlist.cover_image);
    }
    return result;
};

const PlaylistService = {
    createPlaylist,
    getAllPlaylists,
    getPlaylistById,
    updatePlaylist,
    deletePlaylist,
    getMyPlaylists,
};

export default PlaylistService;
