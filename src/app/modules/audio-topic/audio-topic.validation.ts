import { z } from "zod";

export const updateAudio-topicData = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    }),
});

const Audio-topicValidations = { updateAudio-topicData };
export default Audio-topicValidations;