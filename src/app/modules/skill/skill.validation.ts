import { z } from "zod";

export const updateSkillData = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    }),
});

const SkillValidations = { updateSkillData };
export default SkillValidations;