import { Schema, model } from 'mongoose';
import { IRelative } from './relative.interface';

const relativeSchema = new Schema<IRelative>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'NormalUser',
            required: true,
        },
        relative: {
            type: Schema.Types.ObjectId,
            ref: 'NormalUser',
            required: true,
        },
        relation: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

const Relative = model<IRelative>('Relative', relativeSchema);

export default Relative;
