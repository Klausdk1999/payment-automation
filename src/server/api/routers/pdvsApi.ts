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
    .query(({ ctx, input }) => {
      return ctx.prisma.pDV.findFirst({ where: { id: input.id } });
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
});
