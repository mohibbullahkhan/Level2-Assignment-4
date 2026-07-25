import { z } from "zod";

export const createPaymentSchema = (data: any) => {
  const schema = z.object({
    body: z.object({
      rentalRequestId: z.string({
        required_error: "Rental Request ID is required",
      }),
    })
  });

  const validation = schema.safeParse(data);
  return {
    isValid: validation.success,
    errors: validation.success ? [] : validation.error.issues,
  };
};
