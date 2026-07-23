import { z } from "zod";
import { UserStatus } from "@prisma/client";

export const updateUserStatusSchema = z.object({
  body: z.object({
    status: z.enum([UserStatus.ACTIVE, UserStatus.BANNED]),
  }),
});
