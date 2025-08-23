import { ObjectId } from 'mongodb';

export interface IMessage {
    id: ObjectId;
    text: string;
    imageUrls: string[];
    videoUrls: string[];
    pdfUrls: string[];
    msgByUserId: ObjectId;
    seenBy: ObjectId[];
    conversationId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
