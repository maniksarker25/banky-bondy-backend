import { z } from 'zod';

const createDonorSchema = z.object({
    body: z.object({
        user: z.string({ required_error: 'User is required' }),
        amount: z
            .number({ required_error: 'Amount is required' })
            .positive({ message: 'Amount must be positive' }),
    }),
});

export const DonorValidations = {
    createDonorSchema,
};
