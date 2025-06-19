import { Types } from 'mongoose';

export interface IBondRequest {
    user: Types.ObjectId;
    give: string;
    get: string;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    radius: number;
    createdAt?: Date;
    updatedAt?: Date;
}
