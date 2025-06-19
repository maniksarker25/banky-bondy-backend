import { Schema, model } from 'mongoose';
import { IBondRequest } from './bondRequest.interface';

const BondRequestSchema = new Schema<IBondRequest>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'NormalUser',
            required: true,
        },
        offer: { type: String, required: true },
        want: { type: String, required: true },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
                default: 'Point',
            },
            coordinates: { type: [Number], required: true, index: '2dsphere' },
        },
        radius: { type: Number },
    },
    {
        timestamps: true,
    }
);

const BondRequest = model<IBondRequest>('BondRequest', BondRequestSchema);
export default BondRequest;
