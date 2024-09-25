"use client";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const router = useRouter();

  function handleCreateRoom(e: FormEvent) {
    e.preventDefault();
    const newRoomUuid = uuidv4();
    router.push(`/room/${newRoomUuid}`);
  }

  return (
    <div className="grid grid-rows-[_1fr_] items-center justify-items-center min-h-screen py-8 px-16 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-800">
      <main className="flex flex-col rounded bg-white drop-shadow-md w-9/12 h-1/4 p-4 min-w-80 sm:min-w-80">
        <div className="flex flex-col gap-4 row-start-1 items-center justify-center h-2/4 px-4">
          <h2 className="text-slate-700 text-lg font-mono">
            Create a room and share the link with your friends to freely chat
          </h2>
        </div>
        <button
          type="button"
          onClick={handleCreateRoom}
          className="rounded p-2 w-10/12 bg-cyan-600 text-white mx-auto font-mono"
        >
          Start chat
        </button>
      </main>
    </div>
  );
}
