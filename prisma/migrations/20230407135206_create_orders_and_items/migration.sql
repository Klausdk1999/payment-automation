-- CreateEnum
CREATE TYPE "OrderStatusEnumType" AS ENUM ('pending', 'approved', 'accredited', 'delivered', 'canceled');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "payment_link" TEXT NOT NULL DEFAULT '',
    "payment_id" TEXT NOT NULL DEFAULT '',
    "status" "OrderStatusEnumType" NOT NULL DEFAULT 'pending',
    "pdvId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemsOnOrder" (
    "quantity" INTEGER NOT NULL,
    "pricePerItem" DOUBLE PRECISION NOT NULL,
    "itemId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemsOnOrder_pkey" PRIMARY KEY ("orderId","itemId")
);

-- CreateTable
CREATE TABLE "ItemsOnPDV" (
    "quantity" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL,
    "pdvId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemsOnPDV_pkey" PRIMARY KEY ("pdvId","itemId")
);

-- CreateTable
CREATE TABLE "Items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_id_key" ON "Order"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_payment_id_key" ON "Order"("payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "ItemsOnOrder_orderId_key" ON "ItemsOnOrder"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemsOnPDV_pdvId_key" ON "ItemsOnPDV"("pdvId");

-- CreateIndex
CREATE UNIQUE INDEX "Items_id_key" ON "Items"("id");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_pdvId_fkey" FOREIGN KEY ("pdvId") REFERENCES "PDV"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemsOnOrder" ADD CONSTRAINT "ItemsOnOrder_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemsOnOrder" ADD CONSTRAINT "ItemsOnOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemsOnPDV" ADD CONSTRAINT "ItemsOnPDV_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemsOnPDV" ADD CONSTRAINT "ItemsOnPDV_pdvId_fkey" FOREIGN KEY ("pdvId") REFERENCES "PDV"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
