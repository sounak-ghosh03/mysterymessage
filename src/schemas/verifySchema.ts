import { z } from "zod";

export const versifySchema = z.object({
    code: z.string().length(6, "Code must be 6 characters long"),
});
