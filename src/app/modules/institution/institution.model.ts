import { Schema, model } from 'mongoose';
import { IInstitution } from './institution.interface';

const institutionSchema = new Schema<IInstitution>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        groupOneName: { type: String, required: true },
        groupTwoName: { type: String, required: true },
        facebookLink: { type: String },
        instagramLink: { type: String },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'NormalUser',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Institution = model<IInstitution>('Institution', institutionSchema);

export default Institution;
