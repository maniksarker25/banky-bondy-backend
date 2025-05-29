import { z } from 'zod';
import { Types } from 'mongoose';
export const createTopicValidationSchema = z.object({
    body: z.object({
        name: z.string({ required_error: 'Name is required' }),
        category: z
            .string({ required_error: 'Category is required' })
            .refine((value) => Types.ObjectId.isValid(value), {
                message: 'Invalid ObjectId format for category',
            }),
    }),
});

const TopicValidations = { createTopicValidationSchema };
export default TopicValidations;
