import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { IProjectMember } from './projectMember.interface';
import projectMemberModel from './projectMember.model';

const updateUserProfile = async (
    id: string,
    payload: Partial<IProjectMember>
) => {
    if (payload.email || payload.username) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'You cannot change the email or username'
        );
    }
    const user = await projectMemberModel.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'Profile not found');
    }
    return await projectMemberModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};

const ProjectMemberServices = { updateUserProfile };
export default ProjectMemberServices;
