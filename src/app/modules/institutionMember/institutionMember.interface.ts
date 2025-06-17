import { Types } from 'mongoose';

export interface IInstitutionMember {
    group: 'a' | 'b';
    designation: string;
    user: Types.ObjectId;
}
