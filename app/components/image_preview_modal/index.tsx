import React from "react";
import Image from "next/image";
import { HiXMark, HiPaperAirplane } from "react-icons/hi2";

type ImagePreviewModalProps = {
  imageUrl: string;
  onClose: () => void;
  title: string;
  onSend: () => void;
};

function ImagePreviewModal({
  imageUrl,
  onClose,
  title,
  onSend,
}: ImagePreviewModalProps) {
  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-white/50 flex items-center justify-center"
      style={{ zIndex: 1 }}
    >
      <div className="bg-white p-4 rounded-lg w-[500px] max-h-full shadow-xl">
        <div className="flex justify-between items-center mb-[10px]">
          <h2 className="text-stone-800 font-sans font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="bg-none b-none text-base cursor-pointer"
          >
            <HiXMark size={28} color="gray" />
          </button>
        </div>
        <div className="mt-[10px]">
          <Image
            className="m-auto rounded"
            src={imageUrl}
            width={600}
            height={600}
            alt={imageUrl}
          />
          <button
            onClick={onSend}
            type="submit"
            className="w-10 h-10 bg-emerald-700 flex items-center justify-center rounded-full shadow-md ml-auto mt-2"
          >
            <HiPaperAirplane color="white" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImagePreviewModal;
