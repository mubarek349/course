-- AlterTable
ALTER TABLE `question` ADD COLUMN `answerExplanation` VARCHAR(191) NULL,
    ADD COLUMN `courseId` VARCHAR(191) NULL,
    MODIFY `activityId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `question` ADD CONSTRAINT `question_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
