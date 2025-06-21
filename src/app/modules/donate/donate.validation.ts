import { z } from "zod";

export const updateDonateData = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    }),
});

const DonateValidations = { updateDonateData };
export default DonateValidations;