import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const itemSchema = z.object({
  id: z.string().email(),
  name: z.string(),
  description: z.string().min(4),
  price: z.number(),
});

export const itemsRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().min(4),
        price: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return ctx.prisma.items.create({
        data: {
          description: input.description,
          price: input.price,
          name: input.name,
        },
      });
    }),
  getById: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.items.findFirst({
        where: { id: input.id },
      });
    }),
  updateById: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string(),
        description: z.string().min(4),
        price: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
          return ctx.prisma.items.update({
            where: { id: input.id },
            data: {
              description: input.description,
              price: input.price,
              name: input.name,
            },
          });      }
    ),
  deleteById: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.items.delete({ where: { id: input.id } });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return ctx.prisma.items.findMany();
  }),
});
