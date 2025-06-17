import httpStatus from 'http-status';
import catchAsync from '../../utilities/catchasync';
import sendResponse from '../../utilities/sendResponse';
import institutionMemberServices from './institutionMember.service';

const joinInstitution = catchAsync(async (req, res) => {
    const result = await institutionMemberServices.joinInstitution(
        req.user.profileId,
        req.body
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Joined  successfully',
        data: result,
    });
});

const InstitutionMemberController = { joinInstitution };
export default InstitutionMemberController;
