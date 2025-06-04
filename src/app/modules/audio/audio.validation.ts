import { z } from "zod";

export const updateAudioData = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    }),
});

const AudioValidations = { updateAudioData };
export default AudioValidations;