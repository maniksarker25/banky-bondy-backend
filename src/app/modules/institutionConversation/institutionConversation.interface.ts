import { Types } from 'mongoose';

export interface IInstitutionConversation {
    name: string;
    isPublic: boolean;
    ussers: Types.ObjectId[];
    likers: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}
