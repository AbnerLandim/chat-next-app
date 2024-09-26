"use client";
import { useRef, useState, useEffect } from "react";
import { SlEmotsmile } from "react-icons/sl";
import { HiPaperAirplane } from "react-icons/hi2";

import Message from "@/components/message";
import { useSocket } from "@/components/providers/socket-provider";
import ImagePreviewModal from "@/components/image_preview_modal";
import EmojiModal from "@/components/emoji_modal";
import RoomHeader from "@/components/room_header";
import useSessionStorage from "@/hooks/useSessionStorage";
import { getBinaryFromFile } from "@/app/helpers";
import { handlePasteItem } from "@/app/room/[roomId]/helpers";

type RoomProps = {
  params: {
    roomId: string;
  };
};

function Room({ params }: RoomProps) {
  const { socket, room } = useSocket();
  const { getAllValues, clearAllValues } = useSessionStorage();

  const [imagePreview, setImagePreview] = useState("");
  const [messages, setMessages] = useState<{ key: string; value: string }[]>(
    []
  );
  const [showEmojiModal, setShowEmojiModal] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  /* Had to add this because it gets the last value from the messages state */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    clearAllValues();
    inputRef.current?.focus();

    window.addEventListener("sessionStorage", () => {
      const allMessages = getAllValues();
      setMessages(allMessages);
    });

    window.addEventListener("paste", (e) => {
      handlePasteItem(e)(setImagePreview);
    });

    return () => {
      window.removeEventListener("sessionStorage", () => {});
      window.removeEventListener("paste", () => {});
    };
  }, []);

  async function handleSendMessage(e?: any) {
    e?.preventDefault();
    const messageValue: string = inputRef.current?.value as string;
    if (!!fileInputRef?.current?.files?.length) {
      const binary = await getBinaryFromFile(fileInputRef.current?.files?.[0]);
      socket.emit(`${room}:img`, [binary, socket.id]);
      setImagePreview("");
      formRef.current?.reset();
      return;
    }
    if (messageValue?.length > 0) {
      socket.emit(room, `${socket.id}:${messageValue}`);
      setShowEmojiModal(false);
      formRef.current?.reset();
    }
  }

  function handleAddEmoji(emoji: string) {
    if (inputRef.current) inputRef.current.value += emoji;
  }

  return (
    <>
      <div className="grid grid-rows-[96px_1fr_] bg-slate-200 p-4 min-h-screen">
        <RoomHeader roomId={params.roomId} />
        <section className="grid grid-rows-[_1fr_80px] w-full mx-auto rounded-lg min-h-[70vh] max-h-[70%]  sm:pb-20 md:pb-0">
          {/* chat messages */}
          <div className="relative p-2 overflow-x-auto max-h-screen min-h-full">
            {messages
              .sort((a, b) => Number(a.key) - Number(b.key))
              .map((each) => {
                const [senderId] = each.value.replace(/\:/, "&").split("&");
                return (
                  <Message
                    key={each.key}
                    isCurrentUser={senderId === socket?.id}
                    message={each}
                  />
                );
              })}
            {imagePreview.length > 0 && (
              <ImagePreviewModal
                imageUrl={imagePreview}
                onClose={() => setImagePreview("")}
                onSend={handleSendMessage}
                title="Send image?"
              />
            )}
            <div ref={messagesEndRef} />
            <div className="ml-auto mt-80 sticky bottom-2 right-2 max-w-[50%]">
              {showEmojiModal && (
                <EmojiModal
                  onClose={() => setShowEmojiModal(false)}
                  onAddEmoji={handleAddEmoji}
                />
              )}
            </div>
          </div>
          <div className="rounded-full flex flex-col align-center justify-between bg-white shadow-md">
            <div className="flex items-center justify-between min-h-full px-2">
              <form
                className="flex rounded-lg w-[70%] relative"
                onSubmit={handleSendMessage}
                ref={formRef}
              >
                <input
                  ref={inputRef}
                  type="text"
                  className=" w-full rounded-lg p-2 text-gray-900 bg-transparent focus:outline-none"
                  placeholder="Type message..."
                />
                <input
                  ref={fileInputRef}
                  id="file_input"
                  type="file"
                  style={{ display: "none" }}
                />
              </form>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowEmojiModal((prev) => !prev)}
                  className="w-10 h-10 text-slate-50 flex items-center justify-center"
                >
                  <SlEmotsmile
                    color="#045c12"
                    size={24}
                    style={{ opacity: 0.6 }}
                  />
                </button>
                <button
                  onClick={handleSendMessage}
                  type="submit"
                  className="w-10 h-10 bg-emerald-700 flex items-center justify-center rounded-full shadow-md"
                >
                  <HiPaperAirplane color="white" size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Room;
