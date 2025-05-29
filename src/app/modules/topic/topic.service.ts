import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { ITopic } from './topic.interface';
import Category from '../category/category.model';
import { Topic } from './topic.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { deleteFileFromS3 } from '../../helper/deleteFromS3';

// Create Topic
const createTopic = async (payload: ITopic) => {
    const category = await Category.findById(payload.category);
    if (!category) {
        if (payload.topic_icon) {
            deleteFileFromS3(payload.topic_icon);
        }
        throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
    }

    const result = await Topic.create(payload);
    return result;
};

// Get All Topics
const getAllTopics = async (query: Record<string, unknown>) => {
    const topicQuery = new QueryBuilder(
        Topic.find({ isDeleted: false }).populate('category'),
        query
    )
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
    const topic = await Topic.findById(topicId).populate('category');
    if (!topic) {
        throw new AppError(httpStatus.NOT_FOUND, 'Topic not found');
    }
    return topic;
};

// Update Topic
const updateTopic = async (topicId: string, payload: ITopic) => {
    if (payload.category) {
        const category = await Category.findById(payload.category);
        if (!category) {
            throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
        }
    }
    const topic = await Topic.findById(topicId);
    if (!topic) {
        throw new AppError(httpStatus.NOT_FOUND, 'Topic not found');
    }

    const updatedTopic = await Topic.findByIdAndUpdate(
        topicId,
        { ...payload },
        { new: true }
    );

    if (payload.topic_icon && topic.topic_icon) {
        deleteFileFromS3(topic.topic_icon);
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
