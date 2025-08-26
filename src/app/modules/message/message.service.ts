/* eslint-disable @typescript-eslint/no-explicit-any */
import Conversation from '../conversation/conversation.model';
import Message from './message.model';

import AppError from '../../error/appError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';

const getMessages = async (
    profileId: string,
    conversationId: string,
    query: Record<string, unknown>
) => {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        throw new AppError(httpStatus.NOT_FOUND, 'Conversation not found');
    }
    if (
        !conversation?.participants.includes(
            new mongoose.Types.ObjectId(profileId)
        )
    ) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            'You are not a participant of this conversation'
        );
    }

    console.log('converation', conversation);

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchTerm = (query?.searchTerm as string) || '';

    const messages = await Message.aggregate([
        {
            $match: {
                conversationId: new mongoose.Types.ObjectId(conversationId),
                text: { $regex: searchTerm, $options: 'i' },
            },
        },
        {
            $lookup: {
                from: 'normalusers',
                localField: 'msgByUserId',
                foreignField: '_id',
                as: 'userDetails',
            },
        },
        { $unwind: '$userDetails' },
        {
            $addFields: {
                isMyMessage: {
                    $eq: [
                        '$msgByUserId',
                        new mongoose.Types.ObjectId(profileId),
                    ],
                },
            },
        },
        {
            $project: {
                text: 1,
                imageUrl: 1,
                videoUrl: 1,
                seen: 1,
                msgByUserId: 1,
                conversationId: 1,
                createdAt: 1,
                updatedAt: 1,
                'userDetails.name': 1,
                'userDetails.profile_image': 1,
                isMyMessage: 1,
            },
        },
        { $sort: { createdAt: -1 } },
        {
            $facet: {
                result: [{ $skip: skip }, { $limit: limit }],
                totalCount: [{ $count: 'total' }],
            },
        },
    ]);

    const result = messages[0]?.result || [];
    const total = messages[0]?.totalCount[0]?.total || 0;
    const totalPage = Math.ceil(total / limit);

    const response = {
        meta: {
            page,
            limit,
            total,
            totalPage,
        },
        result,
    };

    return response;
};

const MessageService = {
    getMessages,
};

export default MessageService;
