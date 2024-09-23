"use client";
import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { useSocket } from "@/components/providers/socket-provider";
import useSessionStorage from "@/hooks/useSessionStorage";

function Room({ params }: { params: { roomId: string } }) {
  const { isConnected, socket } = useSocket();
  const [messages, setMessages] = useState<{ key: string; value: string }[]>(
    []
  );
  const { getAllValues, clearAllValues } = useSessionStorage();
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    clearAllValues();

    window.addEventListener("sessionStorage", () => {
      const allMessages = getAllValues();
      setMessages(allMessages);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    return () => {
      window.removeEventListener("sessionStorage", () => {});
    };
  }, []);

  function handleSendMessage(e: any) {
    e.preventDefault();
    const messageValue: string = inputRef.current?.value as string;
    if (messageValue?.length > 0) {
      socket.emit("message", `${socket.id}:${messageValue}`);
      formRef.current?.reset();
    }
  }

  return (
    <div className="grid grid-rows-[96px_1fr_] bg-gray-800 p-4 min-h-screen">
      <section className="text-white">
        <div className="text-sm pb-1">Room Id: {params.roomId}</div>
        <div className="flex align-center justify-start gap-2">
          {/* <span>Status:</span> */}
          <div
            className={`rounded-lg ${
              isConnected ? "bg-lime-600" : "bg-red-500"
            }  py-0.5 px-1 my-auto`}
          >
            <span className="text-sm">
              {isConnected ? "connected" : "disconnected"}
            </span>
          </div>
        </div>
      </section>
      <section className="grid grid-rows-[_1fr_40px] w-full mx-auto rounded-lg md:max-h-[90%] bg-slate-300 sm:pb-20 md:pb-0">
        {/* chat messages */}
        <div className="p-2 overflow-scroll">
          {messages
            .sort((a: any, b: any) => a.key - b.key)
            .map((each) => {
              const [senderId, messageContent] = each.value.split(":");
              const formattedDate = new Intl.DateTimeFormat("en-US", {
                timeStyle: "medium",
                dateStyle: "short",
              }).format(new Date(Number(each.key)));
              return (
                <div
                  className={`${
                    senderId === socket?.id ? "ml-auto" : ""
                  } w-9/12 ${
                    senderId === socket?.id ? "bg-emerald-500" : "bg-teal-600"
                  } rounded p-2 mb-2 last:mb-80`}
                  key={each.key}
                >
                  <div className="flex flex-col gap-2">
                    <span className="mr-auto text-slate-50 text-sm">
                      {senderId}
                    </span>
                    <span className="text-slate-50 break-all">
                      {messageContent}
                    </span>
                    <span className="ml-auto text-slate-50 text-sm">
                      {formattedDate}
                    </span>
                  </div>
                </div>
              );
            })}
          <div ref={messagesEndRef} />
        </div>
        <div className="rounded-b-lg flex align-center justify-between bg-white">
          <form
            className="rounded-b-lg w-11/12"
            onSubmit={handleSendMessage}
            ref={formRef}
          >
            <input
              ref={inputRef}
              type="text"
              className="rounded-b-lg p-2 w-full text-gray-800"
              placeholder="Type message..."
            />
          </form>
          <button
            onClick={handleSendMessage}
            type="submit"
            className=" w-10 h-10 text-slate-50 "
          >
            <FontAwesomeIcon icon={faLocationArrow} size="lg" color="green" />
          </button>
        </div>
      </section>
    </div>
  );
}

export default Room;
