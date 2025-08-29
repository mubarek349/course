import { useParams } from "next/navigation";
import Player from "./stream/Player";
import { useEffect, useState } from "react";
interface Video {
  id: string;
  titleEn: string;
  titleAm: string;
  video: string;
}

// interface VideoListProps {
//   refresh: boolean;
// }
export default function CourseTopOverview({
  title,
  by,
  thumbnail,
}: //  video,

{
  title: string;
  by: string;
  thumbnail: string;
  // video: string;
}) {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang || "en";
  // const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos");
      const data = await response.json();
      // setVideos(data.videos || []);
      setSelectedVideo(data.videos[0]);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading videos...</div>;
  }

  return (
    <div className="flex gap-y-4 max-md:flex-col-reverse flex-col ">
      <div className="flex gap-4 flex-col">
        <p className="text-xl md:text-3xl font-extrabold">{title}</p>
        <div className="w-fit flex gap-2 items-center ">
          {
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnail}
              alt=""
              className="size-10 object-cover rounded-full"
            />
          }
          <div className="">
            <p className="">{lang == "en" ? "course by" : "ኮርስ "}</p>
            <p className="font-bold">
              {lang == "en" ? "" : "በ"}
              {by}
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-md md:rounded-xl overflow-hidden">
        {selectedVideo && <Player src={selectedVideo?.video} type="local" />}
        {/* <iframe
          src={video}
          title="YouTube video player"
          // frameBorder="0"
          rel="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; "
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="w-full aspect-video"
        ></iframe> */}
      </div>
    </div>
  );
}
