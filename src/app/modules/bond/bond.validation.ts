import { z } from 'zod';

const createBondValidationSchema = z.object({
    body: z.object({
        user: z.string({ required_error: 'User is required' }),
        offer: z.string({ required_error: 'Offer is required' }),
        want: z.string({ required_error: 'Want is required' }),
        tag: z.string({ required_error: 'Tag is required' }),
    }),
});

const updateBondValidationSchema = z.object({
    body: z.object({
        user: z.string().optional(),
        offer: z.string().optional(),
        want: z.string().optional(),
        tag: z.string().optional(),
    }),
});

const bondValidation = {
    createBondValidationSchema,
    updateBondValidationSchema,
};

export default bondValidation;
