import httpStatus from 'http-status';
import catchAsync from '../../utilities/catchasync';
import sendResponse from '../../utilities/sendResponse';
import ProjectJoinRequestServices from './projectJoinRequest.service';

const sendJoinRequest = catchAsync(async (req, res) => {
    const result = await ProjectJoinRequestServices.sendJoinRequest(
        req.user.profileId,
        req.params.id
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Join request sent successfully',
        data: result,
    });
});

const ProjectJoinRequestController = { sendJoinRequest };
export default ProjectJoinRequestController;
