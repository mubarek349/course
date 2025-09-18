/*
  Warnings:

  - A unique constraint covering the columns `[userId,questionId,isFinalExam]` on the table `studentQuiz` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `studentQuiz_userId_questionId_key` ON `studentquiz`;

-- CreateIndex
CREATE UNIQUE INDEX `studentQuiz_userId_questionId_isFinalExam_key` ON `studentQuiz`(`userId`, `questionId`, `isFinalExam`);
