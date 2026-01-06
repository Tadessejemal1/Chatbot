import { icons } from "./icons";

export function ChatComposer({
  composer,
  setComposer,
  sending,
  sendMessage,
}: {
  composer: string;
  setComposer: (next: string) => void;
  sending: boolean;
  sendMessage: () => void;
}) {
  return (
    <div>
      <div className="rounded-[16px] border border-zinc-200 bg-white px-4 py-3">
        <div className="flex items-end gap-3">
          <textarea
            value={composer}
            onChange={(e) => setComposer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type any message..."
            rows={1}
            className="max-h-40 min-h-[24px] w-full resize-none bg-transparent text-sm leading-6 outline-none placeholder:text-zinc-400"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-xl text-zinc-600 hover:bg-zinc-50"
              aria-label="Voice"
            >
              {icons.mic}
            </button>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-xl text-zinc-600 hover:bg-zinc-50"
              aria-label="Emoji"
            >
              {icons.smile}
            </button>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-xl text-zinc-600 hover:bg-zinc-50"
              aria-label="Attach"
            >
              {icons.paperclip}
            </button>
            <button
              onClick={sendMessage}
              disabled={!composer.trim() || sending}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
              aria-label="Send"
            >
              {icons.send}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
