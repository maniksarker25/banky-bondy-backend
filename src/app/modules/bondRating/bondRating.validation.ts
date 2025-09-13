import { z } from "zod";

export const updateBondRatingData = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    }),
});

const BondRatingValidations = { updateBondRatingData };
export default BondRatingValidations;