import { z } from "zod";

export const updateProjectJoinRequestData = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    }),
});

const ProjectJoinRequestValidations = { updateProjectJoinRequestData };
export default ProjectJoinRequestValidations;