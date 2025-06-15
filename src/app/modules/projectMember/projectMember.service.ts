/* eslint-disable @typescript-eslint/no-explicit-any */
import ProjectMember from './projectMember.model';

// const getAllProjectMember = async (
//     projectId: string,
//     query: Record<string, unknown>
// ) => {
//     const mumberQuery = new QueryBuilder(
//         ProjectMember.find({ project: projectId }).populate({
//             path: 'user',
//             select: 'name profile_image',
//         }),
//         query
//     )
//         .search(['user.name', 'description'])
//         .filter()
//         .sort()
//         .paginate()
//         .fields();

//     const result = await mumberQuery.modelQuery;
//     const meta = await mumberQuery.countTotal();

//     return {
//         meta,
//         result,
//     };
// };

import { Types } from 'mongoose';

const getAllProjectMember = async (
    projectId: string,
    query: Record<string, any>
) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchTerm = query.searchTerm || '';

    const matchStage: any = {
        project: new Types.ObjectId(projectId),
    };
    if (query.type) {
        matchStage.type = query.type;
    }

    const searchMatchStage = searchTerm
        ? {
              'user.name': { $regex: searchTerm, $options: 'i' },
          }
        : {};

    const pipeline: any[] = [
        { $match: matchStage },
        {
            $lookup: {
                from: 'normalusers',
                localField: 'user',
                foreignField: '_id',
                as: 'user',
            },
        },
        { $unwind: '$user' },
        { $match: searchMatchStage },
        {
            $facet: {
                meta: [{ $count: 'total' }],
                result: [
                    {
                        $project: {
                            _id: 1,
                            project: 1,
                            type: 1,
                            role: 1,
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

    const aggResult = await ProjectMember.aggregate(pipeline);
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

const ProjectMemberServices = { getAllProjectMember };
export default ProjectMemberServices;
