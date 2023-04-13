import { createTRPCRouter } from "./trpc";
//import { mercadoPagoRouter } from "./routers/mercadoPagoApi";
import { pdvRouter } from "./routers/pdvsApi";
import { usersRouter } from "./routers/usersApi";
import { authRouter } from "./routers/authApi";
import { itemsRouter } from "./routers/itemApi";
import { ordersRouter } from "./routers/orderApi";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  order: ordersRouter,
  items: itemsRouter,
  pdvs: pdvRouter,
  users: usersRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
