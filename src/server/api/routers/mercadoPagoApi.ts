/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import { env } from "../../../env.mjs";
import { createTRPCRouter, publicProcedure } from "../trpc.js";
import { TRPCError } from "@trpc/server";

interface IOrder {
  id: string;
  items: {
    name: string;
    description: string;
    price: number;
  }[];
  cnpj: string;
  order: {
    id: string;
    isActive: boolean;
    pricePerItem: number;
    created_at: string;
    updated_at: string;
  };
}

export const mercadoPagoRouter = createTRPCRouter({
  createPayment: publicProcedure
    .input(
      z.object({
        notification_url: z.string().url(),
        external_reference: z.boolean(),
        items: z.array(z.object({
          id: z.string().uuid(),
          title: z.string(),
          quantity: z.number(),
          unit_price: z.number()
        })),
        pdv: z.string().uuid(),
      })
    )
    .mutation(({ ctx, input }) => {
      const body = {
        notification_url: input.notification_url,
        external_reference: input.external_reference,
        binary_mode: true,
        items: input.items.map((item) =>
          ({ id:item.id ,quantity: item.quantity, title: item.title, unit_price: item.unit_price, currency_id: "BRL" })),
        back_urls: {
          success: `${env.APP_URL}/${input.pdv}/success`,
          failure: `${env.APP_URL}/${input.pdv}/failure`,
        },
        auto_return: "approved",
      };

      try {
        fetch(`${env.API_URL}/checkout/preferences?access_token=${env.ACCESS_TOKEN}`, {
          method: "POST",
          body: JSON.stringify(body),
        })
          .then((response) => response.json())
          .then((data: { init_point: string;}) => {
            if (!data.init_point) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message: "Erro nos dados retornados ao criar pedido no mercadopago",
              });
            }
            const items = input.items.map((item) => ({ itemId: item.id }))
            return ctx.prisma.order.create({
              data: {
                items:  {
                  connect: items,
                },
                price: input.items.reduce((acc, item) => acc + item.quantity * item.unit_price, 0),
                payment_link: data.init_point,
                pdvId: input.pdv,
              },
            });
          })
          .catch((error) => {
            console.error(error);
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Erro ao criar licença no BPM",
            });
          });
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Erro ao criar licença no BPM",
        });
      }
    }),
  updateorder: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        isActive: z.boolean(),

        userLimit: z.number(),
        areaLimit: z.number(),
        pricePerUser: z.number(),
        company_id: z.string().uuid(),

      })
    )
    .mutation(({ ctx, input }) => {
      const body = {
        adminName: 
          input.adminName && input.adminName.length > 0 
            ? input.adminName
            : undefined,
        adminEmail: input.adminEmail,
        isActive: input.isActive,
        userLimit: input.userLimit,
        areaLimit: input.areaLimit,
        pricePerUser: input.pricePerUser,
        company_id: input.company_id,
      };

      try {
        fetch(`${env.API_URL}/order/pdv/${input.company_id}`, {
          method: "PUT",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            api_key: env.API_KEY,
          },
        })
          .then((response) => response.json())
          .then((data: { id: string; cnpj: string; name: string }) => {
            if (!data.id || !data.cnpj || !data.name) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message:
                  "Erro nos dados retornados ao atualizar empresa no BPM",
              });
            }

            return ctx.prisma.order.upsert({
              where: { id: input.id },
              update: {
                isActive: input.isActive,
                adminEmail: input.adminEmail,
                userLimit: input.userLimit,
                areaLimit: input.areaLimit,
                pricePerUser: input.pricePerUser,
              },
              create: {
                id: input.id,
                isActive: input.isActive,
                adminEmail: input.adminEmail,
                userLimit: input.userLimit,
                areaLimit: input.areaLimit,
                pricePerUser: input.pricePerUser,
                company_id: input.company_id,
              },
            });
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
        return { error: error };
      }
    }),
  listpdv: publicProcedure.mutation(async () => {
     try {
       const response = await fetch(`${env.API_URL}/order/pdv`, {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
           api_key: env.API_KEY,
         },
       });

       if (!response.ok) {
         throw new TRPCError({
           code: "BAD_REQUEST",
           message: "Erro ao buscar licença no BPM",
         });
       }

       const data: IData[] = await response.json();
       
       const pdv: IData[] = data.map((item: IData) => ({
         id: item.id,
         name: item.name,
         cnpj: item.cnpj,
         order: {
           id: item.order.id,
           isActive: item.order.isActive,
           userLimit: item.order.userLimit,
           areaLimit: item.order.areaLimit,
           pricePerUser: item.order.pricePerUser,
           adminEmail: item.order.adminEmail,
           created_at: item.order.created_at,
           updated_at: item.order.updated_at,
         },
       }));
      
       return pdv;
     } catch (error) {
       console.error(error);
       throw new TRPCError({
         code: "BAD_REQUEST",
         message: "Erro ao buscar licença no BPM",
       });
     }
  }),
});
