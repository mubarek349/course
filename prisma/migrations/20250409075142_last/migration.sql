/*
  Warnings:

  - Added the required column `instructorIncome` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_userId_fkey`;

-- DropForeignKey
ALTER TABLE `permission` DROP FOREIGN KEY `Permission_userId_fkey`;

-- DropForeignKey
ALTER TABLE `transfer` DROP FOREIGN KEY `Transfer_userId_fkey`;

-- DropIndex
DROP INDEX `Order_courseId_fkey` ON `order`;

-- DropIndex
DROP INDEX `Order_userId_fkey` ON `order`;

-- DropIndex
DROP INDEX `Permission_userId_fkey` ON `permission`;

-- DropIndex
DROP INDEX `Transfer_userId_fkey` ON `transfer`;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `instructorIncome` DECIMAL(65, 30) NOT NULL;

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transfer` ADD CONSTRAINT `Transfer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
