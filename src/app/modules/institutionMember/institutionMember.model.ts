import { model, Schema } from 'mongoose';
import { IInstitutionMember } from './institutionMember.interface';

const institutionMemberSchema = new Schema<IInstitutionMember>(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'NormalUser',
        },
        group: { type: String, enum: ['a', 'b'], required: true },
    },
    { timestamps: true }
);

const InstitutionMember = model<IInstitutionMember>(
    'InstitutionMember',
    institutionMemberSchema
);
export default InstitutionMember;
