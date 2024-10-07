import { useRef, useEffect, useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { BsHourglassSplit } from "react-icons/bs";

type AudioPreviewProps = {
  isRecording: boolean;
  onCancel: () => void;
  setAudioClip: (audioClip: Blob | null) => void;
};

function AudioPreview({
  isRecording,
  onCancel,
  setAudioClip,
}: AudioPreviewProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [audioURL, setAudioURL] = useState("");
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (isRecording) startRecording();
    else stopRecording();
  }, [isRecording]);

  function handleOnCancel() {
    onCancel();
    setAudioClip(null);
  }

  // Request access to the microphone and set up MediaRecorder
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let audioChunks: any[] = [];
      setAudioStream(stream);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.addEventListener("dataavailable", (e) => {
        audioChunks.push(e.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks);
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setAudioClip(audioBlob);
        audioChunks = [];

        //   socket.emit(`${room}:audioStream`, [base64String, socket.id]);
      });

      mediaRecorder.start();
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  // Stop recording and close media stream
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();

      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const handlePlay = () => {
    if (audioRef.current && audioStream) {
      audioRef.current.play();
    }
  };

  return (
    <>
      {audioURL ? (
        <>
          <audio
            className="w-[60%] rounded-full shadow-md"
            ref={audioRef}
            controls
            src={audioURL}
            onPlay={handlePlay}
            onLoadedMetadata={() => {
              if (audioRef.current)
                audioRef.current.currentTime = Number.MAX_SAFE_INTEGER;
            }}
          />
          <button onClick={handleOnCancel}>
            <HiXMark color="gray" size={28} />
          </button>
        </>
      ) : (
        <div className="flex items-start justify-center">
          <BsHourglassSplit size={20} color="gray" />
          <span className=" text-teal-950">Recording...</span>
        </div>
      )}
    </>
  );
}

export default AudioPreview;
