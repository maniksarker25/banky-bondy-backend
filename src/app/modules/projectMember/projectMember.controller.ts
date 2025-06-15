import httpStatus from 'http-status';
import catchAsync from '../../utilities/catchasync';
import sendResponse from '../../utilities/sendResponse';
import projectMemberServices from './projectMember.service';

const getAllProjectMember = catchAsync(async (req, res) => {
    const result = await projectMemberServices.getAllProjectMember(
        req.params.id,
        req.query
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Profile updated successfully',
        data: result,
    });
});

const addMember = catchAsync(async (req, res) => {
    const result = await projectMemberServices.addMember(
        req.user.profileId,
        req.params.id,
        req.body
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Member added successfully',
        data: result,
    });
});

const ProjectMemberController = { getAllProjectMember, addMember };
export default ProjectMemberController;
