import { SignJWT } from "jose";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { createTRPCRouter, publicProcedure } from "../trpc";
import cookie from "cookie";
import bcrypt from "bcrypt";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string().min(4),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { res } = ctx;
      const { email, password } = input;

      const databaseUser = await ctx.prisma.user.findFirst({
        where: { email: email },
      });
      if (!databaseUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Usuário não encontrado",
        });
      }

      const isPasswordValid = bcrypt.compareSync(
        password,
        databaseUser.password
      );
      if (!isPasswordValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      } else {
        try {
          const token = await new SignJWT({
            id: databaseUser.id,
            email,
            name: databaseUser.name,
            role: databaseUser.role,
          })
            .setProtectedHeader({ alg: "HS256" })
            .setJti(nanoid())
            .setIssuedAt()
            .setExpirationTime("1h")
            .sign(new TextEncoder().encode(process.env.JWT_SECRET_KEY));
          if (!res) throw new Error("no res");

          res.setHeader(
            "Set-Cookie",
            cookie.serialize("user-token", token, {
              // httpOnly: true,
              path: "/",
              // secure: process.env.NODE_ENV === "production",
            })
          );
          return { success: true, user: {
            id: databaseUser.id,
            email,
            name: databaseUser.name,
            role: databaseUser.role,
          } };
        } catch (error) {
          console.error(error);
          return {
            error: "Application error: sem acesso aos dados de usuário",
          };
        }
      }
    }),
  accessPDV: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string().min(4),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { res } = ctx;
      const { email, password } = input;

      const databasePDV = await ctx.prisma.pDV.findFirst({
        where: { login: email },
      });
      if (!databasePDV) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Usuário não encontrado",
        });
      }
      const isPasswordValid = bcrypt.compareSync(
        password,
        databasePDV.password
      );
      if (!isPasswordValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid login or password",
        });
      } else {
        try {
          const token = await new SignJWT({
            id: databasePDV.id,
            name: databasePDV.company,
            role: 'user',
          })
            .setProtectedHeader({ alg: "HS256" })
            .setJti(nanoid())
            .setIssuedAt()
            .setExpirationTime("1h")
            .sign(new TextEncoder().encode(process.env.JWT_SECRET_KEY));
          if (!res) throw new Error("no res");
          if (ctx?.res) {
            ctx.res.setHeader(
              "Set-Cookie",
              cookie.serialize("user-token", "", {
                // httpOnly: true,
                path: "/",
                // secure: process.env.NODE_ENV === "production",
                expires: new Date(0),
              })
            );
          }
          res.setHeader(
            "Set-Cookie",
            cookie.serialize("user-token", token, {
              // httpOnly: true,
              path: "/",
              // secure: process.env.NODE_ENV === "production",
            })
          );
          return { success: true, pdv: {
            id: databasePDV.id,
            email,
            company: databasePDV.company,
            type: databasePDV.type,
          } };
        } catch (error) {
          console.error(error);
          return {
            error: "Application error: sem acesso aos dados de acesso",
          };
        }
      }
    }),
  logout: publicProcedure.input(z.object({})).mutation(({ ctx }) => {
    if (ctx?.res) {
      ctx.res.setHeader(
        "Set-Cookie",
        cookie.serialize("user-token", "", {
          // httpOnly: true,
          path: "/",
          // secure: process.env.NODE_ENV === "production",
          expires: new Date(0),
        })
      );
      return { success: true };
    } else {
      return {
        error: "Application error: sem acesso aos dados de usuário",
      };
    }
  }),
});
