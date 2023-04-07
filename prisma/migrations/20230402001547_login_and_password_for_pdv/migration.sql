/*
  Warnings:

  - You are about to drop the column `ownerEmail` on the `PDV` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `PDV` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `login` to the `PDV` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `PDV` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PDV_ownerEmail_key";

-- AlterTable
ALTER TABLE "PDV" DROP COLUMN "ownerEmail",
ADD COLUMN     "login" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PDV_id_key" ON "PDV"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
