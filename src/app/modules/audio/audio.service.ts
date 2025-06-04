import httpStatus from 'http-status';
import AppError from '../../error/appError';
import QueryBuilder from '../../builder/QueryBuilder';
import Audio from './audio.model';
import { IAudio } from './audio.interface';

// Create Audio
const createAudio = async (userId: string, payload: IAudio) => {
    const result = await Audio.create({ ...payload, user: userId });
    return result;
};

// Get All Audios with QueryBuilder
const getAllAudios = async (query: Record<string, unknown>) => {
    const audioQuery = new QueryBuilder(
        Audio.find().populate('audioTopic'),
        query
    )
        .search(['title', 'description'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await audioQuery.modelQuery;
    const meta = await audioQuery.countTotal();

    return {
        meta,
        result,
    };
};

// Get All audios with QueryBuilder
const getMyAudios = async (userId: string, query: Record<string, unknown>) => {
    const audioQuery = new QueryBuilder(
        Audio.find({}).populate('audioTopic'),
        query
    )
        .search(['title', 'description'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await audioQuery.modelQuery;
    const meta = await audioQuery.countTotal();

    return {
        meta,
        result,
    };
};

// Get Audio by ID
const getAudioById = async (audioId: string) => {
    const audio = await Audio.findById(audioId).populate('audioTopic');
    if (!audio) {
        throw new AppError(httpStatus.NOT_FOUND, 'Audio not found');
    }
    return audio;
};

// Update Audio
const updateAudio = async (
    userId: string,
    audioId: string,
    payload: Partial<IAudio>
) => {
    const audio = await Audio.findOne({ user: userId, _id: audioId });
    if (!audio) {
        throw new AppError(httpStatus.NOT_FOUND, 'Audio not found');
    }
    const updatedAudio = await Audio.findByIdAndUpdate(audioId, payload, {
        new: true,
    });
    return updatedAudio;
};

// Delete Audio
const deleteAudio = async (audioId: string) => {
    const audio = await Audio.findById(audioId);
    if (!audio) {
        throw new AppError(httpStatus.NOT_FOUND, 'Audio not found');
    }
    const result = await Audio.findByIdAndDelete(audioId);
    return result;
};

const AudioService = {
    createAudio,
    getAllAudios,
    getAudioById,
    updateAudio,
    deleteAudio,
    getMyAudios,
};

export default AudioService;
