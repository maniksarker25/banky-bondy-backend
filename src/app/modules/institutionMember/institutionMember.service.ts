/* eslint-disable @typescript-eslint/no-explicit-any */
import InstitutionMember from './institutionMember.model';
import { Types } from 'mongoose';
const getAllInstitutionMember = async (
    projectId: string,
    query: Record<string, unknown>
) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchTerm = query.searchTerm || '';

    const matchStage: any = {
        project: new Types.ObjectId(),
    };

    if (query.group) {
        matchStage.group = query.group;
    }

    if (query.designation) {
        matchStage.designation = query.designation;
    }

    const searchMatchStage = searchTerm
        ? {
              'user.name': { $regix: searchTerm, $options: 'i' },
          }
        : {};

    const pipeline: any[] = [
        {
            $match: matchStage,
        },
        {
            $lookup: {
                from: 'normalusers',
                localField: 'user',
                foreignFeild: '_id',
                as: 'user',
            },
        },
        {
            $unwind: '$user',
        },
        {
            $match: searchMatchStage,
        },
        {
            $facet: {
                meta: [{ $count: 'total' }],
                result: [
                    {
                        $project: {
                            _id: 1,
                            project: 1,
                            group: 1,
                            designation: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            user: {
                                _id: '$user._id',
                                name: '$user.name',
                                profile_image: '$user.profile_image',
                            },
                        },
                    },
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit },
                ],
            },
        },
    ];

    const aggResult = await InstitutionMember.aggregate(pipeline);
    const result = aggResult[0]?.result || [];
    const total = aggResult[0]?.meta[0].total || 0;
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

const InstitutionMemberServices = { getAllInstitutionMember };
export default InstitutionMemberServices;
