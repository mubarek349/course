-- AlterTable
ALTER TABLE `coursefor` MODIFY `courseForEn` TEXT NOT NULL,
    MODIFY `courseForAm` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `question` MODIFY `question` TEXT NOT NULL,
    MODIFY `answerExplanation` TEXT NULL;

-- AlterTable
ALTER TABLE `questionoption` MODIFY `option` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `requirement` MODIFY `requirementEn` TEXT NOT NULL,
    MODIFY `requirementAm` TEXT NOT NULL;
