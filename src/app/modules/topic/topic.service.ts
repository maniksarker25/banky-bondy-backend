import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { ITopic } from './topic.interface';
import { Topic } from './topic.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { deleteFileFromS3 } from '../../helper/deleteFromS3';

// Create Topic
const createTopic = async (payload: ITopic) => {
    const result = await Topic.create(payload);
    return result;
};

// Get All Topics
const getAllTopics = async (query: Record<string, unknown>) => {
    const topicQuery = new QueryBuilder(Topic.find({ isDeleted: false }), query)
        .search(['name'])
        .fields()
        .filter()
        .paginate()
        .sort();

    const result = await topicQuery.modelQuery;
    const meta = await topicQuery.countTotal();
    return {
        meta,
        result,
    };
};

// Get Topic by ID
const getTopicById = async (topicId: string) => {
    const topic = await Topic.findById(topicId);
    if (!topic) {
        throw new AppError(httpStatus.NOT_FOUND, 'Topic not found');
    }
    return topic;
};

// Update Topic
const updateTopic = async (topicId: string, payload: ITopic) => {
    const topic = await Topic.findById(topicId);
    if (!topic) {
        throw new AppError(httpStatus.NOT_FOUND, 'Topic not found');
    }

    const updatedTopic = await Topic.findByIdAndUpdate(
        topicId,
        { ...payload },
        { new: true }
    );

    if (payload.topic_image && topic.topic_image) {
        deleteFileFromS3(topic.topic_image);
    }

    return updatedTopic;
};

// Delete Topic
const deleteTopic = async (topicId: string) => {
    const topic = await Topic.findById(topicId);
    if (!topic) {
        throw new AppError(httpStatus.NOT_FOUND, 'Topic not found');
    }
    const result = await Topic.findByIdAndUpdate(
        topicId,
        { isDeleted: true },
        { new: true, runValidators: true }
    );
    if (topic.topic_image) {
        deleteFileFromS3(topic.topic_image);
    }
    return result;
};

const TopicServices = {
    createTopic,
    getAllTopics,
    getTopicById,
    updateTopic,
    deleteTopic,
};

export default TopicServices;
