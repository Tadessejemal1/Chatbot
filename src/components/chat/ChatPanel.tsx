import type { RefObject } from "react";
import type { ChatMessage, UserSummary } from "./types";
import { ChatHeaderBar } from "./ChatHeaderBar";
import { ChatMessagesPane } from "./ChatMessagesPane";
import { ChatComposer } from "./ChatComposer";

export function ChatPanel({
  activeUser,
  activeUserOnline,
  loadingMessages,
  messages,
  meId,
  formatTime,
  messagesEndRef,
  composer,
  setComposer,
  sending,
  sendMessage,
}: {
  activeUser: UserSummary | null;
  activeUserOnline: boolean;
  loadingMessages: boolean;
  messages: ChatMessage[];
  meId: string | null;
  formatTime: (iso: string) => string;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  composer: string;
  setComposer: (next: string) => void;
  sending: boolean;
  sendMessage: () => void;
}) {
  return (
    <section className="flex min-h-0 flex-1">
      <div className="flex min-h-0 w-full flex-1 flex-col gap-6 rounded-[24px] bg-white p-[24px]">
        <ChatHeaderBar activeUser={activeUser} activeUserOnline={activeUserOnline} />
        <ChatMessagesPane
          loadingMessages={loadingMessages}
          messages={messages}
          meId={meId}
          formatTime={formatTime}
          messagesEndRef={messagesEndRef}
        />
        <ChatComposer
          composer={composer}
          setComposer={setComposer}
          sending={sending}
          sendMessage={sendMessage}
        />
      </div>
    </section>
  );
}
