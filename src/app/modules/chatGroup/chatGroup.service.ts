import httpStatus from 'http-status';
import AppError from '../../error/appError';
import Conversation from '../conversation/conversation.model';
import { IChatGroup } from './chatGroup.interface';
import ChatGroup from './chatGroup.model';
import mongoose from 'mongoose';
import NormalUser from '../normalUser/normalUser.model';

const createGroupChat = async (
    profileId: string,
    payload: Partial<IChatGroup>
) => {
    const result = await ChatGroup.create({ ...payload, creator: profileId });
    if (!payload.participants || payload.participants?.length < 2) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'At least 2 member need to create a group'
        );
    }
    await Conversation.create({
        chatGroup: result._id,
        participants: [...payload.participants, profileId],
    });
    return result;
};

const addMember = async (
    profileId: string,
    groupId: string,
    memberId: string
) => {
    const [group, user] = await Promise.all([
        ChatGroup.findById(groupId),
        NormalUser.findById(memberId),
    ]);
    if (!group) {
        throw new AppError(httpStatus.NOT_FOUND, 'Group not found');
    }
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (!group.participants.includes(new mongoose.Types.ObjectId(profileId))) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            'You are not able to add member , because you are not member of that group'
        );
    }
    if (group.participants.includes(new mongoose.Types.ObjectId(memberId))) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Member is already part of that group'
        );
    }

    group.participants.push(new mongoose.Types.ObjectId(memberId));

    await group.save();

    await Conversation.updateOne(
        { chatGroup: groupId },
        { $push: { participants: memberId } }
    );
    return group;
};

const ChatGroupServices = { createGroupChat, addMember };
export default ChatGroupServices;
