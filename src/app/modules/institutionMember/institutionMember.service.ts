import httpStatus from 'http-status';
import AppError from '../../error/appError';
import { IInstitutionMember } from './institutionMember.interface';
import InstitutionMember from './institutionMember.model';

const joinInstitution = async (userId: string, payload: IInstitutionMember) => {
    const member = await InstitutionMember.findOne({
        user: userId,
        institution: payload.institution,
    });
    if (!member) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'You already joined is this institution'
        );
    }
    const result = await InstitutionMember.create({ ...payload, user: userId });
    return result;
};

const InstitutionMemberServices = { joinInstitution };
export default InstitutionMemberServices;
