import { Types } from 'mongoose';

export interface IDonor {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    amount: number;
    createdAt?: Date;
    updatedAt?: Date;
}
