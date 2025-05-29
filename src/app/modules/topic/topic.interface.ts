import { Types } from 'mongoose';
export interface ITopic {
    category: Types.ObjectId;
    topic_icon: string;
    name: string;
    isDeleted: boolean;
}
