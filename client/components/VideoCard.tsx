import { useRef, useState } from "react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { useSubscription } from "@/context/SubscriptionContext";

interface VideoCardProps {
  image: string;
  video: string;
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

export const VideoCard = ({ image, video, title, className = "", children }: VideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovering, setHovering] = useState(false);
  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(false);

  const { requestVideoAccess, setPendingVideoCallback } = useSubscription();

  const handleMouseEnter = () => {
    setHovering(true);
    videoRef.current?.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    setHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const playVideo = () => setOpen(true);

  const handleClick = async () => {
    if (checking) return;
    setChecking(true);

    try {
      const result = await requestVideoAccess();

      if (result === "granted") {
        playVideo();
      } else if (result === "needs_mobile") {
        setPendingVideoCallback(() => playVideo);
      }
      // "redirect" — browser navigates to campaign URL
    } finally {
      setChecking(false);
    }
  };

  return (
    <>
      <div
        className={`relative overflow-hidden cursor-pointer ${checking ? "opacity-70 pointer-events-none" : ""} ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <img
          src={image}
          alt={title ?? ""}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovering ? "opacity-0" : "opacity-100"}`}
        />
        <video
          ref={videoRef}
          src={video}
          muted
          loop
          playsInline
          preload="none"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${hovering ? "opacity-100" : "opacity-0"}`}
        />
        {children}
      </div>

      {open && (
        <VideoPlayer
          video={video}
          image={image}
          title={title}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};
