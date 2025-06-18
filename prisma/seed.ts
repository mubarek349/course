import prisma from "@/lib/db";

(async () => {
  try {
    await prisma.user.create({
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
    const channel01 = await prisma.channel.create({
        data: { chatId: -1002346735030, title: "Quran" },
      }),
      channel02 = await prisma.channel.create({
        data: { chatId: -1002465362272, title: "Hadith" },
      });
    await prisma.course.create({
      data: {
        titleEn:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque odio, maxime quibusdam mollitia",
        titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
        instructorId: instructor.id,
        aboutEn:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam blanditiis, dolore quas mollitia eum asperiores saepe! Aperiam dolor distinctio fugit, ratione neque autem necessitatibus praesentium illum, corporis atque corrupti dolore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam blanditiis, dolore quas mollitia eum asperiores saepe! Aperiam dolor distinctio fugit, ratione neque autem necessitatibus praesentium illum, corporis atque corrupti dolore.",
        aboutAm:
          "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል (ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል (ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል (ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል (ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል (ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል (ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል (ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል (ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል ",
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
        activity: {
          create: [
            {
              titleEn: "What you will learn What you will learn",
              titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
              subActivity: {
                createMany: {
                  data: [
                    {
                      titleEn:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit",
                      titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
                    },
                    {
                      titleEn:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit",
                      titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
                    },
                    {
                      titleEn:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit",
                      titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
                    },
                  ],
                },
              },
            },
            {
              titleEn: "What you will learn What you will learn",
              titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
              subActivity: {
                createMany: {
                  data: [
                    {
                      titleEn:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit",
                      titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
                    },
                    {
                      titleEn:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit",
                      titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
                    },
                    {
                      titleEn:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit",
                      titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
                    },
                  ],
                },
              },
            },
            {
              titleEn: "What you will learn What you will learn",
              titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
              subActivity: {
                createMany: {
                  data: [
                    {
                      titleEn:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit",
                      titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
                    },
                    {
                      titleEn:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit",
                      titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
                    },
                    {
                      titleEn:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit",
                      titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
                    },
                  ],
                },
              },
            },
          ],
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
    await prisma.course.create({
      data: {
        titleEn:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque odio, maxime quibusdam mollitia",
        titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
        instructorId: instructor.id,
        aboutEn:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam blanditiis, dolore quas mollitia eum asperiores saepe! Aperiam dolor distinctio fugit, ratione neque autem necessitatibus praesentium illum, corporis atque corrupti dolore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam blanditiis, dolore quas mollitia eum asperiores saepe! Aperiam dolor distinctio fugit, ratione neque autem necessitatibus praesentium illum, corporis atque corrupti dolore.",
        aboutAm:
          "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል (ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል (ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል (ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል (ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል (ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል (ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል (ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል (ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል ",
        thumbnail: "https://img.youtube.com/vi/tak7aLltLuU/0.jpg",
        video:
          "https://www.youtube.com/embed/tak7aLltLuU?si=pF6IhoZmLLjZdFjF&amp;controls=0",
        price: 100,
        currency: "ETB",
        level: "beginner",
        language: "amharic",
        duration: "00:04:00",
        certificate: true,
        instructorRate: 10,
        sellerRate: 10,
        affiliateRate: 5,
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
        activity: {
          create: [
            {
              titleEn: "What you will learn What you will learn",
              titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
              subActivity: {
                createMany: {
                  data: [
                    {
                      titleEn:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit",
                      titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
                    },
                    {
                      titleEn:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit",
                      titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
                    },
                    {
                      titleEn:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit",
                      titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
                    },
                  ],
                },
              },
            },
            {
              titleEn: "What you will learn What you will learn",
              titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
              subActivity: {
                createMany: {
                  data: [
                    {
                      titleEn:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit",
                      titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
                    },
                    {
                      titleEn:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit",
                      titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
                    },
                    {
                      titleEn:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit",
                      titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
                    },
                  ],
                },
              },
            },
            {
              titleEn: "What you will learn What you will learn",
              titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
              subActivity: {
                createMany: {
                  data: [
                    {
                      titleEn:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit",
                      titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
                    },
                    {
                      titleEn:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit",
                      titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
                    },
                    {
                      titleEn:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit",
                      titleAm: "(ቃኢዳ) ክፍል አንድ የአረብኛ ፊደላት || ዳረል ኩብራ የቁርዐን ማዕከል",
                    },
                  ],
                },
              },
            },
          ],
        },
        channelId: channel02.id,
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

    console.log("SEED SUCCESS");
  } catch (error) {
    console.log("SEED ERROR :: ", error);
  }
})();
