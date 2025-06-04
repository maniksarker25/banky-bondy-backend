import { z } from "zod";

export const updateRelativeData = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    }),
});

const RelativeValidations = { updateRelativeData };
export default RelativeValidations;