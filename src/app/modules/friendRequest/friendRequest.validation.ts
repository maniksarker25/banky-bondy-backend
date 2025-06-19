import { z } from 'zod';

const createFriendRequestValidation = z.object({
    body: z.object({
        receiver: z.string({ required_error: 'Receiver is required' }),
    }),
});

const updateFriendRequestStatusValidation = z.object({
    body: z.object({
        status: z.enum(['accepted', 'rejected']),
    }),
});

const friendRequestValidation = {
    createFriendRequestValidation,
    updateFriendRequestStatusValidation,
};

export default friendRequestValidation;
