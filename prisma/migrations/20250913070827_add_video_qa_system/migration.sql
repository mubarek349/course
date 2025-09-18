-- CreateTable
CREATE TABLE `VideoQuestion` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `subActivityId` VARCHAR(191) NOT NULL,
    `question` TEXT NOT NULL,
    `timestamp` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `VideoQuestion_subActivityId_idx`(`subActivityId`),
    INDEX `VideoQuestion_studentId_idx`(`studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VideoResponse` (
    `id` VARCHAR(191) NOT NULL,
    `videoQuestionId` VARCHAR(191) NOT NULL,
    `instructorId` VARCHAR(191) NOT NULL,
    `response` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `VideoResponse_videoQuestionId_idx`(`videoQuestionId`),
    INDEX `VideoResponse_instructorId_idx`(`instructorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VideoQuestion` ADD CONSTRAINT `VideoQuestion_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoQuestion` ADD CONSTRAINT `VideoQuestion_subActivityId_fkey` FOREIGN KEY (`subActivityId`) REFERENCES `SubActivity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoResponse` ADD CONSTRAINT `VideoResponse_videoQuestionId_fkey` FOREIGN KEY (`videoQuestionId`) REFERENCES `VideoQuestion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoResponse` ADD CONSTRAINT `VideoResponse_instructorId_fkey` FOREIGN KEY (`instructorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
