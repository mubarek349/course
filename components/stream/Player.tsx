"use client";
import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, ChevronRight, ChevronLeft } from "lucide-react";
import Controls from "./Controls";
import Playlist from "./Playlist";
import ProgressBar from "./ProgressBar";
import VolumeControl from "./VolumeControl";
import FullscreenButton from "./FullScreen";
import CustomSpinner from "./CustomSpinner";
import { VideoItem } from "../../types";
import { cn } from "@/lib/utils";

interface PlayerProps {
  src: string;
  type?: "url" | "local";
  playlist?: VideoItem[];
  title?: string;
  onVideoPlay?: () => void;
  onVideoPause?: () => void;
}

export default function Player({
  src,
  type = "local",
  playlist = [],
  onVideoPlay,
  onVideoPause,
}: // title,
PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [isLandscape, setIsLandscape] = useState(false);

  // Compute the video source based on type
  let videoSrc = src;
  if (type === "url" && !src.startsWith("blob:")) {
    videoSrc = `/api/remote-stream?url=${encodeURIComponent(src)}`;
  } else if (type === "local") {
    videoSrc = `/api/stream?file=${encodeURIComponent(src)}`;
  }
  // For blob URLs (uploaded files), use src directly

  const currentSrc =
    playlist.length > 0 ? playlist[currentVideoIndex]?.url : videoSrc;

  // Detect mobile
  const isMobile =
    typeof window !== "undefined" && /Mobi|Android/i.test(navigator.userAgent);

  // Hide controls after a few seconds on mobile
  useEffect(() => {
    if (!isMobile || !showControls) return;
    const timeout = setTimeout(() => setShowControls(false), 2500);
    return () => clearTimeout(timeout);
  }, [showControls, isMobile]);

  // Network status detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Orientation detection for mobile fullscreen
  useEffect(() => {
    const handleOrientationChange = () => {
      // Add a small delay to ensure the orientation change is complete
      setTimeout(() => {
        if (isMobile) {
          const isCurrentlyLandscape = window.innerWidth > window.innerHeight;
          setIsLandscape(isCurrentlyLandscape);
          // Debug log
          console.log("Mobile orientation changed:", {
            isMobile,
            isFullscreen,
            isLandscape: isCurrentlyLandscape,
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }
      }, 100);
    };

    // Initial check
    if (isMobile) {
      setIsLandscape(window.innerWidth > window.innerHeight);
    }

    // Listen for orientation changes
    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("resize", handleOrientationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, [isMobile, isFullscreen]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const updateBuffered = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => setIsLoading(false);
    const handleError = () => setIsLoading(false);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("progress", updateBuffered);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("progress", updateBuffered);
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("error", handleError);
    };
  }, [currentSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.playbackRate = speed;
  }, [speed, currentSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.volume = volume;
      video.muted = muted;
    }
  }, [volume, muted]);

  // Fullscreen handlers
  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      // Try different fullscreen methods for cross-browser support
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const element = containerRef.current as any;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doc = document as any;
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleChange = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doc = document as any;
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
      // Debug log
      console.log("Fullscreen changed:", {
        isFullscreen: isCurrentlyFullscreen,
        isMobile,
        isLandscape,
      });
    };

    document.addEventListener("fullscreenchange", handleChange);
    document.addEventListener("webkitfullscreenchange", handleChange);
    document.addEventListener("mozfullscreenchange", handleChange);
    document.addEventListener("MSFullscreenChange", handleChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
      document.removeEventListener("webkitfullscreenchange", handleChange);
      document.removeEventListener("mozfullscreenchange", handleChange);
      document.removeEventListener("MSFullscreenChange", handleChange);
    };
  }, [isMobile, isLandscape]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const skipTime = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime += seconds;
  };

  const changeSpeed = (newSpeed: number) => {
    setSpeed(newSpeed);
    const video = videoRef.current;
    if (video) video.playbackRate = newSpeed;
  };

  const handleVolumeChange = (v: number) => setVolume(v);
  const handleMuteToggle = () => setMuted((m) => !m);

  const handleSeek = (time: number) => {
    const video = videoRef.current;
    if (video) video.currentTime = time;
    setCurrentTime(time);
  };

  const handleSelect = (idx: number) => {
    setCurrentVideoIndex(idx);
    setPlaying(false);
  };

  return (
    <div
      ref={containerRef}
      className="video-player"
      style={{
        height: isFullscreen && isMobile && isLandscape ? "100vh" : "auto",
        width: isFullscreen && isMobile && isLandscape ? "100vw" : "100%",
      }}
    >
      <div
        onMouseEnter={() => !isMobile && setShowControls(true)}
        onMouseLeave={() => !isMobile && setShowControls(false)}
        className={cn(
          "relative max-md:w-full",
          isFullscreen ? "md:w-full" : "md:w-[70%]"
        )}
        style={{
          height: isFullscreen && isMobile && isLandscape ? "100vh" : "auto",
          width: isFullscreen && isMobile && isLandscape ? "100vw" : "100%",
        }}
      >
        <video
          ref={videoRef}
          src={currentSrc}
          width="100%"
          height="auto"
          style={{
            borderRadius: isFullscreen && isMobile && isLandscape ? 0 : 8,
            width: "100%",
            height: isFullscreen && isMobile && isLandscape ? "100vh" : "auto",
            objectFit:
              isFullscreen && isMobile && isLandscape ? "cover" : "contain",
            display: "block",
            position:
              isFullscreen && isMobile && isLandscape ? "absolute" : "relative",
            top: isFullscreen && isMobile && isLandscape ? 0 : "auto",
            left: isFullscreen && isMobile && isLandscape ? 0 : "auto",
            zIndex: isFullscreen && isMobile && isLandscape ? 1 : "auto",
          }}
          onPlay={(e) => {
            e.stopPropagation();
            setPlaying(true);
            onVideoPlay?.();
          }}
          onPause={(e) => {
            e.stopPropagation();
            setPlaying(false);
            onVideoPause?.();
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (isMobile) setShowControls((v) => !v);
          }}
        />

        {/* Loading Spinner Overlay */}
        {(isLoading || !isOnline) && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              borderRadius: "50%",
              width: "80px",
              height: "80px",
              pointerEvents: "none",
            }}
          >
            <CustomSpinner size={32} color="#fff" />
            {!isOnline && (
              <span
                style={{
                  color: "#fff",
                  fontSize: "12px",
                  marginTop: "8px",
                  textAlign: "center",
                }}
              >
                No Network
              </span>
            )}
          </div>
        )}

        {/* --- MOBILE CONTROLS --- */}
        {isMobile && showControls && (
          <>
            {/* Center Play/Pause, Skip Back, Skip Forward */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transform: "translateY(-50%)",
                zIndex: 2,
                pointerEvents: "none",
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  skipTime(-10);
                }}
                style={{
                  pointerEvents: "auto",
                  background: "rgba(0,0,0,0.5)",
                  border: "none",
                  color: "#fff",
                  fontSize: 28,
                  borderRadius: "50%",
                  width: 48,
                  height: 48,
                  marginRight: 16,
                }}
                aria-label="Skip Backward"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                style={{
                  pointerEvents: "auto",
                  background: "rgba(0,0,0,0.7)",
                  border: "none",
                  color: "#fff",
                  fontSize: 32,
                  borderRadius: "50%",
                  width: 56,
                  height: 56,
                  margin: "0 8px",
                }}
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? <Pause /> : <Play />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  skipTime(10);
                }}
                style={{
                  pointerEvents: "auto",
                  background: "rgba(0,0,0,0.5)",
                  border: "none",
                  color: "#fff",
                  fontSize: 28,
                  borderRadius: "50%",
                  width: 48,
                  height: 48,
                  marginLeft: 16,
                }}
                aria-label="Skip Forward"
              >
                <ChevronRight />
              </button>
            </div>
            {/* Volume at upper center right */}
            <div
              style={{
                position: "absolute",
                top: "30%",
                right: 8,
                transform: "translateY(-50%)",
                zIndex: 2,
                pointerEvents: "auto",
              }}
            >
              <VolumeControl
                volume={volume}
                muted={muted}
                onVolumeChange={handleVolumeChange}
                onMuteToggle={handleMuteToggle}
              />
            </div>
            {/* Fullscreen at bottom right */}
            <div
              style={{
                position: "absolute",
                right: 12,
                bottom: 16,
                zIndex: 2,
                pointerEvents: "auto",
              }}
            >
              <FullscreenButton
                onClick={handleFullscreen}
                isFullscreen={isFullscreen}
              />
            </div>
            {/* ProgressBar at bottom */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.4)",
                padding: "8px 0 0 0",
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                zIndex: 2,
              }}
            >
              <ProgressBar
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek}
                buffered={buffered}
              />
            </div>
          </>
        )}

        {/* --- DESKTOP CONTROLS --- */}
        {!isMobile && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              opacity: showControls ? 1 : 0,
              pointerEvents: showControls ? "auto" : "none",
              transition: "opacity 0.3s",
              background: "rgba(0,0,0,0.4)",
              padding: "12px 16px 8px 16px",
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {/* Progress bar at the top of controls */}
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
              buffered={buffered}
            />
            {/* Controls row */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                marginTop: 4,
              }}
            >
              {/* Left: Play/Pause, Skip Back, Skip Forward */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Controls
                  playing={playing}
                  onPlayPause={togglePlay}
                  onSkip={skipTime}
                  onSpeedChange={() =>
                    changeSpeed(speed >= 2 ? 1 : speed + 0.25)
                  }
                  speed={speed}
                  // currentTime={currentTime}
                  // duration={duration}
                  // onSeek={handleSeek}
                />
              </div>
              {/* Right: Volume, Speed, Fullscreen */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <VolumeControl
                  volume={volume}
                  muted={muted}
                  onVolumeChange={handleVolumeChange}
                  onMuteToggle={handleMuteToggle}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    changeSpeed(speed >= 2 ? 1 : speed + 0.25);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#fff",
                    fontSize: 16,
                    cursor: "pointer",
                    padding: "4px 8px",
                  }}
                  title="Change Speed"
                >
                  {speed}x
                </button>
                <FullscreenButton
                  onClick={handleFullscreen}
                  isFullscreen={isFullscreen}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {playlist.length > 0 && (
        <div style={{ width: "100%", maxWidth: 640, marginTop: 16 }}>
          <Playlist
            videos={playlist}
            currentVideoId={playlist[currentVideoIndex]?.id}
            onSelect={(_id) => {
              const idx = playlist.findIndex((v) => v.id === _id);
              if (idx !== -1) handleSelect(idx);
            }}
          />
        </div>
      )}
    </div>
  );
}
