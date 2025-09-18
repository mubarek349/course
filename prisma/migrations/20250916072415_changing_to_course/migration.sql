/*
  Warnings:

  - Added the required column `courseId` to the `VideoQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `videoquestion` DROP FOREIGN KEY `VideoQuestion_subActivityId_fkey`;

-- AlterTable
ALTER TABLE `videoquestion` ADD COLUMN `courseId` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL DEFAULT 'course',
    MODIFY `subActivityId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `VideoQuestion_courseId_idx` ON `VideoQuestion`(`courseId`);

-- AddForeignKey
ALTER TABLE `VideoQuestion` ADD CONSTRAINT `VideoQuestion_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
