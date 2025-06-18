/*
  Warnings:

  - Added the required column `order` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `SubActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `video` to the `SubActivity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `activity` ADD COLUMN `order` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `subactivity` ADD COLUMN `order` INTEGER NOT NULL,
    ADD COLUMN `video` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `question` (
    `id` VARCHAR(191) NOT NULL,
    `activityId` VARCHAR(191) NOT NULL,
    `question` VARCHAR(191) NOT NULL,

    INDEX `question_activityId_idx`(`activityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `questionOption` (
    `id` VARCHAR(191) NOT NULL,
    `questionId` VARCHAR(191) NOT NULL,
    `option` VARCHAR(191) NOT NULL,

    INDEX `questionOption_questionId_idx`(`questionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `questionAnswer` (
    `id` VARCHAR(191) NOT NULL,
    `questionId` VARCHAR(191) NOT NULL,
    `answerId` VARCHAR(191) NOT NULL,

    INDEX `questionAnswer_answerId_idx`(`answerId`),
    INDEX `questionAnswer_questionId_idx`(`questionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `studentQuiz` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `questionId` VARCHAR(191) NOT NULL,
    `takenAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `studentQuiz_questionId_idx`(`questionId`),
    INDEX `studentQuiz_userId_idx`(`userId`),
    UNIQUE INDEX `studentQuiz_userId_questionId_key`(`userId`, `questionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `studentQuizAnswer` (
    `id` VARCHAR(191) NOT NULL,
    `studentQuizId` VARCHAR(191) NOT NULL,
    `selectedOptionId` VARCHAR(191) NOT NULL,

    INDEX `studentQuizAnswer_selectedOptionId_idx`(`selectedOptionId`),
    INDEX `studentQuizAnswer_studentQuizId_idx`(`studentQuizId`),
    UNIQUE INDEX `studentQuizAnswer_studentQuizId_selectedOptionId_key`(`studentQuizId`, `selectedOptionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `studentProgress` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `subActivityId` VARCHAR(191) NOT NULL,
    `isStarted` BOOLEAN NOT NULL DEFAULT true,
    `isCompleted` BOOLEAN NOT NULL DEFAULT false,
    `completedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `studentProgress_subActivityId_idx`(`subActivityId`),
    INDEX `studentProgress_userId_idx`(`userId`),
    UNIQUE INDEX `studentProgress_userId_subActivityId_key`(`userId`, `subActivityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `question` ADD CONSTRAINT `question_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `Activity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `questionOption` ADD CONSTRAINT `questionOption_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `questionAnswer` ADD CONSTRAINT `questionAnswer_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `questionAnswer` ADD CONSTRAINT `questionAnswer_answerId_fkey` FOREIGN KEY (`answerId`) REFERENCES `questionOption`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `studentQuiz` ADD CONSTRAINT `studentQuiz_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `studentQuiz` ADD CONSTRAINT `studentQuiz_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `studentQuizAnswer` ADD CONSTRAINT `studentQuizAnswer_studentQuizId_fkey` FOREIGN KEY (`studentQuizId`) REFERENCES `studentQuiz`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `studentQuizAnswer` ADD CONSTRAINT `studentQuizAnswer_selectedOptionId_fkey` FOREIGN KEY (`selectedOptionId`) REFERENCES `questionOption`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `studentProgress` ADD CONSTRAINT `studentProgress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `studentProgress` ADD CONSTRAINT `studentProgress_subActivityId_fkey` FOREIGN KEY (`subActivityId`) REFERENCES `SubActivity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
