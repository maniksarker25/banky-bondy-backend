/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server as IOServer, Socket } from 'socket.io';
import Conversation from '../modules/conversation/conversation.model';
import Message from '../modules/message/message.model';
import { getSingleConversation } from '../helper/getSingleConversation';
import { emitError } from './helper';
import { Types } from 'mongoose';
import Project from '../modules/project/project.model';
import { BondLink } from '../modules/bondLink/bondLink.model';
import ChatGroup from '../modules/chatGroup/chatGroup.model';

const handleChat = async (
    io: IOServer,
    socket: Socket,
    currentUserId: string
): Promise<void> => {
    // new message -----------------------------------
    socket.on('new-message', async (data) => {
        if (!data.receiver && !data.projectId) {
            emitError(socket, {
                code: 400,
                message: 'Receiver or project id required',
                type: 'general',
                details:
                    'You must provide either a receiverId (for one-to-one) or a projectId (for group chat)',
            });
            return;
        }

        if (data?.receiver) {
            let conversation = await Conversation.findOne({
                $and: [
                    { participants: currentUserId },
                    { participants: data.receiver },
                ],
            });
            if (!conversation) {
                conversation = await Conversation.create({
                    participants: [data.sender, data.receiver],
                });
            }
            const messageData = {
                text: data.text,
                imageUrl: data.imageUrl || [],
                videoUrl: data.videoUrl || [],
                msgByUserId: data?.sender,
                conversationId: conversation?._id,
            };
            const saveMessage = await Message.create(messageData);
            await Conversation.updateOne(
                { _id: conversation?._id },
                {
                    lastMessage: saveMessage._id,
                }
            );
            // send to the frontend only new message data ---------------
            io.to(data?.sender.toString()).emit(
                `message-${data?.receiver}`,
                saveMessage
            );
            io.to(data?.receiver.toString()).emit(
                `message-${data?.sender}`,
                saveMessage
            );

            //send conversation
            const conversationSender = await getSingleConversation(
                conversation._id,
                currentUserId
            );
            const conversationReceiver = await getSingleConversation(
                conversation._id,
                data?.receiver
            );
            io.to(currentUserId.toString()).emit(
                'conversation',
                conversationSender
            );
            io.to(data?.receiver).emit('conversation', conversationReceiver);
        } else if (data?.projectId) {
            console.log('else');
            const projectId = data?.projectId;
            if (projectId && Types.ObjectId.isValid(projectId)) {
                console.log('Valid ObjectId');
            } else {
                console.error('Invalid ObjectId');
                emitError(socket, {
                    code: 400,
                    message: 'Invalid ObjectId',
                    type: 'general',
                    details: 'You must provide valid object id',
                });
                return;
            }
            const chat = await Conversation.findOne({
                projectId: data.projectId,
                type: data?.type,
            });
            if (!chat) {
                emitError(socket, {
                    code: 404,
                    message: 'Chat not found',
                    type: 'general',
                    details: 'The group chat was not found',
                });
                return;
            }
            const project = await Project.findById(data?.projectId);
            if (!project) {
                emitError(socket, {
                    code: 400,
                    message: 'Project not found',
                    type: 'general',
                    details: 'Project not found',
                });
            }

            console.log('curretn user id', currentUserId);
            // create new message
            const messageData = {
                text: data.text,
                imageUrl: data.imageUrl || [],
                videoUrl: data.videoUrl || [],
                msgByUserId: data?.sender,
                conversationId: chat?._id,
            };
            const saveMessage = await Message.create(messageData);
            const populatedMessage = await saveMessage.populate({
                path: 'msgByUserId',
                select: 'name profile_image',
            });
            await Conversation.updateOne(
                { _id: chat?._id },
                {
                    lastMessage: populatedMessage._id,
                }
            );

            chat.participants.forEach(async (participantId: Types.ObjectId) => {
                io.to(participantId.toString()).emit(
                    `message-${projectId}-${chat.type}`,
                    populatedMessage
                );
                const singleConversation = await getSingleConversation(
                    chat._id,
                    participantId.toString()
                );
                io.to(participantId.toString()).emit(
                    'conversation',
                    singleConversation
                );
                // }
            });
        } else if (data?.groupId) {
            const groupId = data?.groupId;
            if (groupId && Types.ObjectId.isValid(groupId)) {
                console.log('Valid ObjectId');
            } else {
                console.error('Invalid ObjectId');
                emitError(socket, {
                    code: 400,
                    message: 'Invalid ObjectId',
                    type: 'general',
                    details: 'You must provide valid object id',
                });
                return;
            }
            const chat = await Conversation.findOne({
                chatGroup: groupId,
                type: data?.type,
            });
            if (!chat) {
                emitError(socket, {
                    code: 404,
                    message: 'Chat not found',
                    type: 'general',
                    details: 'The group chat was not found',
                });
                return;
            }
            const chatGroup = await ChatGroup.findById(data?.groupId);
            if (!chatGroup) {
                emitError(socket, {
                    code: 400,
                    message: 'Chat group not found',
                    type: 'general',
                    details: 'Chat group not found',
                });
            }

            console.log('curretn user id', currentUserId);
            // create new message
            const messageData = {
                text: data.text,
                imageUrl: data.imageUrl || [],
                videoUrl: data.videoUrl || [],
                msgByUserId: data?.sender,
                conversationId: chat?._id,
            };
            const saveMessage = await Message.create(messageData);
            const populatedMessage = await saveMessage.populate({
                path: 'msgByUserId',
                select: 'name profile_image',
            });
            await Conversation.updateOne(
                { _id: chat?._id },
                {
                    lastMessage: populatedMessage._id,
                }
            );

            chat.participants.forEach(async (participantId: Types.ObjectId) => {
                io.to(participantId.toString()).emit(
                    `message-${groupId}-${chat.type}`,
                    populatedMessage
                );
                const singleConversation = await getSingleConversation(
                    chat._id,
                    participantId.toString()
                );
                io.to(participantId.toString()).emit(
                    'conversation',
                    singleConversation
                );
                // }
            });
        } else if (data?.bondLinkId) {
            const bondLinkId = data?.bondLinkId;
            if (bondLinkId && Types.ObjectId.isValid(bondLinkId)) {
                console.log('Valid ObjectId');
            } else {
                console.error('Invalid ObjectId');
                emitError(socket, {
                    code: 400,
                    message: 'Invalid ObjectId',
                    type: 'general',
                    details: 'You must provide valid object id',
                });
                return;
            }
            const chat = await Conversation.findOne({
                bondLink: bondLinkId,
                type: data?.type,
            });
            if (!chat) {
                emitError(socket, {
                    code: 404,
                    message: 'Chat not found',
                    type: 'general',
                    details: 'The bond link chat was not found',
                });
                return;
            }
            const bondLink = await BondLink.findById(data?.bondLinkId);
            if (!bondLink) {
                emitError(socket, {
                    code: 400,
                    message: 'Bond link chat not found',
                    type: 'general',
                    details: 'Bond link chat not found',
                });
            }

            console.log('curretn user id', currentUserId);
            // create new message
            const messageData = {
                text: data.text,
                imageUrl: data.imageUrl || [],
                videoUrl: data.videoUrl || [],
                msgByUserId: data?.sender,
                conversationId: chat?._id,
            };
            const saveMessage = await Message.create(messageData);
            const populatedMessage = await saveMessage.populate({
                path: 'msgByUserId',
                select: 'name profile_image',
            });
            await Conversation.updateOne(
                { _id: chat?._id },
                {
                    lastMessage: populatedMessage._id,
                }
            );

            chat.participants.forEach(async (participantId: Types.ObjectId) => {
                io.to(participantId.toString()).emit(
                    `message-${bondLinkId}-${chat.type}`,
                    populatedMessage
                );
                const singleConversation = await getSingleConversation(
                    chat._id,
                    participantId.toString()
                );
                io.to(participantId.toString()).emit(
                    'conversation',
                    singleConversation
                );
                // }
            });
        }
    });

    // send---------------------------------
    socket.on('seen', async ({ conversationId, msgByUserId }) => {
        await Message.updateMany(
            { conversationId: conversationId, msgByUserId: msgByUserId },
            { $set: { seen: true } }
        );
        //send conversation --------------
        const conversationSender = await getSingleConversation(
            currentUserId,
            msgByUserId
        );
        const conversationReceiver = await getSingleConversation(
            msgByUserId,
            currentUserId
        );

        io.to(currentUserId as string).emit('conversation', conversationSender);
        io.to(msgByUserId).emit('conversation', conversationReceiver);
    });
};

export default handleChat;
