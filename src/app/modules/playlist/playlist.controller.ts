/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utilities/catchasync';
import sendResponse from '../../utilities/sendResponse';
import PlaylistService from './playlist.service';

// Create Playlist
const createPlaylist = catchAsync(async (req, res) => {
    const result = await PlaylistService.createPlaylist(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Playlist created successfully',
        data: result,
    });
});

// Get All Playlists
const getAllPlaylists = catchAsync(async (req, res) => {
    const result = await PlaylistService.getAllPlaylists(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Playlists retrieved successfully',
        data: result,
    });
});

// Get Playlist by ID
const getPlaylistById = catchAsync(async (req, res) => {
    const { playlistId } = req.params;
    const result = await PlaylistService.getPlaylistById(playlistId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Playlist retrieved successfully',
        data: result,
    });
});

// Update Playlist
const updatePlaylist = catchAsync(async (req, res) => {
    const { playlistId } = req.params;
    const result = await PlaylistService.updatePlaylist(playlistId, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Playlist updated successfully',
        data: result,
    });
});

// Delete Playlist
const deletePlaylist = catchAsync(async (req, res) => {
    const { playlistId } = req.params;
    const result = await PlaylistService.deletePlaylist(playlistId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Playlist deleted successfully',
        data: result,
    });
});

const PlaylistController = {
    createPlaylist,
    getAllPlaylists,
    getPlaylistById,
    updatePlaylist,
    deletePlaylist,
};

export default PlaylistController;
