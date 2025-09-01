"use client";
import { useState, useEffect } from "react";
import Player from "./stream/Player";

interface Video {
  id: string;
  titleEn: string;
  titleAm: string;
  video: string;
}

interface VideoListProps {
  refresh: boolean;
}

export default function VideoList({ refresh }: VideoListProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos");
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [refresh]);

  if (loading) {
    return <div className="text-center p-4">Loading videos...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Video Library</h2>
      
      {selectedVideo && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">{selectedVideo.titleEn}</h3>
          <Player src={selectedVideo.video} type="local" />
          <button
            onClick={() => setSelectedVideo(null)}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back to List
          </button>
        </div>
      )}

      {!selectedVideo && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              No videos uploaded yet
            </div>
          ) : (
            videos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedVideo(video)}
              >
                <h3 className="font-semibold text-lg mb-2">{video.titleEn}</h3>
                <p className="text-gray-600 text-sm mb-3">{video.titleAm}</p>
                <div className="text-blue-600 text-sm">Click to watch →</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}