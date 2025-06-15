import httpStatus from 'http-status';
import AppError from '../../error/appError';
import ProjectJoinRequest from './projectJoinRequest.model';
import Project from '../project/project.model';
import { ENUM_PROJECT_JOIN_REQEST_STATUS } from './projectJoinRequest.enum';

const sendJoinRequest = async (userId: string, projectId: string) => {
    const result = await ProjectJoinRequest.create({
        user: userId,
        project: projectId,
    });
    return result;
};

const approveRejectRequest = async (
    userId: string,
    requestId: string,
    status: string
) => {
    const request = await ProjectJoinRequest.findById(requestId);
    if (!request) {
        throw new AppError(httpStatus.NOT_FOUND, 'Request not found');
    }

    const project = await Project.findById(request.project);
    if (project?.ower.toString() != userId) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'This is not your project join request'
        );
    }

    // if(status == ENUM_PROJECT_JOIN_REQEST_STATUS.Approved){
    //     const result = await
    // }
};

const ProjectJoinRequestServices = {
    sendJoinRequest,
};

export default ProjectJoinRequestServices;
