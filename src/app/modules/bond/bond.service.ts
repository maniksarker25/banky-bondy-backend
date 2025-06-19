import Bond from './bond.model';
import AppError from '../../error/appError';
import httpStatus from 'http-status';
import { IBond } from './bond.interface';

const createBondIntoDB = async (payload: IBond) => {
    return await Bond.create(payload);
};

const getAllBonds = async () => {
    return await Bond.find().populate('user');
};

const getSingleBond = async (id: string) => {
    const bond = await Bond.findById(id).populate('user');
    if (!bond) throw new AppError(httpStatus.NOT_FOUND, 'Bond not found');
    return bond;
};

const updateBondIntoDB = async (id: string, payload: Partial<IBond>) => {
    const bond = await Bond.findById(id);
    if (!bond) throw new AppError(httpStatus.NOT_FOUND, 'Bond not found');

    return await Bond.findByIdAndUpdate(id, payload, { new: true });
};

const deleteBondFromDB = async (id: string) => {
    const bond = await Bond.findById(id);
    if (!bond) throw new AppError(httpStatus.NOT_FOUND, 'Bond not found');

    return await Bond.findByIdAndDelete(id);
};

const bondService = {
    createBondIntoDB,
    getAllBonds,
    getSingleBond,
    updateBondIntoDB,
    deleteBondFromDB,
};

export default bondService;
