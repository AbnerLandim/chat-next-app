import React from "react";
import Image from "next/image";

import { hexEncode, invertHex } from "@/app/helpers";
import AudioPlayer from "@/app/components/audio_player";
import { JOINED_PREFIX, LEFT_PREFIX } from "@/app/constants";

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
    <>
      {senderId.includes(String(JOINED_PREFIX)) && (
        <div className="w-full py-2 text-center text-slate-500 text-xs font-sans">{`${messageContent} has joined the chat.`}</div>
      )}
      {senderId.includes(String(LEFT_PREFIX)) && (
        <div className="w-full py-2 text-center text-slate-500 text-xs font-sans">{`${messageContent} has left the chat.`}</div>
      )}
      {!senderId.includes(String(JOINED_PREFIX)) &&
        !senderId.includes(String(LEFT_PREFIX)) && (
          <div
            className={`${
              isCurrentUser ? "ml-auto" : ""
            } max-w-[75%] rounded-[18px] p-2 mb-2 font-sans shadow-lg w-fit`}
            style={{ backgroundColor: `${messageColor}` }}
            key={message.key}
          >
            <div className="flex flex-col gap-1">
              <span
                className="mr-auto text-xs"
                style={{ color: messageTextColor, opacity: 0.5 }}
              >
                {senderId}
              </span>
              {messageContent.includes("audio:") && (
                <AudioPlayer url={messageContent.replace("audio:", "")} />
              )}
              {messageContent.includes("blob:") &&
                !messageContent.includes("audio:") && (
                  <Image
                    src={messageContent}
                    alt={messageContent}
                    className="mx-auto rounded-md"
                    width={400}
                    height={480}
                  />
                )}
              {!messageContent.includes("blob:") && (
                <span
                  className="break-words font-sans"
                  style={{ color: messageTextColor }}
                >
                  {messageContent}
                </span>
              )}
              <span
                className="ml-auto text-xs"
                style={{ color: messageTextColor, opacity: 0.5 }}
              >
                {formattedDate}
              </span>
            </div>
          </div>
        )}
    </>
  );
}

export default Message;
