import { Types } from 'mongoose';

export interface IRelative {
    user: Types.ObjectId;
    relative: Types.ObjectId;
    relation: string;
}
