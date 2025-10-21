import { cn } from "@/lib/utils";
import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@heroui/react";
import { toast } from "sonner";

export default function CourseAbout({ data }: { data: string }) {
  const params = useParams<{ lang: string; id: string }>();
  const lang = params?.lang || "en";
  const [more, setMore] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    if (isSharing) return;
    
    setIsSharing(true);
    
    try {
      const shareUrl = typeof window !== "undefined" ? window.location.href : "";
      const shareTitle = lang === "en" ? "Check out this course!" : "ይህን ትምህርት ይመልከቱ!";
      const shareText = lang === "en" 
        ? "I found this interesting course and thought you might like it!" 
        : "ይህን አስደሳች ትምህርት አገኘሁ እና ሊወዱት ይችላሉ ብዬ አስቤ ነበር!";

      // Check if Web Share API is available (mobile devices)
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        
        setShared(true);
        toast.success(lang === "en" ? "Shared successfully!" : "በተሳካ ሁኔታ ተጋርቷል!");
        
        setTimeout(() => setShared(false), 2000);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        
        setShared(true);
        toast.success(
          lang === "en" 
            ? "Link copied to clipboard!" 
            : "አገናኝ ወደ ቅንጥብ ሰሌዳ ተቀድቷል!"
        );
        
        setTimeout(() => setShared(false), 2000);
      }
    } catch (error: unknown) {
      // User cancelled or error occurred
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error sharing:", error);
        toast.error(
          lang === "en" 
            ? "Failed to share. Please try again." 
            : "ማጋራት አልተሳካም። እባክዎን እንደገና ይሞክሩ።"
        );
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="">
      <div className="pb-5 grid grid-cols-[1fr_auto] items-center">
        <p className="md:text-2xl font-extrabold">
          {lang == "en" ? "About the Course" : "ስለ ትምህርቱ"}
        </p>
        <Button
          variant="flat"
          color="primary"
          startContent={shared ? <Check className="size-5" /> : <Share2 className="size-5" />}
          onPress={handleShare}
          isLoading={isSharing}
          isDisabled={isSharing}
        >
          {shared 
            ? (lang === "en" ? "Shared!" : "ተጋርቷል!")
            : (lang === "en" ? "Share" : "አጋራ")
          }
        </Button>
      </div>
      <div className="">
        <p className={cn(more ? "" : "line-clamp-3")}>{data}</p>
        <Button
          variant="light"
          color="primary"
          onPress={() => setMore((prev) => !prev)}
        >
          {more
            ? lang == "en"
              ? "hide more"
              : "የበለጠ ደብቅ"
            : lang == "en"
            ? "show more"
            : "ተጨማሪ አሳይ"}
        </Button>
      </div>
    </div>
  );
}
