import { Schema, model } from 'mongoose';
import { IProjectMember } from './projectMember.interface';
import { ENUM_PROJECT_MUMBER_TYPE } from './projectMumber.enum';

const projectMemberSchema = new Schema<IProjectMember>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'normalusers',
            required: true,
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: 'projects',
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(ENUM_PROJECT_MUMBER_TYPE),
            required: true,
        },
        role: { type: String, required: true },
    },
    { timestamps: true }
);

const ProjectMember = model<IProjectMember>(
    'ProjectMember',
    projectMemberSchema
);

export default ProjectMember;
