import { Schema, model } from 'mongoose';
import { IMessage } from './message.interface';

const messageSchema = new Schema<IMessage>(
    {
        text: {
            type: String,
            required: true,
        },
        imageUrls: {
            type: [String],
            default: [],
        },
        videoUrls: {
            type: [String],
            default: [],
        },
        pdfUrls: {
            type: [String],
            default: [],
        },
        msgByUserId: {
            type: Schema.Types.ObjectId,
            ref: 'NormalUser',
            required: true,
        },
        seenBy: {
            type: [Schema.Types.ObjectId],
            ref: 'NormalUser',
            default: [],
        },
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const MessageModel = model<IMessage>('Message', messageSchema);

export default MessageModel;
