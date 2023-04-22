import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const pdvRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        isActive: z.boolean(),
        type: z.string(),
        company: z.string(),
        login: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.pDV.create({
        data: {
          isActive: input.isActive,
          type: input.type,
          company: input.company,
          login: input.login,
          password: input.password,          
        },
      });
    }),
  updateById: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        isActive: z.boolean(),
        type: z.string(),
        company: z.string(),
        login: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.pDV.update({
        where: { id: input.id },
        data: {
          isActive: input.isActive,
          type: input.type,
          company: input.company,
          login: input.login,
          password: input.password,          
        },
      });
    }),
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.pDV.findFirst({ where: { id: input.id } });
    }),
  deleteById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.pDV.delete({ where: { id: input.id } });
    }),
  getAll: publicProcedure.mutation(({ ctx }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return ctx.prisma.pDV.findMany();
  }),
  linkItemToPdv: publicProcedure
  .input(
    z.object({
      pdvId: z.string().uuid(),
      itemId: z.string().uuid(),
      quantity: z.number().int(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { pdvId, itemId, quantity } = input;

    // Check if the PDV exists
    const pdv = await ctx.prisma.pDV.findUnique({ where: { id: pdvId } });
    if (!pdv) throw new Error(`PDV with ID ${pdvId} not found`);

    // Check if the item exists
    const item = await ctx.prisma.items.findUnique({ where: { id: itemId } });
    if (!item) throw new Error(`Item with ID ${itemId} not found`);

    // Link the item to the PDV
    return ctx.prisma.itemsOnPDV.create({
      data: {
        pdv: { connect: { id: pdvId } },
        item: { connect: { id: itemId } },
        quantity,
      },
    });
  }),
});
