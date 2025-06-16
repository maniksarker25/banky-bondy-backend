import { Schema, model } from 'mongoose';
import { IConversation } from './conversation.interface'; // Importing the interface

const conversationSchema = new Schema<IConversation>(
    {
        participants: {
            type: [Schema.Types.ObjectId],
            ref: 'NormalUser',
            required: true,
        },
        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: 'Message',
            required: true,
        },
        type: {
            type: String,
            enum: ['one-to-one', 'group'],
            required: true,
        },
        institution: {
            type: Schema.Types.ObjectId,
            ref: 'Institution',
            default: null,
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            default: null,
        },
        chatGroup: {
            type: Schema.Types.ObjectId,
            ref: 'ChatGroup',
            default: null,
        },
    },
    { timestamps: true }
);

const ConversationModel = model<IConversation>(
    'Conversation',
    conversationSchema
);

export default ConversationModel;
