import httpStatus from 'http-status';
import AppError from '../../error/appError';
import BondRequest from './bondRequest.model';
import { IBondRequest } from './bondRequest.interface';
import QueryBuilder from '../../builder/QueryBuilder';

const createBondRequestIntoDB = async (payload: IBondRequest) => {
    return await BondRequest.create(payload);
};

const getAllBondRequests = async (query: Record<string, unknown>) => {
    const resultQuery = new QueryBuilder(BondRequest.find(), query)
        .search(['give', 'get', 'location'])
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

const getSingleBondRequest = async (id: string) => {
    const bondRequest = await BondRequest.findById(id).populate('user');
    if (!bondRequest)
        throw new AppError(httpStatus.NOT_FOUND, 'BondRequest not found');
    return bondRequest;
};

const updateBondRequestIntoDB = async (
    id: string,
    payload: Partial<IBondRequest>
) => {
    const bondRequest = await BondRequest.findById(id);
    if (!bondRequest)
        throw new AppError(httpStatus.NOT_FOUND, 'BondRequest not found');

    return await BondRequest.findByIdAndUpdate(id, payload, { new: true });
};

const deleteBondRequestFromDB = async (id: string) => {
    const bondRequest = await BondRequest.findById(id);
    if (!bondRequest)
        throw new AppError(httpStatus.NOT_FOUND, 'BondRequest not found');

    return await BondRequest.findByIdAndDelete(id);
};

const bondRequestService = {
    createBondRequestIntoDB,
    getAllBondRequests,
    getSingleBondRequest,
    updateBondRequestIntoDB,
    deleteBondRequestFromDB,
};

export default bondRequestService;
