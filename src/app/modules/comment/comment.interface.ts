import { Types } from 'mongoose';

export interface IComment {
    _id?: Types.ObjectId;
    institutionConversation: Types.ObjectId;
    userId: Types.ObjectId;
    text: string;
    image: string;
    likers: Types.ObjectId[];
    parentCommentId: Types.ObjectId;
}
