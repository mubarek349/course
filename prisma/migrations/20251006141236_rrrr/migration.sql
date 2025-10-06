/*
  Warnings:

  - You are about to drop the column `birrPrice` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `dolarPrice` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `birrPrice`,
    DROP COLUMN `dolarPrice`;
