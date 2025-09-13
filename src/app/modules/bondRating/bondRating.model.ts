import { model, Schema } from 'mongoose';
import { IBondRating } from './bondRating.interface';

const bondRatingSchema = new Schema<IBondRating>(
    {
        rated: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'NormalUser',
        },
        ratedBy: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'NormalUser',
        },
        rating: {
            type: Number,
            required: true,
            max: 5,
            min: 1,
        },
    },
    { timestamps: true }
);

const bondRatingModel = model<IBondRating>('BondRating', bondRatingSchema);
export default bondRatingModel;
