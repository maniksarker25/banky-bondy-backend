import { z } from 'zod';

export const createInstitutionValidationSchema = z.object({
    body: z.object({
        name: z.string({ required_error: 'Name is required' }),
        description: z.string({ required_error: 'Description is required' }),
        groupOneName: z.string({
            required_error: 'Group one name is required',
        }),
        groupTwoName: z.string({
            required_error: 'Group two name is required',
        }),
        facebookLink: z.string().url().optional(),
        instagramLink: z.string().url().optional(),
    }),
});

export const updateInstitutionValidationSchema = z.object({
    body: z
        .object({
            name: z.string().optional(),
            description: z.string().optional(),
            groupOneName: z.string().optional(),
            groupTwoName: z.string().optional(),
            facebookLink: z.string().url().optional(),
            instagramLink: z.string().url().optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: 'At least one field must be provided for update',
        }),
});

const InstitutionValidations = {
    createInstitutionValidationSchema,
    updateInstitutionValidationSchema,
};

export default InstitutionValidations;
