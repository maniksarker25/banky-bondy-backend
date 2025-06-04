/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utilities/catchasync';
import sendResponse from '../../utilities/sendResponse';
import AudioService from './audio.service';

// Create Audio
const createAudio = catchAsync(async (req, res) => {
    const result = await AudioService.createAudio(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Audio created successfully',
        data: result,
    });
});

// Get All Audios
const getAllAudios = catchAsync(async (req, res) => {
    const result = await AudioService.getAllAudios(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Audios retrieved successfully',
        data: result,
    });
});
// Get All Audios
const getMyAudios = catchAsync(async (req, res) => {
    const result = await AudioService.getMyAudios(
        req.user.profileId,
        req.query
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Audios retrieved successfully',
        data: result,
    });
});

// Get Audio by ID
const getAudioById = catchAsync(async (req, res) => {
    const { audioId } = req.params;
    const result = await AudioService.getAudioById(audioId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Audio retrieved successfully',
        data: result,
    });
});

// Update Audio
const updateAudio = catchAsync(async (req, res) => {
    const { audioId } = req.params;
    const result = await AudioService.updateAudio(audioId, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Audio updated successfully',
        data: result,
    });
});

// Delete Audio
const deleteAudio = catchAsync(async (req, res) => {
    const { audioId } = req.params;
    const result = await AudioService.deleteAudio(audioId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Audio deleted successfully',
        data: result,
    });
});

const AudioController = {
    createAudio,
    getAllAudios,
    getAudioById,
    updateAudio,
    deleteAudio,
    getMyAudios,
};

export default AudioController;
