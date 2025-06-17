import httpStatus from 'http-status';
import AppError from '../../error/appError';
import Institution from './institution.model';
import { IInstitution } from './institution.interface';
import QueryBuilder from '../../builder/QueryBuilder';

// Create Institution
const createInstitution = async (userId: string, payload: IInstitution) => {
    const created = await Institution.create({ ...payload, creator: userId });
    return created;
};

// Get All Institutions
const getAllInstitutions = async (query: Record<string, unknown>) => {
    const institutionQuery = new QueryBuilder(
        Institution.find().populate('creator', 'name profile_image'),
        query
    )
        .search(['name', 'description'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await institutionQuery.modelQuery;
    const meta = await institutionQuery.countTotal();

    return {
        meta,
        result,
    };
};

// Get Institution by ID
const getInstitutionById = async (institutionId: string) => {
    const institution = await Institution.findById(institutionId).populate(
        'creator',
        'name profile_image'
    );
    if (!institution) {
        throw new AppError(httpStatus.NOT_FOUND, 'Institution not found');
    }
    return institution;
};

// Update Institution
const updateInstitution = async (
    institutionId: string,
    payload: Partial<IInstitution>
) => {
    const institution = await Institution.findById(institutionId);
    if (!institution) {
        throw new AppError(httpStatus.NOT_FOUND, 'Institution not found');
    }

    const updated = await Institution.findByIdAndUpdate(
        institutionId,
        payload,
        {
            new: true,
        }
    );
    return updated;
};

// Delete Institution
const deleteInstitution = async (userId: string, institutionId: string) => {
    const institution = await Institution.findOne({
        _id: institutionId,
        creator: userId,
    });
    if (!institution) {
        throw new AppError(httpStatus.NOT_FOUND, 'Institution not found');
    }

    const deleted = await Institution.findByIdAndDelete(institutionId);
    return deleted;
};

const InstitutionService = {
    createInstitution,
    getAllInstitutions,
    getInstitutionById,
    updateInstitution,
    deleteInstitution,
};

export default InstitutionService;
