import { z } from "zod";

export const updateProjectData = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    }),
});

const ProjectValidations = { updateProjectData };
export default ProjectValidations;