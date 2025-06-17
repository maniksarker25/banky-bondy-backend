import { Schema, model } from 'mongoose';
import { IInstitutionConversation } from './institutionConversation.interface';

const institutionConversationSchema = new Schema<IInstitutionConversation>(
    {
        name: { type: String, required: true },
        isPublic: { type: Boolean, required: true },
        ussers: [{ type: Schema.Types.ObjectId, ref: 'NormalUser' }],
        likers: [{ type: Schema.Types.ObjectId, ref: 'NormalUser' }],
    },
    {
        timestamps: true,
    }
);

const InstitutionConversation = model<IInstitutionConversation>(
    'InstitutionConversation',
    institutionConversationSchema
);

export default InstitutionConversation;
