/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ItemsOnOrder` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ItemsOnOrder` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ItemsOnPDV` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ItemsOnPDV` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Order_payment_id_key";

-- AlterTable
ALTER TABLE "ItemsOnOrder" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ItemsOnPDV" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
