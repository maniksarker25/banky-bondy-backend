import httpStatus from 'http-status';
import AppError from '../../error/appError';
import FriendRequest from './friendRequest.model';
import { ENUM_FRIEND_REQUEST_STATUS } from './friendRequest.enum';

const sendFriendRequest = async (sender: string, receiver: string) => {
    if (sender === receiver)
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Cannot send request to self'
        );

    const existing = await FriendRequest.findOne({ sender, receiver });
    if (existing)
        throw new AppError(httpStatus.BAD_REQUEST, 'Request already exists');

    return await FriendRequest.create({ sender, receiver });
};

const updateFriendRequestStatus = async (
    requestId: string,
    status: 'accepted' | 'rejected'
) => {
    const request = await FriendRequest.findById(requestId);
    if (!request || request.status !== ENUM_FRIEND_REQUEST_STATUS.Pending) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Invalid or already handled request'
        );
    }

    request.status = status;
    return await request.save();
};

const getMyFriends = async (userId: string) => {
    return await FriendRequest.find({
        $or: [
            { sender: userId, status: 'accepted' },
            { receiver: userId, status: 'accepted' },
        ],
    }).populate('sender receiver');
};

const getMyFollowers = async (userId: string) => {
    return await FriendRequest.find({
        receiver: userId,
    }).populate('sender');
};

const getMyFollowing = async (userId: string) => {
    return await FriendRequest.find({
        sender: userId,
        status: ENUM_FRIEND_REQUEST_STATUS.Pending,
    }).populate('receiver');
};

const cancelSentRequest = async (sender: string, receiver: string) => {
    return await FriendRequest.findOneAndDelete({
        sender,
        receiver,
        status: 'pending',
    });
};

const unfriend = async (userId: string, friendId: string) => {
    return await FriendRequest.findOneAndDelete({
        $or: [
            {
                sender: userId,
                receiver: friendId,
                status: ENUM_FRIEND_REQUEST_STATUS.Accepted,
            },
            {
                sender: friendId,
                receiver: userId,
                status: ENUM_FRIEND_REQUEST_STATUS.Accepted,
            },
        ],
    });
};

const friendRequestService = {
    sendFriendRequest,
    updateFriendRequestStatus,
    getMyFriends,
    getMyFollowers,
    getMyFollowing,
    cancelSentRequest,
    unfriend,
};

export default friendRequestService;
