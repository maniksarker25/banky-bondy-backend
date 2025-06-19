import { Types } from 'mongoose';

export interface IBondRequest {
    user: Types.ObjectId;
    offer: string;
    want: string;
    location?: {
        type: 'Point';
        coordinates: [number, number];
    };
    radius?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
