import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import stripe from "../../lib/stripe";
import config from "../../config";

const createPaymentSession = async (tenantId: string, rentalRequestId: string) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: rentalRequestId },
    include: { property: true }
  });

  if (!rentalRequest) throw new AppError(404, "Rental request not found");
  if (rentalRequest.tenantId !== tenantId) throw new AppError(403, "Forbidden");
  if (rentalRequest.status !== "APPROVED") throw new AppError(400, "Rental request is not APPROVED");

  // Create a pending payment
  const transactionId = `txn_${Date.now()}`;
  await prisma.payment.create({
    data: {
      transactionId,
      amount: rentalRequest.property.price,
      method: "CARD",
      provider: "STRIPE",
      status: "PENDING",
      rentalRequestId
    }
  });

  // Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: rentalRequest.property.title,
            description: `Payment for rental request: ${rentalRequest.id}`
          },
          unit_amount: Math.round(Number(rentalRequest.property.price) * 100)
        },
        quantity: 1
      }
    ],
    success_url: `${config.appUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.appUrl}/payment-cancel`,
    metadata: {
      rentalRequestId
    }
  });

  return { paymentUrl: session.url };
};

const handleStripeWebhook = async (payload: Buffer, signature: string) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, config.stripe.webhookSecret);
  } catch (err: any) {
    throw new AppError(400, `Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const rentalRequestId = session.metadata?.rentalRequestId;

    if (rentalRequestId) {
      await prisma.$transaction(async (tx) => {
        const payment = await tx.payment.findUnique({ where: { rentalRequestId } });
        if (payment) {
          await tx.payment.update({
            where: { id: payment.id },
            data: { status: "COMPLETED", paidAt: new Date() }
          });

          await tx.rentalRequest.update({
            where: { id: rentalRequestId },
            data: { status: "ACTIVE" }
          });

          const request = await tx.rentalRequest.findUnique({ where: { id: rentalRequestId } });
          if (request) {
            await tx.property.update({
              where: { id: request.propertyId },
              data: { status: "RENTED" }
            });
          }
        }
      });
    }
  }

  return { received: true };
};

const getTenantPayments = async (tenantId: string) => {
  return await prisma.payment.findMany({
    where: {
      rentalRequest: {
        tenantId
      }
    },
    include: {
      rentalRequest: {
        include: { property: true }
      }
    }
  });
};

const getPaymentById = async (id: string, userId: string, userRole: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      rentalRequest: {
        include: { property: true }
      }
    }
  });

  if (!payment) throw new AppError(404, "Payment not found");
  
  if (userRole === "TENANT" && payment.rentalRequest.tenantId !== userId) {
    throw new AppError(403, "Forbidden");
  }

  return payment;
};

export const PaymentService = {
  createPaymentSession,
  handleStripeWebhook,
  getTenantPayments,
  getPaymentById
};
