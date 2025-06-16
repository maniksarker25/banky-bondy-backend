import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { IProjectDocument } from './projectDocument.interface';
import ProjectDocument from './projectDocument.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createProjectDocument = async (payload: IProjectDocument) => {
    return await ProjectDocument.create(payload);
};

const getAllProjectDocuments = async (query: Record<string, unknown>) => {
    const resultQuery = new QueryBuilder(ProjectDocument.find(), query)
        .fields()
        .filter()
        .paginate()
        .sort();

    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();
    return {
        meta,
        result,
    };
};

const updateProjectDocument = async (
    id: string,
    payload: Partial<IProjectDocument>
) => {
    const document = await ProjectDocument.findById(id);
    if (!document) {
        throw new AppError(httpStatus.NOT_FOUND, 'Project Document not found');
    }
    const result = await ProjectDocument.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
};

const deleteProjectDocument = async (id: string) => {
    return await ProjectDocument.findByIdAndDelete(id);
};

const ProjectDocumentServices = {
    createProjectDocument,
    getAllProjectDocuments,
    updateProjectDocument,
    deleteProjectDocument,
};

export default ProjectDocumentServices;
