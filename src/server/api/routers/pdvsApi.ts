import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import bcrypt from "bcrypt";

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
          password: bcrypt.hashSync(input.password, 10),         
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
      password: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const updateData: {
      isActive: boolean;
      type: string;
      company: string;
      login: string;
      password?: string;
    } = {
      isActive: input.isActive,
      type: input.type,
      company: input.company,
      login: input.login,
    };

    if (input.password) {
      updateData.password = bcrypt.hashSync(input.password, 10);
    }

    return await ctx.prisma.pDV.update({
      where: { id: input.id },
      data: updateData,
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

    // Upsert the item on PDV
    return ctx.prisma.itemsOnPDV.upsert({
      where: {
        pdvId_itemId: {
          pdvId,
          itemId,
        },
      },
      create: {
        pdv: { connect: { id: pdvId } },
        item: { connect: { id: itemId } },
        quantity,
      },
      update: {
        quantity,
      },
    });
  }),

});
