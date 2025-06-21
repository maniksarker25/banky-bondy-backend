import QueryBuilder from '../../builder/QueryBuilder';
import { BondLink } from './bondLink.model';

const getMyBondLinks = async (
    userId: string,
    query: Record<string, unknown>
) => {
    const resultQuery = new QueryBuilder(
        BondLink.find({ participants: userId }).populate({
            path: 'requestedBonds',
            populate: { path: 'user', select: 'name profile_image' },
        }),
        query
    )
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

const BondLinkServices = { getMyBondLinks };
export default BondLinkServices;
