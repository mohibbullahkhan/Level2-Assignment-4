import { z } from "zod";

export const createPaymentSchema = (data: any) => {
  const schema = z.object({
    body: z.object({
      rentalRequestId: z.string(),
    })
  });

  const validation = schema.safeParse(data);
  return {
    isValid: validation.success,
    errors: validation.success ? [] : validation.error.issues,
  };
};
