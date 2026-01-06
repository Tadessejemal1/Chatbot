import type { UserSummary } from "./types";
import { icons } from "./icons";

/* eslint-disable @next/next/no-img-element */

export function ChatHeaderBar({
  activeUser,
  activeUserOnline,
}: {
  activeUser: UserSummary | null;
  activeUserOnline: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between rounded-[16px] bg-white px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-zinc-200">
            {activeUser?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={activeUser.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : activeUser ? (
              <div className="text-sm font-semibold text-zinc-700">
                {activeUser.name.slice(0, 1).toUpperCase()}
              </div>
            ) : null}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-zinc-900">
              {activeUser?.name ?? "Select a chat"}
            </div>
            <div className="text-xs text-emerald-600">
              {activeUser ? (activeUserOnline ? "Online" : "Online") : ""}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-xl bg-white text-zinc-600 hover:bg-zinc-50"
            aria-label="Search"
          >
            {icons.search}
          </button>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-xl bg-white text-zinc-600 hover:bg-zinc-50"
            aria-label="Audio"
          >
            {icons.phone}
          </button>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-xl bg-white text-zinc-600 hover:bg-zinc-50"
            aria-label="Video"
          >
            {icons.video}
          </button>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-xl bg-white text-zinc-600 hover:bg-zinc-50"
            aria-label="More"
          >
            <img src="/Vector(10).svg" alt="" className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
