-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'manager', 'instructor', 'seller', 'affiliate', 'student', 'scanner', 'employee', 'tester', 'ustaz');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('pending', 'active', 'inactive');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Female', 'Male');

-- CreateEnum
CREATE TYPE "StudentType" AS ENUM ('live', 'online');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('paid', 'unpaid');

-- CreateEnum
CREATE TYPE "Lang" AS ENUM ('am', 'en');

-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('beginner', 'intermediate', 'advanced');

-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('unpaid', 'paid');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "username" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT '',
    "firstName" TEXT NOT NULL DEFAULT '',
    "fatherName" TEXT NOT NULL DEFAULT '',
    "lastName" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT '',
    "region" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "idCard" TEXT,
    "gender" "Gender",
    "age" INTEGER,
    "chatId" BIGINT,
    "lang" "Lang" NOT NULL DEFAULT 'am',
    "code" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'active',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permission" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAm" TEXT NOT NULL,
    "aboutEn" TEXT NOT NULL,
    "aboutAm" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "video" TEXT NOT NULL,
    "pdfData" TEXT,
    "courseMaterials" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "price" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ETB',
    "level" "CourseLevel" NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'Amharic',
    "duration" TEXT NOT NULL,
    "accessEn" TEXT NOT NULL DEFAULT 'Access on mobile, computer',
    "accessAm" TEXT NOT NULL DEFAULT 'በሞባይል ፣ በኮምፒተር ላይ መጠቀም',
    "certificate" BOOLEAN NOT NULL DEFAULT false,
    "instructorRate" DECIMAL(65,30) NOT NULL,
    "sellerRate" DECIMAL(65,30) NOT NULL,
    "affiliateRate" DECIMAL(65,30) NOT NULL,
    "channelId" TEXT,
    "instructorId" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requirement" (
    "id" TEXT NOT NULL,
    "requirementEn" TEXT NOT NULL,
    "requirementAm" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "Requirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseFor" (
    "id" TEXT NOT NULL,
    "courseForEn" TEXT NOT NULL,
    "courseForAm" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "CourseFor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAm" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubActivity" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAm" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "video" TEXT NOT NULL,

    CONSTRAINT "SubActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question" (
    "id" TEXT NOT NULL,
    "activityId" TEXT,
    "courseId" TEXT,
    "question" TEXT NOT NULL,
    "answerExplanation" TEXT,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionOption" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "option" TEXT NOT NULL,

    CONSTRAINT "questionOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionAnswer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answerId" TEXT NOT NULL,

    CONSTRAINT "questionAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentQuiz" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "isFinalExam" BOOLEAN NOT NULL DEFAULT false,
    "takenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "studentQuiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentQuizAnswer" (
    "id" TEXT NOT NULL,
    "studentQuizId" TEXT NOT NULL,
    "selectedOptionId" TEXT NOT NULL,

    CONSTRAINT "studentQuizAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studentProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subActivityId" TEXT NOT NULL,
    "isStarted" BOOLEAN NOT NULL DEFAULT true,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studentProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" TEXT NOT NULL,
    "chatId" BIGINT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'unpaid',
    "totalPrice" DECIMAL(65,30) NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ETB',
    "instructorIncome" DECIMAL(65,30) NOT NULL,
    "tx_ref" TEXT,
    "img" TEXT NOT NULL,
    "reference" TEXT,
    "code" TEXT,
    "income" DECIMAL(65,30),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncomeRate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "rate" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "IncomeRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transfer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "reference" TEXT NOT NULL,
    "income" INTEGER NOT NULL,
    "status" "TransferStatus" NOT NULL DEFAULT 'unpaid',

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "code" INTEGER NOT NULL,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoQuestion" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "subActivityId" TEXT,
    "question" TEXT NOT NULL,
    "timestamp" INTEGER,
    "type" TEXT NOT NULL DEFAULT 'course',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoResponse" (
    "id" TEXT NOT NULL,
    "videoQuestionId" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "anouncementDescription" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_chatId_key" ON "User"("chatId");

-- CreateIndex
CREATE UNIQUE INDEX "User_code_key" ON "User"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Course_channelId_key" ON "Course"("channelId");

-- CreateIndex
CREATE INDEX "question_activityId_idx" ON "question"("activityId");

-- CreateIndex
CREATE INDEX "questionOption_questionId_idx" ON "questionOption"("questionId");

-- CreateIndex
CREATE INDEX "questionAnswer_answerId_idx" ON "questionAnswer"("answerId");

-- CreateIndex
CREATE INDEX "questionAnswer_questionId_idx" ON "questionAnswer"("questionId");

-- CreateIndex
CREATE INDEX "studentQuiz_questionId_idx" ON "studentQuiz"("questionId");

-- CreateIndex
CREATE INDEX "studentQuiz_userId_idx" ON "studentQuiz"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "studentQuiz_userId_questionId_isFinalExam_key" ON "studentQuiz"("userId", "questionId", "isFinalExam");

-- CreateIndex
CREATE INDEX "studentQuizAnswer_selectedOptionId_idx" ON "studentQuizAnswer"("selectedOptionId");

-- CreateIndex
CREATE INDEX "studentQuizAnswer_studentQuizId_idx" ON "studentQuizAnswer"("studentQuizId");

-- CreateIndex
CREATE UNIQUE INDEX "studentQuizAnswer_studentQuizId_selectedOptionId_key" ON "studentQuizAnswer"("studentQuizId", "selectedOptionId");

-- CreateIndex
CREATE INDEX "studentProgress_subActivityId_idx" ON "studentProgress"("subActivityId");

-- CreateIndex
CREATE INDEX "studentProgress_userId_idx" ON "studentProgress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "studentProgress_userId_subActivityId_key" ON "studentProgress"("userId", "subActivityId");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_chatId_key" ON "Channel"("chatId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_tx_ref_key" ON "Order"("tx_ref");

-- CreateIndex
CREATE INDEX "VideoQuestion_courseId_idx" ON "VideoQuestion"("courseId");

-- CreateIndex
CREATE INDEX "VideoQuestion_studentId_idx" ON "VideoQuestion"("studentId");

-- CreateIndex
CREATE INDEX "VideoQuestion_subActivityId_idx" ON "VideoQuestion"("subActivityId");

-- CreateIndex
CREATE INDEX "VideoResponse_videoQuestionId_idx" ON "VideoResponse"("videoQuestionId");

-- CreateIndex
CREATE INDEX "VideoResponse_instructorId_idx" ON "VideoResponse"("instructorId");

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseFor" ADD CONSTRAINT "CourseFor_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubActivity" ADD CONSTRAINT "SubActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionOption" ADD CONSTRAINT "questionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionAnswer" ADD CONSTRAINT "questionAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionAnswer" ADD CONSTRAINT "questionAnswer_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "questionOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentQuiz" ADD CONSTRAINT "studentQuiz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentQuiz" ADD CONSTRAINT "studentQuiz_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentQuizAnswer" ADD CONSTRAINT "studentQuizAnswer_studentQuizId_fkey" FOREIGN KEY ("studentQuizId") REFERENCES "studentQuiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentQuizAnswer" ADD CONSTRAINT "studentQuizAnswer_selectedOptionId_fkey" FOREIGN KEY ("selectedOptionId") REFERENCES "questionOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentProgress" ADD CONSTRAINT "studentProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studentProgress" ADD CONSTRAINT "studentProgress_subActivityId_fkey" FOREIGN KEY ("subActivityId") REFERENCES "SubActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomeRate" ADD CONSTRAINT "IncomeRate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomeRate" ADD CONSTRAINT "IncomeRate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoQuestion" ADD CONSTRAINT "VideoQuestion_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoQuestion" ADD CONSTRAINT "VideoQuestion_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoResponse" ADD CONSTRAINT "VideoResponse_videoQuestionId_fkey" FOREIGN KEY ("videoQuestionId") REFERENCES "VideoQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoResponse" ADD CONSTRAINT "VideoResponse_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
