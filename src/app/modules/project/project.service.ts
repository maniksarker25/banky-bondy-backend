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

// Get All Projects with filtering, search, pagination, etc.
const getAllProjects = async (query: Record<string, unknown>) => {
    // Let's assume we search on 'name' and 'description'
    const projectQuery = new QueryBuilder(
        Project.find().populate('owner'),
        query
    )
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
