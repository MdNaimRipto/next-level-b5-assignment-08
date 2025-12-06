import express from "express";
import { UserRouter } from "../modules/users/users.router";
import { PaymentRouter } from "../modules/payment/payment.router";
import { OrderRouter } from "../modules/order/order.router";
import { AdminRouter } from "../modules/admin/admin.router";
import { EventRouter } from "../modules/events/events.router";
import { ReviewRouter } from "../modules/reviews/reviews.router";

import { ImageRouter } from "../modules/images/images.router";

const router = express.Router();

const routes = [
  {
    path: "/users",
    route: UserRouter,
  },
  {
    path: "/payment",
    route: PaymentRouter,
  },
  {
    path: "/order",
    route: OrderRouter,
  },
  {
    path: "/admin",
    route: AdminRouter,
  },
  {
    path: "/events",
    route: EventRouter,
  },
  {
    path: "/reviews",
    route: ReviewRouter,
  },
  {
    path: "/images",
    route: ImageRouter,
  },
];

routes.map(r => router.use(r.path, r.route));

export const Routers = router;
