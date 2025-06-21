import { z } from "zod";

export const updateBondLinkData = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    }),
});

const BondLinkValidations = { updateBondLinkData };
export default BondLinkValidations;