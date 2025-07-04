import QueryBuilder from '../../builder/QueryBuilder';
import { ENUM_CONVERSATION_TYPE } from '../conversation/conversation.enum';
import Conversation from '../conversation/conversation.model';
import { IBondLink } from './bondLink.interface';
import { BondLink } from './bondLink.model';

const createBondLink = async (payload: IBondLink) => {
    const result = await BondLink.create(payload);
    await Conversation.create({
        participants: payload.participants,
        type: ENUM_CONVERSATION_TYPE.group,
        bondLink: result._id,
    });
    return result;
};

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

const BondLinkServices = { getMyBondLinks, createBondLink };
export default BondLinkServices;
