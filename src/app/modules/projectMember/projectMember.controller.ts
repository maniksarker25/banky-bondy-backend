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

const ProjectMemberController = { getAllProjectMember };
export default ProjectMemberController;
