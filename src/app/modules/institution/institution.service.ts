import httpStatus from 'http-status';
import AppError from '../../error/appError';
import Institution from './institution.model';
import { IInstitution } from './institution.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { IInstitutionMember } from '../institutionMember/institutionMember.interface';
import InstitutionMember from '../institutionMember/institutionMember.model';
import { ENUM_GROUP } from '../institutionMember/institutionMember.enum';
import { deleteFileFromS3 } from '../../helper/deleteFromS3';

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
    if (payload.cover_image && institution.cover_image) {
        deleteFileFromS3(institution.cover_image);
    }
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
    if (institution.cover_image) {
        deleteFileFromS3(institution.cover_image);
    }
    return deleted;
};

const joinLeaveInstitution = async (
    userId: string,
    payload: IInstitutionMember
) => {
    const institution = await Institution.exists({ _id: payload.institution });
    if (!institution) {
        throw new AppError(httpStatus.NOT_FOUND, 'Institution not found');
    }
    const member = await InstitutionMember.findOne({
        user: userId,
        institution: payload.institution,
    });
    if (member) {
        const result = await InstitutionMember.findByIdAndDelete(member._id);
        return result;
    }
    if (!payload.group || !payload.designation) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Group and designation is required for join institution'
        );
    }
    if (payload.group != ENUM_GROUP.A && payload.group != ENUM_GROUP.B) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Invalid group type , please select A or B'
        );
    }
    const result = await InstitutionMember.create({ ...payload, user: userId });
    return result;
};

const InstitutionService = {
    createInstitution,
    getAllInstitutions,
    getInstitutionById,
    updateInstitution,
    deleteInstitution,
    joinLeaveInstitution,
};

export default InstitutionService;
