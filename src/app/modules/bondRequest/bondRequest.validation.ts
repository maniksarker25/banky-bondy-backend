import { z } from 'zod';

const createBondRequestValidationSchema = z.object({
    body: z.object({
        user: z.string({ required_error: 'User is required' }),
        give: z.string({ required_error: 'Give is required' }),
        get: z.string({ required_error: 'Get is required' }),
        location: z.string({ required_error: 'Location is required' }),
        radius: z.number({ required_error: 'Radius is required' }),
    }),
});

const updateBondRequestValidationSchema = z.object({
    body: z.object({
        user: z.string().optional(),
        give: z.string().optional(),
        get: z.string().optional(),
        location: z.string().optional(),
        radius: z.number().optional(),
    }),
});

const bondRequestValidation = {
    createBondRequestValidationSchema,
    updateBondRequestValidationSchema,
};

export default bondRequestValidation;
