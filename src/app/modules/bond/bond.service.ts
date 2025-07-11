import Bond from './bond.model';
import AppError from '../../error/appError';
import httpStatus from 'http-status';
import { IBond } from './bond.interface';
import QueryBuilder from '../../builder/QueryBuilder';

const createBondIntoDB = async (userId: string, payload: IBond) => {
    return await Bond.create({ ...payload, user: userId });
};

const getMyBonds = async (userId: string, query: Record<string, unknown>) => {
    const resultQuery = new QueryBuilder(Bond.find({ user: userId }), query)
        .search(['name'])
        .fields()
        .filter()
        .paginate()
        .sort();

    const result = await resultQuery.modelQuery;
    const meta = await resultQuery.countTotal();
    return {
        meta,
        result,
    };
};

const getSingleBond = async (id: string) => {
    const bond = await Bond.findById(id).populate('user');
    if (!bond) throw new AppError(httpStatus.NOT_FOUND, 'Bond not found');
    return bond;
};

const updateBondIntoDB = async (
    userId: string,
    id: string,
    payload: Partial<IBond>
) => {
    const bond = await Bond.findOne({ _id: id, user: userId });
    if (!bond) throw new AppError(httpStatus.NOT_FOUND, 'Bond not found');

    return await Bond.findByIdAndUpdate(id, payload, { new: true });
};

const deleteBondFromDB = async (userId: string, id: string) => {
    const bond = await Bond.findOne({ user: userId, _id: id });
    if (!bond) throw new AppError(httpStatus.NOT_FOUND, 'Bond not found');

    return await Bond.findByIdAndDelete(id);
};

const bondService = {
    createBondIntoDB,
    getMyBonds,
    getSingleBond,
    updateBondIntoDB,
    deleteBondFromDB,
};

export default bondService;
