import httpStatus from 'http-status';
import catchAsync from '../../utilities/catchasync';
import sendResponse from '../../utilities/sendResponse';
import bondLinkServices from './bondLink.service';

const createBondLink = catchAsync(async (req, res) => {
    const result = await bondLinkServices.createBondLink(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Bond links created successfully',
        data: result,
    });
});
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

const BondLinkController = { getMyBondLinks, createBondLink };
export default BondLinkController;
