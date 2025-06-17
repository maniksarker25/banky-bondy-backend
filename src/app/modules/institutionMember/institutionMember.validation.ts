import { z } from "zod";

export const updateInstitutionMemberData = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    }),
});

const InstitutionMemberValidations = { updateInstitutionMemberData };
export default InstitutionMemberValidations;