import React from "react";
import { motion } from "motion/react";

export default function NoData() {
  return (
    <motion.div
      layoutId="nodata"
      layout
      initial={{ scale: 0, opacity: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="size-full backdrop-blur-3xl grid place-content-center"
    >
      <div className="bg-[url('/nodata.png')] bg-contain bg-no-repeat size-40 grid place-content-center ">
        <span className="font-bold tracking-wider text-amber-700 ">Empty</span>
      </div>
    </motion.div>
  );
}
