/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../error/appError';
import Institution from './institution.model';
import { IInstitution } from './institution.interface';
import { IInstitutionMember } from '../institutionMember/institutionMember.interface';
import InstitutionMember from '../institutionMember/institutionMember.model';
import { ENUM_GROUP } from '../institutionMember/institutionMember.enum';
import { deleteFileFromS3 } from '../../helper/deleteFromS3';
import mongoose from 'mongoose';

// Create Institution
const createInstitution = async (userId: string, payload: IInstitution) => {
    const created = await Institution.create({ ...payload, creator: userId });
    return created;
};

// Get All Institutions
const getAllInstitutions = async (
    userId: string,
    query: Record<string, unknown>
) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchTerm = query.searchTerm || '';

    // filters
    const filters: any = {};
    Object.keys(query).forEach((key) => {
        if (
            ![
                'searchTerm',
                'page',
                'limit',
                'myInstitution',
                'joinedInstitution',
            ].includes(key)
        ) {
            filters[key] = query[key];
        }
    });

    const matchStage: any = {};

    if (query.myInstitution) {
        matchStage.creator = new mongoose.Types.ObjectId(userId);
    }
    if (query.joinedInstitution) {
        const joinedInstitutions = await InstitutionMember.find({
            user: userId,
        }).select('project');
        const joinedInstitutionIds = joinedInstitutions.map(
            (member: any) => member.project
        );
        matchStage._id = { $in: joinedInstitutionIds };
    }

    const searchMatchStage: any = searchTerm
        ? {
              $or: [
                  { name: { $regex: searchTerm, options: 'i' } },
                  { description: { $regex: searchTerm, options: 'i' } },
              ],
          }
        : {};

    const pipeline: any[] = [
        {
            $match: { ...matchStage, ...filters, ...searchMatchStage },
        },
        {
            $lookup: {
                from: 'normalusers',
                localField: 'creator',
                foreignField: '_id',
                as: 'creator',
            },
        },
        {
            $unwind: '$creator',
        },

        {
            $lookup: {
                from: 'institutionmembers',
                localField: '_id',
                foreignField: 'institution',
                as: 'participants',
            },
        },
        {
            $addFields: {
                totalParticipants: { $size: '$participants' },
            },
        },

        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                createdAt: 1,
                updatedAt: 1,
                cover_image: 1,
                totalParticipants: 1,
                'creator._id': 1,
                'creator.name': 1,
                'creator.profile_image': 1,
            },
        },
        {
            $sort: { createdAt: -1 },
        },
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
        {
            $facet: {
                meta: [{ $count: 'total' }],
                result: [],
            },
        },
    ];

    const aggResult = await Institution.aggregate(pipeline);
    const result = aggResult[0]?.result || [];
    const total = aggResult[0]?.meta[0]?.total || 0;
    const totalPage = Math.ceil(total / limit);

    return {
        meta: {
            page,
            limit,
            total,
            totalPage,
        },
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
    const totalParticipate = await InstitutionMember.countDocuments({
        institution: institutionId,
    });
    return {
        ...institution.toObject(),
        totalParticipate,
    };
};

// Update Institution
const updateInstitution = async (
    userId: string,
    institutionId: string,
    payload: Partial<IInstitution>
) => {
    const institution = await Institution.findOne({
        _id: institutionId,
        creator: userId,
    });
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
