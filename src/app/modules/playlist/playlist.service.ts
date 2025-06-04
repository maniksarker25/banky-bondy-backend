import httpStatus from 'http-status';
import AppError from '../../error/appError';
import QueryBuilder from '../../builder/QueryBuilder';
import Playlist from './playlist.model';
import { IPlaylist } from './playlist.interface';

// Create Playlist
const createPlaylist = async (payload: IPlaylist) => {
    const result = await Playlist.create(payload);
    return result;
};

// Get All Playlists with QueryBuilder
const getAllPlaylists = async (query: Record<string, unknown>) => {
    const playlistQuery = new QueryBuilder(
        Playlist.find().populate('user').populate('audios'),
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
        .populate('user')
        .populate('audios');
    if (!playlist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Playlist not found');
    }
    return playlist;
};

// Update Playlist
const updatePlaylist = async (
    playlistId: string,
    payload: Partial<IPlaylist>
) => {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Playlist not found');
    }
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        payload,
        { new: true }
    );
    return updatedPlaylist;
};

// Delete Playlist
const deletePlaylist = async (playlistId: string) => {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new AppError(httpStatus.NOT_FOUND, 'Playlist not found');
    }
    const result = await Playlist.findByIdAndDelete(playlistId);
    return result;
};

const PlaylistService = {
    createPlaylist,
    getAllPlaylists,
    getPlaylistById,
    updatePlaylist,
    deletePlaylist,
};

export default PlaylistService;
