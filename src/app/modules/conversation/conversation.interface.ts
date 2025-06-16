import { ObjectId } from 'mongodb';

export interface IConversation {
    id: ObjectId;
    participants: ObjectId[];
    lastMessage: ObjectId;
    type: 'one-to-one' | 'group';
    institution: ObjectId | null;
    project: ObjectId | null;
    chatGroup: ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
}
