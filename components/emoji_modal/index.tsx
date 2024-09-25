import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { UNICODE_EMOJIS } from "@/app/helpers";

type EmojiModalProps = {
  onClose: () => void;
  onAddEmoji: (emoji: string) => void;
};

function EmojiModal({ onClose, onAddEmoji }: EmojiModalProps) {
  return (
    <div className="flex flex-col bg-white rounded-lg p-2 border-solid border-2 border-slate-700">
      <div className="cursor-pointer ml-auto" onClick={onClose}>
        <FontAwesomeIcon icon={faXmark} size="lg" color="gray" />
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
