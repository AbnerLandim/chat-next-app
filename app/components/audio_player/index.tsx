import { useRef, useEffect, useState } from "react";
import { BsFillPlayFill, BsFillPauseFill, BsMicFill } from "react-icons/bs";

import { formatTime } from "@/app/helpers";

type AudioPlayerProps = {
  url: string;
};
const NORMALIZED_MAX_PLAYER_VALUE = 92;

function AudioPlayer({ url }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioElapsedSeconds, setAudioElapsedSeconds] = useState(0);

  useEffect(() => {
    let increment = audioRef.current
      ? Math.ceil(
          NORMALIZED_MAX_PLAYER_VALUE / Math.ceil(audioRef.current.duration) - 1
        )
      : 1;

    if (
      !isPlaying ||
      audioProgress > NORMALIZED_MAX_PLAYER_VALUE ||
      audioProgress === 0
    )
      return;

    const timer = setTimeout(() => {
      if (
        audioProgress < NORMALIZED_MAX_PLAYER_VALUE &&
        Math.ceil(NORMALIZED_MAX_PLAYER_VALUE - audioProgress) < increment
      ) {
        increment = NORMALIZED_MAX_PLAYER_VALUE - audioProgress;
      }
      setAudioElapsedSeconds((prev) => prev + 1);
      setAudioProgress((prev) => prev + increment);
    }, 1000); // Update time every second

    return () => clearTimeout(timer);
  }, [audioProgress, isPlaying]);

  const handlePlay = () => {
    if (audioRef.current) {
      setAudioProgress(1);
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <>
      {url && (
        <audio
          ref={audioRef}
          controls={false}
          src={url}
          onPlay={handlePlay}
          onEnded={() => {
            setTimeout(() => {
              setIsPlaying(false);
              setAudioElapsedSeconds(0);
            }, 1000);
          }}
          onLoadedMetadata={() => {
            if (audioRef.current)
              audioRef.current.currentTime = Number.MAX_SAFE_INTEGER;
          }}
        />
      )}
      <div className="w-full min-w-[40vw] flex flex-col px-2 py-1">
        <div className="flex items-center justify-start">
          <section className="w-16 h-full flex items-center justify-center p-3">
            <BsMicFill size={20} color="#045c12" />
          </section>
          <section className="max-w-[20%] flex items-start justify-center">
            <button onClick={isPlaying ? handlePause : handlePlay}>
              {isPlaying ? (
                <BsFillPauseFill size={36} color="#045c12" />
              ) : (
                <BsFillPlayFill size={36} color="#045c12" />
              )}
            </button>
          </section>
          <section className="w-full flex relative">
            <div className="flex flex-col w-full mt-5">
              <div className="h-1 bg-main-background rounded-full" />
              <div className="text-xs pt-1 text-main-background font-sans">
                {formatTime(audioElapsedSeconds)}
              </div>
            </div>
            {/* Change the left property between 1% and 92% according to the audio progress. */}
            <div
              className={`absolute top-0 h-4 w-4 mt-3.5 rounded-full bg-main-background`}
              style={{ left: `${Math.ceil(audioProgress).toString()}%` }}
            />
          </section>
        </div>
      </div>
    </>
  );
}

export default AudioPlayer;
