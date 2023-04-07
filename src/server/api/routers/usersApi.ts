import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";

export const userSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(4),

});

export const usersRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(4),
        cpf_cnpj: z.string(),
        name: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return ctx.prisma.user.create({
        data: {
          email: input.email,
          password: bcrypt.hashSync(input.password, 10),
          cpf_cnpj: input.cpf_cnpj,
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
      return ctx.prisma.user.findFirst({
        where: { id: input.id },
      });
    }),
  updateById: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        email: z.string().email(),
        name: z.string(),
        new_password: z.string().min(4).optional(),
        confirm_password: z.string().min(4).optional(),
        cpf_cnpj: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (input.new_password && input.confirm_password) {
        if (input.new_password !== input.confirm_password) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Senhas não conferem",
          });
        } else {
          return ctx.prisma.user.update({
            where: { id: input.id },
            data: {
              password: bcrypt.hashSync(input.new_password, 10),
              email: input.email,
              name: input.name,
              cpf_cnpj: input.cpf_cnpj,
            },
          });
        }
      } else {
        return ctx.prisma.user.update({
          where: { id: input.id },
          data: {
            email: input.email,
            name: input.name,
          },
        });
      }
    }),
  deleteById: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.delete({ where: { id: input.id } });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return ctx.prisma.user.findMany();
  }),
});
