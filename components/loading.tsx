import { cn } from "@/lib/utils";
import { Spinner } from "@heroui/react";

export default function Loading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "size-full backdrop-blur-3xl grid place-content-center",
        className
      )}
    >
      <Spinner />
      {/* <motion.div
        layoutId="loading"
        layout
        initial={{ scale: 0, opacity: 0 }}
        exit={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-40 h-20  "
      >
        <div className="relative h-20 overflow-hidden border-t-4 border-yellow-600/80 rounded-xl">
          <motion.div
            animate={{ rotate: "360deg" }}
            transition={{
              delay: 0.3,
              duration: 5,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="absolute bottom-0 h-40 aspect-square  "
          >
            <Image
              alt=""
              src={"/loading.png"}
              height={100}
              width={100}
              priority
              className="size-full"
            />
          </motion.div>
        </div>
        <motion.div
          animate={{ rotate: "-360deg" }}
          transition={{
            delay: 0.3,
            duration: 5,
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="absolute -top-[50%] inset-x-0 place-self-center h-20 aspect-square bg-background  rounded-full"
        >
          <Image
            alt=""
            src={"/loading.png"}
            height={100}
            width={100}
            priority
            className="size-full"
          />
        </motion.div>
      </motion.div> */}
    </div>
  );
}
