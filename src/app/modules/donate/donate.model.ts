import { model, Schema } from 'mongoose';
import { IDonor } from './donate.interface';

const DonorSchema = new Schema<IDonor>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'NormalUser',
            required: true,
        },
        amount: { type: Number, required: true },
    },
    { timestamps: true }
);

export const Donor = model<IDonor>('Donor', DonorSchema);
