import httpStatus from 'http-status';
import AppError from '../../error/appError';
import QueryBuilder from '../../builder/QueryBuilder';
import Project from './project.model';
import { IProject } from './project.interface';
import { deleteFileFromS3 } from '../../helper/deleteFromS3';

// Create Project
const createProject = async (payload: IProject) => {
    const result = await Project.create(payload);
    return result;
};

// Get All Projects with filtering, search, pagination, etc.
const getAllProjects = async (query: Record<string, unknown>) => {
    // Let's assume we search on 'name' and 'description'
    const projectQuery = new QueryBuilder(
        Project.find().populate('ower'),
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
    const project = await Project.findById(projectId).populate('ower');
    if (!project) {
        throw new AppError(httpStatus.NOT_FOUND, 'Project not found');
    }
    return project;
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
const deleteProject = async (projectId: string) => {
    const project = await Project.findById(projectId);
    if (!project) {
        throw new AppError(httpStatus.NOT_FOUND, 'Project not found');
    }
    const result = await Project.findByIdAndDelete(projectId);

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
