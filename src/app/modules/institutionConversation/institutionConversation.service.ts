import InstitutionConversation from './institutionConversation.model';
import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { IInstitutionConversation } from './institutionConversation.interface';

// Create
const createInstitutionConversation = async (
    payload: IInstitutionConversation
) => {
    return await InstitutionConversation.create(payload);
};

// Get All
const getAllInstitutionConversations = async () => {
    return await InstitutionConversation.find()
        .populate('ussers')
        .populate('likers');
};

// Get Single
const getInstitutionConversationById = async (id: string) => {
    const result = await InstitutionConversation.findById(id)
        .populate('ussers')
        .populate('likers');
    if (!result)
        throw new AppError(httpStatus.NOT_FOUND, 'Conversation not found');
    return result;
};

// Update
const updateInstitutionConversation = async (
    id: string,
    payload: Partial<IInstitutionConversation>
) => {
    const result = await InstitutionConversation.findByIdAndUpdate(
        id,
        payload,
        {
            new: true,
        }
    );
    if (!result)
        throw new AppError(httpStatus.NOT_FOUND, 'Conversation not found');
    return result;
};

// Delete
const deleteInstitutionConversation = async (id: string) => {
    const result = await InstitutionConversation.findByIdAndDelete(id);
    if (!result)
        throw new AppError(httpStatus.NOT_FOUND, 'Conversation not found');
    return result;
};

const InstitutionConversationService = {
    createInstitutionConversation,
    getAllInstitutionConversations,
    getInstitutionConversationById,
    updateInstitutionConversation,
    deleteInstitutionConversation,
};

export default InstitutionConversationService;
