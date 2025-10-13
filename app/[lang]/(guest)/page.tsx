"use client";

import Image from "next/image";
// import Link from "next/link";
import React, { useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { sendMessage } from "@/lib/action/message";
import { Button, Form, Input, Link, Textarea } from "@heroui/react";
import { useParams } from "next/navigation";
import { CButton } from "@/components/heroui";
import useAction from "@/hooks/useAction";

export default function Page() {
  useEffect(() => {
    toast.dismiss();
  }, []);

  return (
    <div className="h-full w- overflow-x-hidden overflow-y-scroll scroll-smooth snap-y snap-mandatory">
      <HeroPage />
      <About />
      <Service />
      <About2 />
      <Information />
      <Service2 />
      {/* <Testimonial /> */}
      <Contact />
      {/* <Footer /> */}
    </div>
  );
}

function HeroPage() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en";
  return (
    <div className="relative h-dvh md:p-48 grid snap-start ">
      <motion.div
        initial={{ opacity: 0, y: "-100%" }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, type: "tween" },
        }}
        className="grid place-content-center "
      >
        <div className="text-center bg-gradient-to-l from-primary-600 via-40%5 via-secondary-600 to-primary-600 bg-clip-text text-transparent">
          <p className="text-4xl md:text-6xl font-[900] [text-shadow:0_0_10px_rgba(232,121,249-)]">
            {lang == "en"
              ? "The best among you is he who learns the Quran and teaches it."
              : "ከእናንተ ውስጥ በላጩ ቁርአንን ተምሮ ያስተማረ ነው"}
          </p>
          <p className="pl-5 text-xl text-fuchsia-600 italic before:content-['~'] before:pr-2 ">
            {lang == "en" ? "The Messenger" : "ረሱል"} ﷺ
          </p>
        </div>
        <div className="size-fit place-self-center pt-20 flex max-md:flex-col gap-5 ">
          {/* <Button
            as={Link}
            href="/"
            color="primary"
            variant="flat"
            className="w-60"
            >
            {lang == "en" ? "Online Education" : "ኦንላይን ትምህርት"}
            </Button> */}
          <CButton
            as={Link}
            href={`/${lang}/#about`}
            color="primary"
            variant="flat"
            className="w-60"
          >
            {lang == "en" ? "Learn More" : "የበለጠ ለማወቅ"}
          </CButton>
          <CButton
            as={Link}
            href={`/${lang}/course`}
            color="primary"
            variant="shadow"
            className="w-60"
          >
            {lang == "en" ? "Education" : "ትምህርት"}
          </CButton>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: "-100%" }}
        whileInView={{
          y: 0,
          transition: { delay: 0.3, duration: 3, type: "spring", bounce: 0.4 },
        }}
        className="absolute top-0 left-0 md:left-10 h-64 md:h-[29rem] grid grid-rows-[1fr_auto] [&>*:last-child]:size-20"
      >
        <div className="h-full w-[0.5px] place-self-center bg-secondary-600" />
        <Image
          src={"/bulb1.png"}
          alt=""
          width={1000}
          height={1000}
          className=""
        />
      </motion.div>
      <motion.div
        initial={{ y: "-100%" }}
        whileInView={{
          y: 0,
          transition: { duration: 3, type: "spring", bounce: 0.4 },
        }}
        className="absolute top-0 left-12 md:left-40 h-40 md:h-[25rem] grid grid-rows-[1fr_auto] [&>*:last-child]:size-20"
      >
        <div className="h-full w-[0.5px] place-self-center bg-secondary-600" />
        <Image
          src={"/bulb1.png"}
          alt=""
          width={1000}
          height={1000}
          className=""
        />
      </motion.div>
      <motion.div
        initial={{ y: "-100%" }}
        whileInView={{
          y: 0,
          transition: { delay: 0.5, duration: 3, type: "spring", bounce: 0.4 },
        }}
        className="absolute top-0 left-20 md:left-20 h-56 md:h-[20rem] grid grid-rows-[1fr_auto] [&>*:last-child]:size-20"
      >
        <div className="h-full w-[0.5px] place-self-center bg-secondary-600" />
        <Image
          src={"/bulb1.png"}
          alt=""
          width={1000}
          height={1000}
          className=""
        />
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        exit={{ scale: 0 }}
        whileInView={{
          scale: 1,
          transition: {
            delay: 0.5,
            duration: 1.5,
            type: "spring",
            bounce: 0.4,
          },
        }}
        className="absolute bottom-5 md:bottom-10 -right-5 md:right-20  "
      >
        <Image
          src={"/bulb2.png"}
          alt=""
          width={1000}
          height={1000}
          className="size-40 md:size-60"
        />
      </motion.div>
    </div>
  );
}

function About() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en";
  return (
    <div
      id="about"
      className="relative p-4 md:p-10 flex max-md:flex-col-reverse gap-4 md:gap-10 snap-start "
    >
      <div className="flex-1 p-2 md:p-10 grid place-content-center autoShow-bottom">
        <Image
          src={"/quran2.png"}
          alt=""
          height={1000}
          width={1000}
          className="w-96 aspect-square  "
        />
      </div>
      <div className="flex-1 h-fit place-self-center p-10 bg-background/50 backdrop-blur-3xl rounded-xl shadow-[0_0_10px_-5px_#0ea5e9] grid gap-5 place-content-center autoShow-bottom">
        <p className="content-center text-center text-xl  ">
          {lang == "en"
            ? "Darul Kubra Quran Center has appointed qualified Hafizul Quran teachers and invites you to come and learn the Quran with us from anywhere. The way you learn is very easy and convenient for beginners, including Tajweed and Hifz. Learn your Quran with the help of various video files and by interacting directly with the teacher. We will provide you with a certificate of proficiency upon completion."
            : "ዳሩል ኩብራ የቁርአን ማእከል ብቁ የሆኑ ሃፊዘል ቁርአን ኡስታዞችን መድቦ በማንኛውም ቦታ ሆነው ኑ ቁርአንን ከኛ ጋር ይማሩ ይላል። የሚቀሩበት መንገድ ከጀማሪ እሰከ ተጅዊድ እና ሂፍዝን ጨምሮ ለሚማሩ በጣም ቀላል እና  ምቹ ነው። በተለያዩ ቪድዮ ፋይሎች በመታገዘ እና በቀጥታ ከ ኡስታዙ ጋር በመገናኘት ቁርአንዎን ይማሩ። ሲጨርሱ የብቃት ማረጋገጫ ሰርትፍኬት እንሰጣለን።"}
        </p>
      </div>
    </div>
  );
}

function Service() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en";
  return (
    <div className="py-40 px-4 md:px-40 md:h-dvh flex max-md:flex-col gap-10 snap-start">
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{
          scale: 1,
          transition: { delay: 0.3, duration: 1, type: "spring", bounce: 0.3 },
        }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 0 5px #0ea5e9",
          transition: { duration: 1, type: "spring", bounce: 0.3 },
        }}
        className="max-md:h-[50dvh] md:flex-1 rounded-xl overflow-hidden bg-[url('/graduation.png')] bg-no-repeat bg-contain bg-center grid justify-center items-end  "
      >
        <div className="pt-20 px-5 bg-gradient-to-t from-primary via-primary/80 to-transparent text-center text-background ">
          <p className="text-xl font-extrabold">
            {lang == "en"
              ? "You will receive a certificate of competency."
              : "የብቃት ማረጋገጫ ሰርተፍኬት ያገኛሉ"}
          </p>
          <p className="py-5">
            {lang == "en"
              ? "We will provide you with a certificate of proficiency upon completion of your Quran lessons."
              : "የቁርዐን ትምህርቶን ሲጨርሱ የብቃት ማረጋገጫ ሰርትፍኬት እንሰጣለን"}
          </p>
        </div>
      </motion.div>
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{
          scale: 1,
          transition: { delay: 0.3, duration: 1, type: "spring", bounce: 0.3 },
        }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 0 5px #0ea5e9",
          transition: { duration: 1, type: "spring", bounce: 0.3 },
        }}
        className="max-md:h-[50dvh] md:flex-1 rounded-xl overflow-hidden bg-[url('/star.png')] bg-no-repeat bg-contain bg-center grid justify-center items-end  "
      >
        <div className="pt-20 px-5 bg-gradient-to-t from-primary via-primary/80 to-transparent text-center text-background ">
          <p className="text-xl font-extrabold">
            {lang == "en"
              ? "Qualified Quran Hafiz Teachers"
              : "ብቁ ቁርዐን ሀፊዝ ዑስታዞች"}
          </p>
          <p className="py-5">
            {lang == "en"
              ? "Darul Kubra Quran Center has appointed qualified Hafizul Quran teachers and invites you to come and learn the Quran with us from anywhere"
              : "ዳሩል ኩብራ የቁርአን ማእከል ብቁ የሆኑ ሃፊዘል ቁርአን ኡስታዞችን መድቦ በማንኛውም ቦታ ሆነው ኑ ቁርአንን ከኛ ጋር ይማሩ ይላል"}
          </p>
        </div>
      </motion.div>
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{
          scale: 1,
          transition: { delay: 0.3, duration: 1, type: "spring", bounce: 0.3 },
        }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 0 5px #0ea5e9",
          transition: { duration: 1, type: "spring", bounce: 0.3 },
        }}
        className="max-md:h-[50dvh] md:flex-1 rounded-xl overflow-hidden bg-[url('/operator.png')] bg-no-repeat bg-contain bg-center grid justify-center items-end  "
      >
        <div className="pt-20 px-5 bg-gradient-to-t from-primary via-primary/80 to-transparent text-center text-background ">
          <p className="text-xl font-extrabold">
            {lang == "en"
              ? "One-to-one educational service"
              : "አንድ ለ አንድ የትምህርት አገልግሎት"}
          </p>
          <p className="py-5">
            {lang == "en"
              ? "Learn your Quran with the help of various video files and by interacting directly with the teacher"
              : "በተለያዩ ቪድዮ ፋይሎች በመታገዘ እና በቀጥታ ከ ኡስታዙ ጋር በመገናኘት ቁርአንዎን ይማሩ"}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function About2() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en";
  return (
    <div className="relative h-dvh p-4 md:p-10 md:pt-32 bg-[url('/who-reads-quran.png')] bg-no-repeat bg-[65%_10%] bg-cover border-b-4 border-primary grid snap-start ">
      <div className="md:w-1/2 h-fit py-4 md:p-10 bg-background/50 backdrop-blur rounded-xl border border-background shadow-[0_0_10px_-5px_#0ea5e9] grid place-content-center autoShow-bottom">
        <p className="pb-2 md:pb-10 font-[900] md:text-3xl text-center">
          {lang == "en"
            ? "Now is the time to learn the Quran"
            : "ቁርዓንን መማሪያ ግዜዎ አሁን ነው"}
          !
        </p>
        <p className="pb-2 md:pb-10 text-center">
          {lang == "en"
            ? 'Under the motto "Success Village", qualified teachers have been assigned to introduce you to the recitation of the Quran without taking up time from your work or studies. They have provided a way for you to read the Quran online in a short time with various options, just using the phone in your hand.'
            : 'ከስራዎትም ሆነ ከትምህርቶ ጊዜ በማይሻማ መልኩ "የስኬት መንደር" በሚል መሪ ቃል እርሶዎን ከቁርአን ንባብ ጋር ለማስተዋወቅ ብቁ የሆኑ ኡስታዞች ተመድቦልዎ በእጆዎ ያለውን ስልክ በመጠቀም ብቻ በተለያዩ አማራጮች ቁርአንን በአጭር ጊዜ ዉስጥ ማንበብ እንዲችሉ ኦንላይን መቅራት የሚችሉበትን መንገድ አመቻችቷል'}
        </p>
        <p className="pb-2 md:pb-10 font-extrabold italic text-center">
          {lang == "en" ? "This is not only" : "ይሄ ብቻ አይደለም"}
        </p>
        <p className="pb-2 md:pb-10 text-center">
          {lang == "en"
            ? "We also provide various basic deen lessons."
            : "የተለያዩ መሰረታዊ የዲን ትምህርቶችንም ጎን ሉጎን እንሰጣለን"}
        </p>
      </div>
      <motion.div className="absolute -bottom-[5rem] md:-bottom-[10rem] inset-x-0 mx-auto size-40 md:size-80 grid place-content-center ">
        <div className="size-20 md:size-40 bg-background/80 backdrop-blur rounded-full grid place-content-center ">
          <Image
            src={"/darulkubra.png"}
            alt=""
            height={1000}
            width={1000}
            className="size-14 md:size-28 rounded-full"
          />
        </div>
        <Image
          src={"/quran-folder.png"}
          alt=""
          height={1000}
          width={1000}
          className="absolute inset-0 size-full animate-rotate "
        />
      </motion.div>
    </div>
  );
}

function Information() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en";
  return (
    <div className="p-4 md:p-10 pt-32 md:pt-96 snap-start">
      <p className="font-[900] text-2xl text-center">
        {lang == "en" ? "Things needed" : "የሚያስፈልጉ ነገሮች"}
      </p>
      <div className="flex max-md:flex-col gap-10">
        <div className="flex-1 h-fit p-2 md:p-10 place-self-center rounded-xl grid grid-rows-[1fr_auto] autoShow-bottom ">
          <div className="relative w-fit p-[20px] place-self-center ">
            <div className="relative w-[300px] h-[200px]  ">
              <Image
                src={"/laptop.png"}
                alt=""
                height={1000}
                width={1000}
                className="relative z-10 size-full  "
              />
              <Image
                src={"/quran.jpg"}
                alt=""
                height={1000}
                width={1000}
                className="z-0 absolute top-[11px] left-[31px] w-[238px] h-[130px] "
              />
            </div>
            <Image
              src={"/phone.png"}
              alt=""
              height={1000}
              width={1000}
              className="z-10 absolute bottom-0 right-0 w-20 md:w-24 bg-[url('/quran.jpg')] rounded-xl md:rounded-2xl "
            />
          </div>
          <p className="mt-5 p-2 text-xl text-center bg-primary-100 border border-primary-300 rounded-full">
            {lang == "en" ? "Smartphone or computer" : "ስማርት ስልክ ወይም ኮምፒውተር"}
          </p>
        </div>
        <div className="flex-1 h-fit p-2 md:p-10 place-self-center rounded-xl autoShow-bottom ">
          <Image
            src={"/network.png"}
            alt=""
            height={1000}
            width={1000}
            className="w-[340px] h-[240px] place-self-center "
          />
          <p className="mt-5 p-2 text-xl text-center bg-primary-100 border border-primary-300 rounded-full">
            {lang == "en" ? "Good internet / network" : "ጥሩ ኢንተርኔት / ኔትዎክ"}
          </p>
        </div>
      </div>
    </div>
  );
}

function Service2() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en";
  return (
    <div className="md: pt-40 snap-start ">
      <p className="font-[900] text-xl md:text-2xl text-center">
        {lang == "en" ? (
          <>
            You can read the Quran
            <span className="text-secondary-600"> fluently </span>
          </>
        ) : (
          <>
            ቁርአንን <span className="text-secondary-600"> በልህቀት </span> ማንበብ ይቻሉ
          </>
        )}{" "}
        !
      </p>
      <div className="p-4 space-y-10">
        {[
          {
            title:
              lang == "en" ? "Simple and convenient method" : "ቀላል እና ምቹ ዘዴ",
            description:
              lang == "en"
                ? "The method of recitation is very simple and suitable for those who are learning Tajweed including Hifz from beginners."
                : "የሚቀሩበት መንገድ በጣም ቀላል እና ከጀማሪ እሰከ ተጅዊድ ሂፍዝን ጨምሮ ለሚማሩ ምቹ ነው",
            img: "/bulb-gear.png",
          },
          {
            title: lang == "en" ? "Video help" : "የቪዲዮ እገዛ",
            description:
              lang == "en"
                ? "Learn your Quran with the help of various video files and by connecting directly with the teacher"
                : "በተለያዩ ቪድዮ ፋይሎች በመታገዘ እና በቀጥታ ከ ኡስታዙ ጋር በመገናኘት ቁርአንዎን ይማሩ",
            img: "/video.png",
          },
          {
            title:
              lang == "en"
                ? "Learn online wherever you are."
                : "ባሉበት ቦታ ኦንላይን ይማራሉ",
            description:
              lang == "en"
                ? "Learn the Quran easily from your phone, wherever you are, whenever you want"
                : "በየትኛውም ቦታ ሆነው በተመችዎት ጊዜ በቀላሉ በእጅዎ በያዙት ስልክ ቁርአንን ይማሩ",
            img: "/glob.png",
          },
          {
            title:
              lang == "en"
                ? "Sufficient attention and time every day"
                : "በየቀኑ በቂ ትኩረት እና ሰዓት",
            description:
              lang == "en"
                ? "You will get enough attention and time every day. We are using various resources to help you monitor"
                : "በየቀኑ በቂ ትኩረት እና ሰዓት ያገኛሉ ። ለክትትል የሚረዱ የተለያዩ ግብአቶችንን በመጠቀም ላይ እንገኛለን",
            img: "/schedule.png",
          },
        ].map(({ title, description, img }, i) => (
          <div
            key={i + ""}
            className={cn(
              "md:h-96 p-1 flex gap-1 justify-evenly max-md:flex-col-reverse ",
              i % 2 == 0 ? " md:flex-row-reverse" : " "
            )}
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{
                opacity: 1,
                transition: { delay: 0.5, duration: 1 },
              }}
              className="md:w-[700px] hfit place-self-center md:p-10 grid gap-5 md:place-content-center  "
            >
              <p className="text-3xl font-bold text-center">{title}</p>
              <p className="md:px-20 text-xl text-center">{description}</p>
            </motion.div>
            <motion.div
              initial={{ x: `${i % 2 == 0 ? "-" : ""}100%` }}
              whileInView={{ x: 0, transition: { delay: 0.5, duration: 1 } }}
              className="md:w-[500px] grid place-content-center "
            >
              <Image
                src={img}
                alt=""
                height={1000}
                width={1000}
                className="size-60"
              />
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

// function Testimonial() {
//   return (
//     <div className="h-dvh grid place-content-center bg-amber-200 snap-start"></div>
//   );
// }

function Contact() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en",
    formSchema = z.object({
      name: z.string({ message: "" }).nonempty("Full Name is required"),
      phoneNumber: z
        .string({ message: "" })
        .length(10, "Must be 10 digits")
        .regex(/^\d+$/, "Must contain only digits")
        .startsWith("0", "Must start with 0"),
      message: z.string({ message: "" }).nonempty("Message is required"),
    }),
    { handleSubmit, register } = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: { name: "", phoneNumber: "", message: "" },
    }),
    { action, isPending } = useAction(sendMessage, undefined, {
      error: lang == "en" ? "Sending message failed" : "መልእክት መላክ አልተሳካም",
      success:
        lang == "en" ? "Message sent successfully" : "መልእክት በተሳካ ሁኔታ ተልኳል",
    });

  return (
    <div className="relative h-dvh p-4 grid content-center md:justify-center snap-start">
      <div className="z-0 absolute inset-0 size-80 place-self-center bg-secondary/50 rounded-full blur-3xl"></div>
      <p className="pb-10 font-[900] text-xl md:text-2xl text-center">
        {lang == "en" ? "Contact Us" : "ያግኙን"}
      </p>
      <Form
        onSubmit={handleSubmit(action)}
        className="z-10 p-4 md:p-20 bg-background/50 backdrop-blur border border-background rounded-xl grid gap-5 [&>*]:w-full md:[&>*]:w-96"
      >
        <Input
          color="primary"
          {...register("name")}
          placeholder={lang == "en" ? "Full Name" : "ሙሉ ስም"}
        />
        <Input
          color="primary"
          {...register("phoneNumber")}
          placeholder={lang == "en" ? "Phone Number" : "ስልክ ቁጥር"}
        />
        <Textarea
          color="primary"
          {...register("message")}
          placeholder={lang == "en" ? "Message" : "መልእክት"}
          rows={5}
        />
        <Button color="primary" isLoading={isPending}>
          {lang == "en" ? "Send" : "ላክ"}
        </Button>
      </Form>
    </div>
  );
}

// function Footer() {
//  const params = useParams<{ lang: string }>();
//  const lang = params?.lang || "en",
//   return (
//     <div className=" bg-foreground/20 primary-500/80 backdrop-blur-3xl text-background ">
//       <div className="p-4 md:py-10 flex items-center max-md:flex-col max-md:divide-y md:divide-x-2 divide-background">
//         <div className="flex-1 p-2 flex gap-4 justify-center items-center">
//           <p className="">+251945467896</p>
//           <p className="">/</p>
//           <p className="">+251945467896</p>
//         </div>
//         <div className="flex-1 p-2 flex gap-10 justify-center">
//           <Link
//             href={
//               "https://www.facebook.com/profile.php?id=100083374747385&mibextid=LQQJ4d"
//             }
//             className="p-2 bg-blue-500 rounded-md shadow shadow-foreground/30 flex gap-2"
//           >
//             <svg
//               fill="currentColor"
//               width="800px"
//               height="800px"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//               className="size-6 "
//             >
//               <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z" />
//             </svg>

//             <span className="max-md:hidden">Facebook</span>
//           </Link>
//           <Link
//             href={
//               "https://www.instagram.com/p/CmHetwItVW8/?igshid=YmMyMTA2M2Y="
//             }
//             className="p-2 shadow shadow-foreground/30 bg-gradient-to-b from-indigo-500 via-fuchsia-500 to-amber-500 rounded-md flex gap-2"
//           >
//             <svg
//               fill="currentColor"
//               width="800px"
//               height="800px"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//               className="size-6 "
//             >
//               <path d="M20.947 8.305a6.53 6.53 0 0 0-.419-2.216 4.61 4.61 0 0 0-2.633-2.633 6.606 6.606 0 0 0-2.186-.42c-.962-.043-1.267-.055-3.709-.055s-2.755 0-3.71.055a6.606 6.606 0 0 0-2.185.42 4.607 4.607 0 0 0-2.633 2.633 6.554 6.554 0 0 0-.419 2.185c-.043.963-.056 1.268-.056 3.71s0 2.754.056 3.71c.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.043 1.268.056 3.71.056s2.755 0 3.71-.056a6.59 6.59 0 0 0 2.186-.419 4.615 4.615 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.187.043-.962.056-1.267.056-3.71-.002-2.442-.002-2.752-.058-3.709zm-8.953 8.297c-2.554 0-4.623-2.069-4.623-4.623s2.069-4.623 4.623-4.623a4.623 4.623 0 0 1 0 9.246zm4.807-8.339a1.077 1.077 0 0 1-1.078-1.078 1.077 1.077 0 1 1 2.155 0c0 .596-.482 1.078-1.077 1.078z" />
//               <circle cx="11.994" cy="11.979" r="3.003" />
//             </svg>

//             <span className="max-md:hidden">Instagram</span>
//           </Link>
//           <Link
//             href={"https://youtube.com/@user-ie5gs2xr4s"}
//             className="p-2 shadow shadow-foreground/30 bg-red-500 rounded-md flex gap-2"
//           >
//             <svg
//               fill="currentColor"
//               width="800px"
//               height="800px"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//               className="size-6 "
//             >
//               <path d="M21.593 7.203a2.506 2.506 0 0 0-1.762-1.766C18.265 5.007 12 5 12 5s-6.264-.007-7.831.404a2.56 2.56 0 0 0-1.766 1.778c-.413 1.566-.417 4.814-.417 4.814s-.004 3.264.406 4.814c.23.857.905 1.534 1.763 1.765 1.582.43 7.83.437 7.83.437s6.265.007 7.831-.403a2.515 2.515 0 0 0 1.767-1.763c.414-1.565.417-4.812.417-4.812s.02-3.265-.407-4.831zM9.996 15.005l.005-6 5.207 3.005-5.212 2.995z" />
//             </svg>

//             <span className="max-md:hidden">Youtube</span>
//           </Link>
//           <Link
//             href={"https://www.tiktok.com/@darelkubra?_t=8Y9PCJHgHOI&_r=1"}
//             className="p-2 shadow shadow-foreground/30 bg-gradient-to-r from-sky-500 via-gray-700 to-red-500 rounded-md flex gap-2"
//           >
//             <svg
//               fill="currentColor"
//               width="800px"
//               height="800px"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//               className="size-6 "
//             >
//               <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
//             </svg>

//             <span className="max-md:hidden">Tiktok</span>
//           </Link>
//         </div>
//       </div>
//       <p className="p-4 flex gap-4 justify-center items-center ">
//         <span className="">2024</span>
//         <Copyright className="size-5" />
//         <span className="">{lang=='en' ? "Darulkubra Academy" : "ዳሩልኩብራ አካዳሚ"}</span>
//       </p>
//     </div>
//   );
// }
