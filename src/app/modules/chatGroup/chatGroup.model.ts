import { model, Schema } from 'mongoose';
import { IChatGroup } from './chatGroup.interface';

const chatGroupSchema = new Schema<IChatGroup>(
    {
        name: {
            type: String,
        },
        participants: {
            type: [Schema.Types.ObjectId],
            ref: 'NormalUser',
            required: true,
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'NomralUser',
            required: true,
        },
    },
    { timestamps: true }
);

const ChatGroup = model<IChatGroup>('ChatGroup', chatGroupSchema);
export default ChatGroup;
