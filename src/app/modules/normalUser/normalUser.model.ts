import { model, Schema } from 'mongoose';
import { INormalUser } from './normalUser.interface';
import { ENUM_GENDER } from '../user/user.enum';

const NormalUserSchema = new Schema<INormalUser>(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        // username: {
        //     type: String,
        //     required: true,
        // },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
        },
        profile_image: {
            type: String,
            default: '',
        },
        cover_image: {
            type: String,
        },
        gender: {
            type: String,
            enum: Object.values(ENUM_GENDER),
        },
        dateOfBirth: {
            type: Date,
        },
        address: {
            type: String,
        },
        bio: {
            type: String,
        },
        skills: {
            type: [Schema.Types.ObjectId],
        },
    },
    {
        timestamps: true,
    }
);
const NormalUser = model<INormalUser>('NormalUser', NormalUserSchema);

export default NormalUser;
