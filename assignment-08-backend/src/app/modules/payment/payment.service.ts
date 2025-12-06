import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import config from "../../../config/config";
import { IPaymentBody } from "./payment.interface";
import { Orders } from "../order/order.schema";
import { IOrder } from "../order/order.interface";
import Stripe from "stripe";

const stripe = new Stripe(config.stripe_secret_key as string, {
  apiVersion: "2025-10-29.clover",
});

const createPaymentLink = async (payload: IPaymentBody) => {
  const { paidAmount, currency, email, userId, eventId } = payload;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email as string | undefined,
      line_items: [
        {
          price_data: {
            currency: (currency || "usd") as string,
            product_data: {
              name: `Event Payment - ${eventId}`,
              description: `Payment for event ${eventId}`,
            },
            unit_amount: Math.round(Number(paidAmount) * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${config.FRONTEND_URL}/user`,
      cancel_url: `${config.FRONTEND_URL}/events`,
      metadata: {
        userId: String(userId),
        eventId: String(eventId),
        paidAmount: String(paidAmount),
        email: String(email || ""),
      },
    } as Stripe.Checkout.SessionCreateParams);

    return session.url;
  } catch (error) {
    console.error(error);
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Failed to generate Payment URL",
    );
  }
};

export const handleStripeWebhook = async (req: any, res: any) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // --- Extract Metadata and payment info ---
      const metadata = session.metadata!;
      const paymentIntentId = session.payment_intent as string;
      const amountTotal = session.amount_total! / 100; // back to base unit

      const orderPayload: IOrder = {
        userId: metadata.userId,
        eventId: metadata.eventId,
        paidAmount: Number(metadata.paidAmount) || amountTotal,
        transectionId: paymentIntentId,
        paymentDate: new Date().toISOString(),
      } as any;

      const result = await Orders.create(orderPayload);

      console.log("Order Result: ", result);
      console.log(
        `✅ Order placed successfully for transaction: ${paymentIntentId}`,
      );
    } catch (err) {
      console.error("Error creating order:", err);
    }
  }

  res.status(200).send("Webhook received");
};

export const PaymentService = {
  createPaymentLink,
  handleStripeWebhook,
};
