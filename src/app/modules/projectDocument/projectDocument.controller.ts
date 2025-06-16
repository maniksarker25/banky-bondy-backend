import httpStatus from 'http-status';
import sendResponse from '../../utilities/sendResponse';
import projectDocumentServices from './projectDocument.service';
import catchAsync from '../../utilities/catchasync';

const createProjectDocument = catchAsync(async (req, res) => {
    const result = await projectDocumentServices.createProjectDocument(
        req.body
    );
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Project Document created successfully',
        data: result,
    });
});

const getAllProjectDocuments = catchAsync(async (req, res) => {
    const result = await projectDocumentServices.getAllProjectDocuments(
        req.query
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Project Documents retrieved successfully',
        data: result,
    });
});

const updateProjectDocument = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await projectDocumentServices.updateProjectDocument(
        id,
        req.body
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Project Document updated successfully',
        data: result,
    });
});

const deleteProjectDocument = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await projectDocumentServices.deleteProjectDocument(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Project Document deleted successfully',
        data: result,
    });
});

const ProjectDocumentController = {
    createProjectDocument,
    getAllProjectDocuments,
    updateProjectDocument,
    deleteProjectDocument,
};

export default ProjectDocumentController;
