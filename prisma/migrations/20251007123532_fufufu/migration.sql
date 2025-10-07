/*
  Warnings:

  - Added the required column `currency` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `birrPrice` DECIMAL(65, 30) NULL,
    ADD COLUMN `currency` VARCHAR(191) NOT NULL,
    ADD COLUMN `dolarPrice` DECIMAL(65, 30) NULL;
