import React from "react";
import { BsX } from "react-icons/bs";

import { UNICODE_EMOJIS } from "@/app/helpers";

type EmojiModalProps = {
  onClose: () => void;
  onAddEmoji: (emoji: string) => void;
};

function EmojiModal({ onClose, onAddEmoji }: EmojiModalProps) {
  return (
    <div className="flex flex-col bg-white rounded-lg p-2 border-solid shadow-lg">
      <div className="cursor-pointer ml-auto" onClick={onClose}>
        <BsX size={28} color="gray" />
      </div>
      <div className="grid grid-rows-4 grid-flow-col gap-2 overflow-x-auto">
        {UNICODE_EMOJIS.map((emoji) => (
          <span
            key={emoji}
            className="cursor-pointer text-2xl"
            onClick={() => onAddEmoji(emoji)}
          >
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
}

export default EmojiModal;
