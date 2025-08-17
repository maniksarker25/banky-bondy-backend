import { IChatGroup } from './chatGroup.interface';
import ChatGroup from './chatGroup.model';

const createGroupChat = async (
    profileId: string,
    payload: Partial<IChatGroup>
) => {
    const result = await ChatGroup.create({ ...payload, creator: profileId });
    return result;
};

const ChatGroupServices = { createGroupChat };
export default ChatGroupServices;
