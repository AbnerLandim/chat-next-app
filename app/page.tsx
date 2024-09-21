"use client";
import { useRef, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleCreateRoom(e: FormEvent) {
    e.preventDefault();
    const newRoomUuid = uuidv4();
    router.push(`/room/${newRoomUuid}`, {
      // pathname: "/room/[id]",
      // query: { id: newRoomUuid },
    });
    console.log(inputRef.current?.value);
  }

  return (
    <div className="grid grid-rows-[_1fr_] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-cyan-200">
      <main className="flex flex-col rounded bg-white drop-shadow-md w-9/12 h-1/4 p-4">
        <form
          onSubmit={handleCreateRoom}
          className="flex flex-col gap-4 row-start-1 items-center justify-center h-3/4"
        >
          <h2 className="text-slate-700 text-lg">
            Create a room to freely chat
          </h2>
          <input
            ref={inputRef}
            type="text"
            className="rounded p-2 border-2 w-10/12"
            placeholder="Insert room name..."
          />
        </form>
        <button
          type="submit"
          className="rounded p-2 w-10/12 bg-cyan-600 text-white mx-auto"
        >
          Create room
        </button>
      </main>
    </div>
  );
}
