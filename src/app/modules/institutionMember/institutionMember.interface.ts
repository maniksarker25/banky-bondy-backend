import { Types } from 'mongoose';

export interface IInstitutionMember {
    group: 'a' | 'b';
    user: Types.ObjectId;
}
