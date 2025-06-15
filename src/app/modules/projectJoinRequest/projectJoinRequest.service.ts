import ProjectJoinRequest from './projectJoinRequest.model';

const sendJoinRequest = async (userId: string, projectId: string) => {
    const result = await ProjectJoinRequest.create({
        user: userId,
        project: projectId,
    });
    return result;
};

const ProjectJoinRequestServices = {
    sendJoinRequest,
};

export default ProjectJoinRequestServices;
