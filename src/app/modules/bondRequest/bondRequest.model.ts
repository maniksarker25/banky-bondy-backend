import { Schema, model } from 'mongoose';
import { IBondRequest } from './bondRequest.interface';
import { ENUM_BOND_REQUEST_STATUS } from './bondRequest.enum';

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
        status: {
            type: String,
            enum: Object.values(ENUM_BOND_REQUEST_STATUS),
            default: ENUM_BOND_REQUEST_STATUS.WAITING_FOR_LINK,
        },
        radius: { type: Number },
    },
    {
        timestamps: true,
    }
);

const BondRequest = model<IBondRequest>('BondRequest', BondRequestSchema);
export default BondRequest;
