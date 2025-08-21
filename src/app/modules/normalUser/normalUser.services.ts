/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { INormalUser } from './normalUser.interface';
import NormalUser from './normalUser.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLE } from '../user/user.constant';
import { ENUM_FRIEND_REQUEST_STATUS } from '../friendRequest/friendRequest.enum';
import mongoose from 'mongoose';

const updateUserProfile = async (id: string, payload: Partial<INormalUser>) => {
    if (payload.email) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'You can not change the email'
        );
    }
    const user = await NormalUser.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'Profile not found');
    }
    const result = await NormalUser.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};

const getAllUser = async (
    userData: JwtPayload,
    query: Record<string, unknown>
) => {
    console.log(userData);
    if (userData.role == USER_ROLE.admin) {
        const userQuery = new QueryBuilder(NormalUser.find(), query)
            .search(['name'])
            .fields()
            .filter()
            .paginate()
            .sort();

        const result = await userQuery.modelQuery;
        const meta = await userQuery.countTotal();
        return {
            meta,
            result,
        };
    } else {
        const page = Number(query?.page) || 1;
        const limit = Number(query?.limit) || 10;
        const skip = (page - 1) * limit;
        const searchTerm = query?.searchTerm || '';

        const searchMatchStage: any = searchTerm
            ? {
                  $or: [
                      { name: { $regex: searchTerm, $options: 'i' } },
                      { email: { $regex: searchTerm, $options: 'i' } },
                  ],
              }
            : {};

        const aggResult = await NormalUser.aggregate([
            {
                $match: {
                    ...searchMatchStage,
                    _id: {
                        $ne: new mongoose.Types.ObjectId(userData.profileId),
                    },
                },
            },
            {
                $lookup: {
                    from: 'friendrequests',
                    let: { otherUserId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        {
                                            $and: [
                                                {
                                                    $eq: [
                                                        '$sender',
                                                        '$$otherUserId',
                                                    ],
                                                },
                                                {
                                                    $eq: [
                                                        '$receiver',
                                                        new mongoose.Types.ObjectId(
                                                            userData.profileId
                                                        ),
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            $and: [
                                                {
                                                    $eq: [
                                                        '$receiver',
                                                        '$$otherUserId',
                                                    ],
                                                },
                                                {
                                                    $eq: [
                                                        '$sender',
                                                        new mongoose.Types.ObjectId(
                                                            userData.profileId
                                                        ),
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'friendRequests',
                },
            },
            {
                $addFields: {
                    friendRequestStatus: {
                        $switch: {
                            branches: [
                                {
                                    case: {
                                        $anyElementTrue: {
                                            $map: {
                                                input: '$friendRequests',
                                                as: 'req',
                                                in: {
                                                    $eq: [
                                                        '$$req.status',
                                                        ENUM_FRIEND_REQUEST_STATUS.Accepted,
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                    then: 'friend',
                                },
                                {
                                    case: {
                                        $anyElementTrue: {
                                            $map: {
                                                input: '$friendRequests',
                                                as: 'req',
                                                in: {
                                                    $and: [
                                                        {
                                                            $eq: [
                                                                '$$req.sender',
                                                                new mongoose.Types.ObjectId(
                                                                    userData.profileId
                                                                ),
                                                            ],
                                                        },
                                                        {
                                                            $eq: [
                                                                '$$req.status',
                                                                ENUM_FRIEND_REQUEST_STATUS.Pending,
                                                            ],
                                                        },
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                    // then: 'following_pending',
                                    then: 'following',
                                },
                                {
                                    case: {
                                        $anyElementTrue: {
                                            $map: {
                                                input: '$friendRequests',
                                                as: 'req',
                                                in: {
                                                    $and: [
                                                        {
                                                            $eq: [
                                                                '$$req.receiver',
                                                                new mongoose.Types.ObjectId(
                                                                    userData.profileId
                                                                ),
                                                            ],
                                                        },
                                                        {
                                                            $eq: [
                                                                '$$req.status',
                                                                ENUM_FRIEND_REQUEST_STATUS.Pending,
                                                            ],
                                                        },
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                    // then: 'follower_pending',
                                    then: 'follower',
                                },
                                {
                                    case: {
                                        $anyElementTrue: {
                                            $map: {
                                                input: '$friendRequests',
                                                as: 'req',
                                                in: {
                                                    $and: [
                                                        {
                                                            $eq: [
                                                                '$$req.sender',
                                                                new mongoose.Types.ObjectId(
                                                                    userData.profileId
                                                                ),
                                                            ],
                                                        },
                                                        {
                                                            $eq: [
                                                                '$$req.status',
                                                                ENUM_FRIEND_REQUEST_STATUS.Rejected,
                                                            ],
                                                        },
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                    // then: 'following_rejected',
                                    then: 'following',
                                },
                                {
                                    case: {
                                        $anyElementTrue: {
                                            $map: {
                                                input: '$friendRequests',
                                                as: 'req',
                                                in: {
                                                    $and: [
                                                        {
                                                            $eq: [
                                                                '$$req.receiver',
                                                                new mongoose.Types.ObjectId(
                                                                    userData.profileId
                                                                ),
                                                            ],
                                                        },
                                                        {
                                                            $eq: [
                                                                '$$req.status',
                                                                ENUM_FRIEND_REQUEST_STATUS.Rejected,
                                                            ],
                                                        },
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                    // then: 'follower_rejected',
                                    then: 'follower',
                                },
                            ],
                            default: 'none',
                        },
                    },
                },
            },
            {
                $project: { friendRequests: 0 }, // remove friendRequests array
            },
            {
                $facet: {
                    meta: [
                        { $count: 'total' },
                        {
                            $addFields: {
                                page,
                                limit,
                                totalPage: {
                                    $ceil: { $divide: ['$total', limit] },
                                },
                            },
                        },
                    ],
                    data: [{ $skip: skip }, { $limit: limit }],
                },
            },
            {
                $project: {
                    meta: { $arrayElemAt: ['$meta', 0] },
                    data: 1,
                },
            },
        ]);

        return {
            success: true,
            message: 'Users retrieved successfully',
            data: {
                meta: aggResult[0]?.meta || {
                    page,
                    limit,
                    total: 0,
                    totalPage: 0,
                },
                result: aggResult[0]?.data || [],
            },
        };
    }
};

// get single user
const getSingleUser = async (id: string) => {
    const result = await NormalUser.findById(id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    return result;
};

const NormalUserServices = {
    updateUserProfile,
    getAllUser,
    getSingleUser,
};

export default NormalUserServices;
