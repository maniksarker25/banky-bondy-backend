import InstitutionConversation from './institutionConversation.model';
import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { IInstitutionConversation } from './institutionConversation.interface';
import Institution from '../institution/institution.model';
import InstitutionMember from '../institutionMember/institutionMember.model';

// Create
const createInstitutionConversation = async (
    userId: string,
    payload: IInstitutionConversation
) => {
    const institution = await Institution.findById(payload.institution);
    if (!institution) {
        throw new AppError(httpStatus.NOT_FOUND, 'Inititution not found');
    }
    if (institution.creator.toString() != userId) {
        const member = await InstitutionMember.findOne({
            user: userId,
            institution: payload.institution,
        });
        if (!member) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                'You are not in that institution'
            );
        }
    }
    const result = await InstitutionConversation.create({
        ...payload,
        user: userId,
    });
    return result;
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
    userId: string,
    id: string,
    payload: Partial<IInstitutionConversation>
) => {
    const conversation = await InstitutionConversation.findById(id);
    if (!conversation) {
        throw new AppError(httpStatus.NOT_FOUND, 'Convsersation not found');
    }
    const institution = await Institution.findById(conversation.institution);
    if (!institution) {
        throw new AppError(httpStatus.NOT_FOUND, 'Institution not found');
    }
    if (
        institution.creator.toString() != userId &&
        conversation.user.toString() != userId
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "You don't have permission for update this conversation"
        );
    }
    const result = await InstitutionConversation.findByIdAndUpdate(
        id,
        payload,
        {
            new: true,
        }
    );
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
