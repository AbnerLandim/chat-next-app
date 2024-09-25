import React from "react";
import Image from "next/image";
import { hexEncode, invertHex } from "@/app/helpers";

type MessageProps = {
  isCurrentUser: boolean;
  message: { key: string; value: string };
};

function Message({ isCurrentUser, message }: MessageProps) {
  const [senderId, messageContent] = message.value
    .replace(/\:/, "&")
    .split("&");
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    timeStyle: "medium",
    dateStyle: "short",
  }).format(new Date(Number(message.key)));
  const messageColor = `#${hexEncode(senderId)}`;
  const messageTextColor = invertHex(messageColor);

  return (
    <div
      className={`${
        isCurrentUser ? "ml-auto" : ""
      } w-9/12 rounded-lg p-2 mb-2 last:mb-80 font-mono`}
      style={{ backgroundColor: `${messageColor}` }}
      key={message.key}
    >
      <div className="flex flex-col gap-2">
        <span className="mr-auto text-sm" style={{ color: messageTextColor }}>
          {senderId}
        </span>
        {messageContent.includes("blob:") ? (
          <Image
            src={messageContent}
            alt={messageContent}
            className="mx-auto rounded"
            width={400}
            height={480}
          />
        ) : (
          <span
            className="break-all font-mono"
            style={{ color: messageTextColor }}
          >
            {messageContent}
          </span>
        )}
        <span className="ml-auto text-sm" style={{ color: messageTextColor }}>
          {formattedDate}
        </span>
      </div>
    </div>
  );
}

export default Message;
