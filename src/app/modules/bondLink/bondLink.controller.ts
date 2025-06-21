import httpStatus from 'http-status';
import catchAsync from '../../utilities/catchasync';
import sendResponse from '../../utilities/sendResponse';
import bondLinkServices from './bondLink.service';

const getMyBondLinks = catchAsync(async (req, res) => {
    const result = await bondLinkServices.getMyBondLinks(
        req.user.profileId,
        req.query
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Bond links retrieved successfully',
        data: result,
    });
});

const BondLinkController = { getMyBondLinks };
export default BondLinkController;
