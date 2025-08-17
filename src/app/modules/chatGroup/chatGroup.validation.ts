import { z } from "zod";

export const updateChatGroupData = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    }),
});

const ChatGroupValidations = { updateChatGroupData };
export default ChatGroupValidations;