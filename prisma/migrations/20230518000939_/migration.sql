/*
  Warnings:

  - A unique constraint covering the columns `[login]` on the table `PDV` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ItemsOnPDV_pdvId_key";

-- CreateIndex
CREATE UNIQUE INDEX "PDV_login_key" ON "PDV"("login");
