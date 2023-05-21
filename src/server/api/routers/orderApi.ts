// orderRouter.ts
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import axios from 'axios';
import { env } from '../../../env.mjs';

export enum OrderStatus {
  Pending = 'pending',
  Approved = 'approved',
  Accredited = 'accredited',
  Delivered = 'delivered',
  Canceled = 'canceled',
}
interface MercadoPagoResponse {
  id: string;
  init_point: string;
}

type PaymentInfo = {
  external_reference: string;
  status: string;
  status_detail: string;
};

function mapPaymentStatusToOrderStatus(
  status: string,
  status_detail: string,
): OrderStatus {
  if (!(status in OrderStatus) && !(status_detail in OrderStatus)) {
    throw new Error(
      `Invalid status and status_detail combination: ${status}, ${status_detail}`,
    );
  }

  if (status_detail in OrderStatus) {
    return status_detail as OrderStatus;
  }

  return status as OrderStatus;
}
console.log('map', mapPaymentStatusToOrderStatus('approved', 'accredited'));

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
  status: z.nativeEnum(OrderStatus),
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
        items.map(async item => {
          const fetchedItem = await ctx.prisma.items.findUnique({
            where: { id: item.itemId },
          });
          if (!fetchedItem)
            throw new Error(`Item with ID ${item.itemId} not found`);
          if (fetchedItem.price === undefined)
            throw new Error(
              `Price is undefined for item with ID ${item.itemId}`,
            );
          return fetchedItem.price;
        }),
      );

      // Create the order with the fetched prices
      const createdOrder = await ctx.prisma.order.create({
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

      // Create the payment link for the created order
      const orderId = createdOrder.id;

      // Fetch the order with the provided ID
      const order = await ctx.prisma.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { item: true } }, pdv: true },
      });

      if (!order) {
        throw new Error(`Order with ID ${orderId} not found`);
      }

      // Format the order items for the MercadoPago API
      const apiItems = order.items.map(orderItem => ({
        title: orderItem.item.name,
        quantity: orderItem.quantity,
        currency_id: 'BRL',
        unit_price: orderItem.pricePerItem,
      }));

      // Send the POST request to create the payment link
      const response = await axios.post<MercadoPagoResponse>(
        'https://api.mercadopago.com/checkout/preferences',
        {
          external_reference: `Order ID: ${orderId}`,
          binary_mode: true,
          items: apiItems,
          back_urls: {
            success: `${env.APP_URL}/pdv/${order.pdv.id}/success`,
            failure: `${env.APP_URL}/pdv/${order.pdv.id}/failure`,
          },
          auto_return: 'approved',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            access_token: env.ACCESS_TOKEN,
          },
        },
      );
      if (response.status !== 201) {
        throw new Error('Failed to create payment link');
      }

      // Update the order with the payment link and payment ID
      await ctx.prisma.order.update({
        where: { id: orderId },
        data: {
          payment_link: response.data.init_point,
        },
      });

      // Update the created order with the payment link
      const updatedOrder = await ctx.prisma.order.update({
        where: { id: createdOrder.id },
        data: {
          payment_link: response.data.init_point,
        },
        include: { items: { include: { item: true } } },
      });

      return updatedOrder;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.order.findUnique({
        where: { id: input.id },
        include: { items: { include: { item: true } } },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return ctx.prisma.order.findMany();
  }),
  getByPdvId: publicProcedure
    .input(z.object({ pdvId: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.order.findMany({
        where: { pdvId: input.pdvId },
      });
    }),
  createPaymentLink: publicProcedure
    .input(z.object({ orderId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { orderId } = input;

      // Fetch the order with the provided ID
      const order = await ctx.prisma.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { item: true } }, pdv: true },
      });

      if (!order) {
        throw new Error(`Order with ID ${orderId} not found`);
      }

      // Format the order items for the MercadoPago API
      const apiItems = order.items.map(orderItem => ({
        title: orderItem.item.name,
        quantity: orderItem.quantity,
        currency_id: 'BRL',
        unit_price: orderItem.pricePerItem,
      }));

      // Send the POST request to create the payment link
      const response = await axios.post<MercadoPagoResponse>(
        'https://api.mercadopago.com/checkout/preferences',
        {
          external_reference: `Order ID: ${orderId}`,
          binary_mode: true,
          items: apiItems,
          back_urls: {
            success: `${env.APP_URL}/pdv/${order.pdv.id}/success`,
            failure: `${env.APP_URL}/pdv/${order.pdv.id}/failure`,
          },
          auto_return: 'approved',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            access_token: env.ACCESS_TOKEN,
          },
        },
      );

      if (response.status !== 201) {
        throw new Error('Failed to create payment link');
      }

      // Update the order with the payment link and payment ID
      await ctx.prisma.order.update({
        where: { id: orderId },
        data: {
          payment_link: response.data.init_point,
        },
      });

      // Return the payment link
      return response.data.init_point;
    }),

  notification: publicProcedure
    .input(
      z.object({
        action: z.string(),
        api_version: z.string(),
        application_id: z.string(),
        date_created: z.string(),
        id: z.any(),
        live_mode: z.any(),
        type: z.string(),
        user_id: z.any(),
        data: z.object({
          id: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log('Notification received', input);
      // Check if the action is "payment.created"
      if (input.data.id) {
        // Fetch the payment information using the data.id
        const response = await axios.get(
          `https://api.mercadopago.com/v1/payments/${input.data.id}`,
          {
            headers: {
              // Add your access token here
              Authorization: `Bearer ${env.ACCESS_TOKEN}`,
            },
          },
        );
        console.log('Payment info', response)
        const paymentInfo = response.data as PaymentInfo;

        // Extract the external_reference and status from the paymentInfo
        const { external_reference, status, status_detail } = paymentInfo;

        const orderStatus = mapPaymentStatusToOrderStatus(
          status,
          status_detail,
        );

        // Fetch the order using the external_reference
        const order = await ctx.prisma.order.findUnique({
          where: {
            id: external_reference.split(' ')[2], // Assuming the external_reference is in the format "Order ID: orderId"
          },
        });

        if (!order) {
          throw new Error(
            `Order with external_reference ${external_reference} not found`,
          );
        }

        // Update the order with the payment_id and status
        await ctx.prisma.order.update({
          where: { id: order.id },
          data: {
            payment_id: input.data.id,
            status: orderStatus,
          },
        });

        // Return a message indicating the order was updated
        return {
          message: `Order ${order.id} updated with payment_id ${input.data.id} and status ${status}`,
        };
      }

      // Return a message indicating the action was not handled
      return { message: `Action ${input.action} not handled` };
    }),
});
