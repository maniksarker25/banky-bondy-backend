/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../error/appError';
import QueryBuilder from '../../builder/QueryBuilder';
import Project from './project.model';
import { IProject } from './project.interface';
import { deleteFileFromS3 } from '../../helper/deleteFromS3';
import ProjectMember from '../projectMember/projectMember.model';
import ProjectJoinRequest from '../projectJoinRequest/projectJoinRequest.model';
import Conversation from '../conversation/conversation.model';
import mongoose from 'mongoose';
import { ENUM_CONVERSATION_TYPE } from '../conversation/conversation.enum';

// Create Project
const createProject = async (userId: string, payload: IProject) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const result = await Project.create([{ ...payload, owner: userId }], {
            session,
        });
        await Conversation.create(
            [
                {
                    participants: [userId],
                    lastMessage: null,
                    type: ENUM_CONVERSATION_TYPE.group,
                    institution: null,
                    project: result[0]._id,
                    chatGroup: null,
                },
            ],
            { session }
        );

        await session.commitTransaction();
        session.endSession();
        return result[0];
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        throw new AppError(
            httpStatus.NOT_FOUND,
            `${error.message}` || 'Something went wrong'
        );
    }
};

// const getAllProjects = async (query: Record<string, unknown>) => {
//     const projectQuery = new QueryBuilder(
//         Project.find().populate({
//             path: 'owner',
//             select: 'name profile_image',
//         }),
//         query
//     )
//         .search(['name', 'description'])
//         .filter()
//         .sort()
//         .paginate()
//         .fields();

//     const result = await projectQuery.modelQuery;
//     const meta = await projectQuery.countTotal();

//     return {
//         meta,
//         result,
//     };
// };

// const getAllProjects = async (query: Record<string, unknown>) => {
//     const page = Number(query.page) || 1;
//     const limit = Number(query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const searchTerm = query.searchTerm || '';

//     const filters: any = {};

//     Object.keys(query).forEach((key) => {
//         // Exclude `searchTerm`, `page`, and `limit` from filters
//         if (
//             !['searchTerm', 'page', 'limit'].includes(key) &&
//             query[key] !== undefined
//         ) {
//             filters[key] = query[key];
//         }
//     });

//     // Create the aggregation pipeline
//     const pipeline: any[] = [
//         {
//             $match: {
//                 ...filters,
//                 $or: [
//                     { name: { $regex: searchTerm, $options: 'i' } },
//                     { description: { $regex: searchTerm, $options: 'i' } },
//                 ],
//             },
//         },

//         // Lookup to populate the owner details
//         {
//             $lookup: {
//                 from: 'normalusers',
//                 localField: 'owner',
//                 foreignField: '_id',
//                 as: 'owner',
//             },
//         },

//         // Unwind the 'owner' array (since it's a single object, it will turn into a single entry)
//         { $unwind: '$owner' },

//         // Lookup to calculate the total number of participants for each project
//         {
//             $lookup: {
//                 from: 'projectmembers',
//                 localField: '_id',
//                 foreignField: 'project',
//                 as: 'participants',
//             },
//         },

//         // Add a field 'totalParticipate' to count the number of participants
//         {
//             $addFields: {
//                 totalParticipate: { $size: '$participants' },
//             },
//         },

//         // Select the fields you want to return, including owner details and total participants
//         {
//             $project: {
//                 _id: 1,
//                 name: 1,
//                 description: 1,
//                 status: 1,
//                 isPublic: 1,
//                 joinControll: 1,
//                 createdAt: 1,
//                 updatedAt: 1,
//                 cover_image: 1,
//                 totalParticipate: 1,
//                 'owner._id': 1,
//                 'owner.name': 1,
//                 'owner.profile_image': 1,
//             },
//         },

//         // Sorting (default is by 'createdAt' in descending order)
//         { $sort: { createdAt: -1 } },

//         // Pagination
//         { $skip: skip },
//         { $limit: limit },

//         // Count total projects for pagination
//         {
//             $facet: {
//                 meta: [{ $count: 'total' }],
//                 result: [],
//             },
//         },
//     ];

//     // Execute the aggregation pipeline
//     const aggResult = await Project.aggregate(pipeline);

//     // Get results and total count
//     const result = aggResult[0]?.result || [];
//     const total = aggResult[0]?.meta[0]?.total || 0;
//     const totalPage = Math.ceil(total / limit);

//     return {
//         meta: {
//             page,
//             limit,
//             total,
//             totalPage,
//         },
//         result,
//     };
// };
const getAllProjects = async (userId: string, query: Record<string, any>) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchTerm = query.searchTerm || '';

    // Filters: Add more filters based on project fields (excluding pagination and search)
    const filters: any = {};
    if (query.isPublic) {
        if (query.isPublic == 'true') {
            query.isPublic = true;
        } else {
            query.isPublic = false;
        }
    }

    Object.keys(query).forEach((key) => {
        if (
            ![
                'searchTerm',
                'page',
                'limit',
                'myProject',
                'joinProject',
            ].includes(key)
        ) {
            filters[key] = query[key];
        }
    });

    // If query.myProject is passed, fetch projects owned by the user
    const matchStage: any = {};
    if (query.myProject) {
        matchStage.owner = new mongoose.Types.ObjectId(userId);
    }

    // If query.joinProject is passed, fetch projects where the user is a member
    if (query.joinProject) {
        const joinedProjects = await ProjectMember.find({
            user: userId,
        }).select('project');
        const joinedProjectIds = joinedProjects.map((member) => member.project);

        matchStage._id = { $in: joinedProjectIds }; // Only user's joined projects
    }

    // Include search term to search by name and description
    const searchMatchStage = searchTerm
        ? {
              $or: [
                  { name: { $regex: searchTerm, $options: 'i' } },
                  { description: { $regex: searchTerm, $options: 'i' } },
              ],
          }
        : {};

    // Aggregation pipeline
    const pipeline: any[] = [
        { $match: { ...matchStage, ...filters, ...searchMatchStage } },

        // Lookup to populate owner details
        {
            $lookup: {
                from: 'normalusers', // Assuming 'normalusers' is the collection for users
                localField: 'owner', // Project's 'owner' field references the user
                foreignField: '_id',
                as: 'owner',
            },
        },

        // Unwind the 'owner' array (since it's a single object, it will turn into a single entry)
        { $unwind: '$owner' },
        // Lookup to count total participants in ProjectMember collection
        {
            $lookup: {
                from: 'projectmembers', // must match the actual collection name in MongoDB
                localField: '_id',
                foreignField: 'project',
                as: 'participants',
            },
        },
        {
            $addFields: {
                totalParticipants: { $size: '$participants' },
            },
        },

        // Select only the necessary fields
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                status: 1,
                isPublic: 1,
                joinControll: 1,
                createdAt: 1,
                updatedAt: 1,
                cover_image: 1,
                totalParticipants: 1,
                'owner._id': 1,
                'owner.name': 1,
                'owner.profile_image': 1,
            },
        },

        // Sort by createdAt (descending by default)
        { $sort: { createdAt: -1 } },

        // Pagination (skip and limit)
        { $skip: skip },
        { $limit: limit },

        // Count total projects for pagination
        {
            $facet: {
                meta: [{ $count: 'total' }],
                result: [],
            },
        },
    ];

    // Execute the aggregation pipeline
    const aggResult = await Project.aggregate(pipeline);

    // Get results and total count
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
const getMyProjects = async (
    userId: string,
    query: Record<string, unknown>
) => {
    // Let's assume we search on 'name' and 'description'
    const projectQuery = new QueryBuilder(Project.find({ ower: userId }), query)
        .search(['name', 'description'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await projectQuery.modelQuery;
    const meta = await projectQuery.countTotal();

    return {
        meta,
        result,
    };
};

// Get Project by ID
const getProjectById = async (projectId: string) => {
    const project = await Project.findById(projectId).populate({
        path: 'owner',
        select: 'name profile_image',
    });
    if (!project) {
        throw new AppError(httpStatus.NOT_FOUND, 'Project not found');
    }
    const totalParticipate = await ProjectMember.countDocuments({
        project: projectId,
    });

    return {
        ...project.toObject(),
        totalParticipate,
    };
};

// Update Project
const updateProject = async (projectId: string, payload: Partial<IProject>) => {
    const project = await Project.findById(projectId);
    if (!project) {
        throw new AppError(httpStatus.NOT_FOUND, 'Project not found');
    }

    const updatedProject = await Project.findByIdAndUpdate(projectId, payload, {
        new: true,
    });

    if (project.cover_image && payload.cover_image) {
        deleteFileFromS3(project.cover_image);
    }
    return updatedProject;
};

// Delete Project
const deleteProject = async (userId: string, projectId: string) => {
    const project = await Project.findOne({ _id: projectId, ower: userId });
    if (!project) {
        throw new AppError(httpStatus.NOT_FOUND, 'Project not found');
    }
    const result = await Project.findByIdAndDelete(projectId);
    await ProjectMember.deleteMany({ project: projectId });
    await ProjectJoinRequest.deleteMany({ project: projectId });
    if (project.cover_image) {
        deleteFileFromS3(project.cover_image);
    }
    return result;
};

const ProjectService = {
    createProject,
    getAllProjects,
    getProjectById,
    getMyProjects,
    updateProject,
    deleteProject,
};

export default ProjectService;
