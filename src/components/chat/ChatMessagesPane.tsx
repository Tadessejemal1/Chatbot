import type { RefObject } from "react";
import type { ChatMessage } from "./types";
import { icons } from "./icons";

export function ChatMessagesPane({
  loadingMessages,
  messages,
  meId,
  formatTime,
  messagesEndRef,
}: {
  loadingMessages: boolean;
  messages: ChatMessage[];
  meId: string | null;
  formatTime: (iso: string) => string;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="h-full overflow-hidden rounded-[16px] border border-zinc-200 bg-white shadow-[0_8px_28px_rgba(15,23,42,0.05)]">
        <div className="h-full bg-[#F3F3EE] px-5 py-5">
          {loadingMessages ? (
            <div className="text-sm text-zinc-500">Loading…</div>
          ) : messages.length ? (
            <div className="space-y-3">
              <div className="flex justify-center py-2">
                <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-zinc-500 shadow-sm">
                  Today
                </div>
              </div>
              {messages.map((m) => {
                const isMine = Boolean(meId && m.senderId === meId);
                const time = formatTime(m.createdAt);
                return (
                  <div key={m.id}>
                    {!isMine && time ? (
                      <div className="pl-1 text-[11px] text-zinc-400">{time}</div>
                    ) : null}

                    <div className={"flex " + (isMine ? "justify-end" : "justify-start")}>
                      <div
                        className={
                          "max-w-[65%] min-h-[40px] min-w-[76px] rounded-[12px] px-[12px] py-[12px] text-sm leading-6 " +
                          (isMine
                            ? "bg-[#F0FDF4] text-zinc-900"
                            : "bg-[#FFFFFF] text-zinc-900")
                        }
                      >
                        {m.content}
                      </div>
                    </div>

                    {isMine ? (
                      <div className="mt-1 flex justify-end gap-1 pr-1 text-[11px] text-zinc-400">
                        {time ? <span>{time}</span> : null}
                        <span className="relative h-3.5 w-5 text-emerald-600" aria-label="Delivered">
                          <span className="absolute left-0 top-0 origin-top-left scale-[0.7]">
                            {icons.check}
                          </span>
                          <span className="absolute left-[6px] top-0 origin-top-left scale-[0.7]">
                            {icons.check}
                          </span>
                        </span>
                      </div>
                    ) : null}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="text-sm text-zinc-500">Send a message to start.</div>
          )}
        </div>
      </div>
    </div>
  );
}
