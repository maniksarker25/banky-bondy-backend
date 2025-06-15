import { z } from "zod";

export const updateProjectMemberData = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    }),
});

const ProjectMemberValidations = { updateProjectMemberData };
export default ProjectMemberValidations;