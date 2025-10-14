"use client";

import Image from "next/image";
import CourseSample from "./course/page";
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
import { getCoursesForCustomer } from "@/lib/data/course";
import { PlayCircle } from "lucide-react";

export default function Page() {
  useEffect(() => {
    toast.dismiss();
  }, []);

  return (
    <div className="w-full">
      <HomeSample />
      <CourseSample />
      <Footer />
    </div>
  );
}
function HomeSample() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en";

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-blue-100/30 rounded-full blur-2xl hidden md:block"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-green-100/30 rounded-full blur-2xl hidden md:block"></div>

      <div className="relative z-10 w-full px-4 md:px-10 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center min-h-screen">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                {lang === "en"
                  ? "The Leading Islamic Education Platform in Ethiopia"
                  : "በኢትዮጵያ ውስጥ ዋናው የኢስላማዊ ትምህርት መድረክ"}
              </h1>
              <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
            </div>

            {/* Features List */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                    {lang === "en"
                      ? "Expert Quran Teachers:"
                      : "ባለሙያ የቁርአን አስተማሪዎች:"}
                  </h3>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed font-medium">
                    {lang === "en"
                      ? "Learn from certified Hafizul Quran instructors with years of experience, ensuring authentic and accurate Islamic education."
                      : "ዓመታት የሚሆኑ ልምድ ያላቸው የሰርተፍኬት ያላቸው ሃፊዘል ቁርአን አስተማሪዎች ይማሩ፣ እውነተኛ እና ትክክለኛ የኢስላማዊ ትምህርት ዋስትና።"}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                    {lang === "en"
                      ? "Interactive Learning Experience:"
                      : "የመስተጋብር የመማሪያ ልምድ:"}
                  </h3>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed font-medium">
                    {lang === "en"
                      ? "Engage with modern technology and traditional teaching methods. Track your progress with AI-powered tools and personalized learning paths."
                      : "ዘመናዊ ቴክኖሎጂ እና ባህላዊ የመማሪያ ዘዴዎች ይስተጋብሩ። በAI የተመሰረተ መሳሪያዎች እና የተበጀ የመማሪያ መንገዶች እድገትዎን ይከታተሉ።"}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                    {lang === "en"
                      ? "Certificates & Spiritual Growth:"
                      : "ሰርተፍኬቶች እና መንፈሳዊ እድገት:"}
                  </h3>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed font-medium">
                    {lang === "en"
                      ? "Earn recognized certificates that demonstrate your Quranic knowledge and skills. Join a community committed to spiritual development and Islamic learning."
                      : "የቁርአን እውቀትን እና ክህሎቶችን የሚያሳዩ የታወቁ ሰርተፍኬቶች ያግኙ። ለመንፈሳዊ እድገት እና የኢስላማዊ መማሪያ የተዋደደ ማህበረሰብ ይቀላቀሉ።"}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Call to Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4"
            >
              <CButton
                as={Link}
                href={`/${lang}/course`}
                color="primary"
                variant="shadow"
                size="lg"
                className="px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-bold bg-gradient-to-r from-blue-500 to-green-500 w-full sm:w-auto"
              >
                {lang === "en" ? "Start Learning Now" : "አሁን መማር ጀምር"}
              </CButton>
              <CButton
                as={Link}
                href={`/${lang}/#about`}
                color="default"
                variant="bordered"
                size="lg"
                className="px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-bold border-2 border-gray-300 hover:border-blue-500 w-full sm:w-auto"
              >
                {lang === "en" ? "Learn More" : "የበለጠ ለማወቅ"}
              </CButton>
            </motion.div>
          </motion.div>

          {/* Right Side - Tutor Image with Decorative Elements */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center items-center mt-12 lg:mt-0"
          >
            {/* Large Blue Circle Background with Image Inside */}
            <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px]">
              {/* Main blue circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-green-500 rounded-full shadow-2xl overflow-hidden">
                {/* Tutor Image - top 65% of circle */}
                <div className="absolute top-0 left-0 right-0 h-[65%] flex items-start justify-center overflow-hidden">
                  <Image
                    src={"/tutor2.png"}
                    alt={
                      lang === "en"
                        ? "Expert Quran Teacher"
                        : "ባለሙያ የቁርአን አስተማሪ"
                    }
                    width={400}
                    height={500}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Text overlay at the bottom of the circle with padding from border */}
                <div className="absolute bottom-0 left-0 right-0 text-center text-white px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 md:pb-10 z-10 bg-gradient-to-t from-blue-900/90 via-blue-800/70 to-transparent pt-12 sm:pt-16 md:pt-20">
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black mb-1 sm:mb-2 drop-shadow-2xl">
                    {lang === "en"
                      ? "Learn Quran is Knowledge"
                      : "ቁርአንን መማር እውቀት ነው"}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base font-bold opacity-90 drop-shadow-2xl">
                    {lang === "en" ? "Knowledge is Power" : "እውቀት ኃይል ነው"}
                  </p>
                </div>
              </div>

              {/* Decorative star badge */}
              <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 md:-top-4 md:-left-4 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg z-20">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>

              {/* Expert badge */}
              <div className="absolute top-1/2 -right-3 sm:-right-4 md:-right-6 bg-green-500 text-white px-3 sm:px-4 md:px-5 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm font-bold shadow-xl z-20 transform -rotate-12">
                {lang === "en" ? "Expert" : "ባለሙያ"}
              </div>
            </div>

            {/* Background decorative elements - hidden on mobile */}
            <div className="absolute top-10 left-10 w-24 h-24 bg-blue-200/50 rounded-full blur-xl hidden md:block"></div>
            <div className="absolute bottom-20 left-20 w-20 h-20 bg-green-200/50 rounded-full blur-xl hidden md:block"></div>
            <div className="absolute top-1/2 -right-10 w-16 h-16 bg-purple-200/50 rounded-full blur-xl hidden md:block"></div>
          </motion.div>
        </div>
      </div>

      {/* Fixed WhatsApp Button - Bottom Right */}
      <motion.a
        href="https://wa.me/251945467896?text=Hello%2C%20I%20want%20to%20learn%20Quran"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [0, -10, 0],
        }}
        transition={{
          opacity: { duration: 0.5, delay: 1 },
          scale: { duration: 0.5, delay: 1 },
          y: {
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          },
        }}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 md:p-5 shadow-2xl cursor-pointer group"
      >
        {/* WhatsApp Icon */}
        <svg
          className="w-7 h-7 md:w-8 md:h-8"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>

        {/* Tooltip */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          {lang === "en" ? "Chat with us on WhatsApp!" : "በWhatsApp ያነጋግሩን!"}
        </span>

        {/* Notification Badge */}
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold animate-pulse">
          1
        </span>
      </motion.a>
    </div>
  );
}

function Footer() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en";

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">
                {lang === "en" ? "Darul Kubra" : "ዳሩል ኩብራ"}
              </h3>
            </div>
            <p className="text-gray-300 text-sm">
              {lang === "en"
                ? "Leading Islamic education platform in Ethiopia."
                : "በኢትዮጵያ ውስጥ ዋናው የኢስላማዊ ትምህርት መድረክ።"}
            </p>

            {/* Social Media Links */}
            <div className="flex gap-3">
              <a
                href="#"
                className="w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold">
              {lang === "en" ? "Quick Links" : "የፈጣን አገናኞች"}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={`/${lang}/course`}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {lang === "en" ? "Our Courses" : "ኮርሶቻችን"}
                </a>
              </li>
              <li>
                <a
                  href={`/${lang}/#about`}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {lang === "en" ? "About Us" : "ስለ እኛ"}
                </a>
              </li>
              <li>
                <a
                  href={`/${lang}/contact`}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {lang === "en" ? "Contact" : "አግኙን"}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold">
              {lang === "en" ? "Contact" : "አግኙን"}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <span className="text-gray-300 text-sm">
                  info@darulkubra.com
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <span className="text-gray-300 text-sm">+251 945 467 896</span>
              </div>
            </div>
          </div>
        </div>

        {/* Email Subscription Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-xl font-bold mb-3">
              {lang === "en" ? "Stay Updated" : "ዝመናዎት ያላችሁ"}
            </h3>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder={lang === "en" ? "Enter email" : "ኢሜይል ያስገቡ"}
                className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 rounded-lg font-semibold transition-all duration-300 text-sm">
                {lang === "en" ? "Subscribe" : "ይመዝገቡ"}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div>
              © 2024 Darul Kubra.{" "}
              {lang === "en" ? "All rights reserved." : "ሁሉም መብቶች የተጠበቁ ናቸው።"}
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">
                {lang === "en" ? "Privacy" : "ግላዊነት"}
              </a>
              <a href="#" className="hover:text-white transition-colors">
                {lang === "en" ? "Terms" : "ውሎች"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
