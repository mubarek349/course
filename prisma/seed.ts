import prisma from "@/lib/db";

(async () => {
  try {
    // Create users
    const manager = await prisma.user.create({
      data: {
        role: "manager",
        firstName: "abdelkerim",
        fatherName: "ahmed",
        lastName: "mohammed",
        phoneNumber: "0945467891",
        password:
          "$2a$12$Wt8Q9Q23DmCEiVPucCrTcOTxtYRkNUhK5MoyaJotYBc1RbJdUbk0W",
        permission: {
          create: { permission: "manager" },
        },
      },
    });

    const instructor = await prisma.user.create({
      data: {
        role: "instructor",
        firstName: "Fuad",
        fatherName: "Abdurahaman",
        lastName: "Kalid",
        phoneNumber: "0910203040",
        password:
          "$2a$12$MdcOCCZBmPTAfKFbke.ObOT9gED00eqsdQEfttlrQixjmjJMWR/wW",
        status: "active",
      },
    });

    const seller = await prisma.user.create({
      data: {
        role: "seller",
        firstName: "abubeker",
        fatherName: "ahmed",
        lastName: "mohammed",
        phoneNumber: "0945467893",
        password:
          "$2a$12$MdcOCCZBmPTAfKFbke.ObOT9gED00eqsdQEfttlrQixjmjJMWR/wW",
        status: "active",
      },
    });

    const affiliate = await prisma.user.create({
      data: {
        role: "affiliate",
        firstName: "ahmed",
        fatherName: "ahmed",
        lastName: "mohammed",
        phoneNumber: "0933807447",
        password:
          "$2a$12$XXbCwSgHeM0s63IRM4B6ROYNBWikkPxk3sHsrPRSoO0.EOl6dLvtm",
        status: "active",
      },
    });

    // Create channels
    const channel01 = await prisma.channel.create({
      data: { chatId: -1002346735030, title: "Quran" },
    });
    await prisma.channel.create({
      data: { chatId: -1002465362272, title: "Hadith" },
    });

    // Create a course (used for activity/question seeding below)
    const course = await prisma.course.create({
      data: {
        titleEn:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque odio, maxime quibusdam mollitia",
        titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
        instructorId: instructor.id,
        aboutEn:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam blanditiis, dolore quas mollitia eum asperiores saepe! Aperiam dolor distinctio fugit, ratione neque autem necessitatibus praesentium illum, corporis atque corrupti dolore.",
        aboutAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል ...",
        thumbnail: "https://img.youtube.com/vi/tak7aLltLuU/0.jpg",
        video:
          "https://www.youtube.com/embed/tak7aLltLuU?si=pF6IhoZmLLjZdFjF&amp;controls=0",
        price: 100,
        currency: "ETB",
        level: "beginner",
        language: "amharic",
        duration: "04:00",
        certificate: true,
        instructorRate: 10,
        sellerRate: 10,
        affiliateRate: 10,
        requirement: {
          createMany: {
            data: [
              {
                requirementEn:
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit",
                requirementAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
              },
              {
                requirementEn:
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit",
                requirementAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
              },
              {
                requirementEn:
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit",
                requirementAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
              },
            ],
          },
        },
        courseFor: {
          createMany: {
            data: [
              {
                courseForEn:
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit",
                courseForAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
              },
              {
                courseForEn:
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit",
                courseForAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
              },
              {
                courseForEn:
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit",
                courseForAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
              },
            ],
          },
        },
        channelId: channel01.id,
        incomeRate: {
          createMany: {
            data: [
              { userId: seller.id, rate: 10 },
              { userId: affiliate.id, rate: 5 },
            ],
          },
        },
      },
    });

    // Create an activity with subActivities for quiz
    const activity = await prisma.activity.create({
      data: {
        titleEn: "Introduction to Math",
        titleAm: "የማትማት መግቢያ",
        courseId: course.id,
        order: 1,
        subActivity: {
          create: [
            {
              titleEn: "Addition Basics",
              titleAm: "የመደመር መሠረት",
              order: 1,
              video: "https://example.com/video1.mp4",
            },
            {
              titleEn: "Subtraction Basics",
              titleAm: "የመቀነስ መሠረት",
              order: 2,
              video: "https://example.com/video2.mp4",
            },
          ],
        },
      },
      include: { subActivity: true },
    });

    // Use the first subActivity for studentProgress
    const subActivity = activity.subActivity[0];

    // Create a quiz question
    const question = await prisma.question.create({
      data: {
        activityId: activity.id,
        question: "What is 2 + 2?",
        questionOptions: {
          create: [{ option: "3" }, { option: "4" }, { option: "5" }],
        },
      },
      include: { questionOptions: true },
    });

    // Create correct answer (option '4')
    const correctOption = question.questionOptions.find(
      (opt) => opt.option === "4"
    );
    await prisma.questionAnswer.create({
      data: {
        questionId: question.id,
        answerId: correctOption!.id,
      },
    });

    // Use the manager as the student for quiz/progress
    await prisma.studentQuiz.create({
      data: {
        userId: manager.id,
        questionId: question.id,
        studentQuizAnswers: {
          create: [
            {
              selectedOptionId: correctOption!.id,
            },
          ],
        },
      },
    });

    await prisma.studentProgress.create({
      data: {
        userId: manager.id,
        subActivityId: subActivity.id,
        isStarted: true,
        isCompleted: false,
      },
    });

    console.log("SEED SUCCESS");
  } catch (error) {
    console.log("SEED ERROR :: ", error);
  } finally {
    await prisma.$disconnect();
  }
})();
