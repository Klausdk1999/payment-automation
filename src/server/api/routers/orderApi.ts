// orderRouter.ts
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { itemSchema } from './itemApi'; // import the itemSchema from itemRouter.ts

export const orderStatusEnumType = z.enum(['pending', 'approved', 'accredited', 'delivered', 'canceled']);

export const orderSchema = z.object({
  id: z.string().uuid(),
  items: z.array(
    z.object({
      quantity: z.number().int(),
      pricePerItem: z.number(),
      itemId: z.string().uuid(),
      assignedAt: z.string(),
    }),
  ),
  price: z.number(),
  payment_link: z.string(),
  payment_id: z.string(),
  status: orderStatusEnumType,
  pdvId: z.string().uuid(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ordersRouter = createTRPCRouter({
  create: publicProcedure
  .input(
    z.object({
      items: z.array(
        z.object({
          quantity: z.number().int(),
          itemId: z.string().uuid(),
        }),
      ),
      price: z.number(),
      pdvId: z.string().uuid(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { items, price, pdvId } = input;

    // Fetch prices for all items in parallel
    const prices = await Promise.all(
      items.map(async (item) => {
        const fetchedItem = await ctx.prisma.items.findUnique({ where: { id: item.itemId } });
        if (!fetchedItem) throw new Error(`Item with ID ${item.itemId} not found`);
        if (fetchedItem.price === undefined) throw new Error(`Price is undefined for item with ID ${item.itemId}`);
        return fetchedItem.price;
      }),
    );

    // Create the order with the fetched prices
    return ctx.prisma.order.create({
      data: {
        price,
        pdv: { connect: { id: pdvId } },
        items: {
          create: items.map((item, index) => ({
            quantity: item.quantity,
            pricePerItem: prices[index]!, // Use the fetched price
            item: { connect: { id: item.itemId } },
          })),
        },
      },
      include: { items: true },
    });
  }),



  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.order.findUnique({ where: { id: input.id }, include: { items: { include: { item: true } } } });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return ctx.prisma.order.findMany();
  }),
  
});
