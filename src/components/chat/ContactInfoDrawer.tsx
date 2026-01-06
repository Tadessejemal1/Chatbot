/* eslint-disable @next/next/no-img-element */

import { CONTACT_DOC_SECTIONS, CONTACT_LINK_SECTIONS } from "./contact-sections";
import type { ContactTab, UserSummary } from "./types";
import { icons } from "./icons";

const CONTACT_MEDIA_SECTIONS: Array<{ month: string; items: string[] }> = [
  {
    month: "May",
    items: [
      "/media/Media%281%29.svg",
      "/media/Media%282%29.svg",
      "/media/Media%283%29.svg",
      "/media/Media%284%29.svg",
      "/media/Media%285%29.svg",
      "/media/Media%286%29.svg",
      "/media/Media%287%29.svg",
    ],
  },
  {
    month: "April",
    items: [
      "/media/Media%288%29.svg",
      "/media/Media%289%29.svg",
      "/media/Media%2810%29.svg",
      "/media/Media%2811%29.svg",
      "/media/Media%2812%29.svg",
      "/media/Media%2813%29.svg",
      "/media/Media%2814%29.svg",
      "/media/Media%2815%29.svg",
      "/media/Media%2816%29.svg",
    ],
  },
  {
    month: "March",
    items: [
      "/media/Media%2817%29.svg",
      "/media/Media%2818%29.svg",
      "/media/Media%2819%29.svg",
      "/media/Media%2820%29.svg",
      "/media/Media%2821%29.svg",
      "/media/Media%2822%29.svg",
    ],
  },
];

export function ContactInfoDrawer({
  contactUser,
  contactTab,
  setContactTab,
  onClose,
}: {
  contactUser: UserSummary;
  contactTab: ContactTab;
  setContactTab: (tab: ContactTab) => void;
  onClose: () => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      <div className="pointer-events-auto fixed right-6 top-20 h-[calc(100vh-120px)] w-[420px] rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Contact Info</div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl text-zinc-500 hover:bg-zinc-50"
            aria-label="Close"
          >
            {icons.clear}
          </button>
        </div>

        <div className="mt-6 flex flex-col items-center">
          <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-zinc-200">
            {contactUser.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={contactUser.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="text-2xl font-semibold text-zinc-700">
                {contactUser.name.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <div className="mt-3 text-sm font-semibold text-zinc-900">{contactUser.name}</div>
          <div className="mt-1 text-xs text-zinc-500">
            {(contactUser.name || "user").toLowerCase().replace(/\s+/g, "")}@shipz.com
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            <span className="grid h-5 w-5 place-items-center text-zinc-700">{icons.phone}</span>
            Audio
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            <span className="grid h-5 w-5 place-items-center text-zinc-700">{icons.video}</span>
            Video
          </button>
        </div>

        <div className="mt-5 inline-flex items-center gap-1 rounded-2xl bg-zinc-50 p-1">
          <button
            type="button"
            onClick={() => setContactTab("media")}
            className={
              "rounded-xl px-3 py-2 text-xs font-semibold " +
              (contactTab === "media"
                ? "bg-white text-zinc-900 border border-zinc-200"
                : "text-zinc-500")
            }
          >
            Media
          </button>
          <button
            type="button"
            onClick={() => setContactTab("link")}
            className={
              "rounded-xl px-3 py-2 text-xs font-semibold " +
              (contactTab === "link"
                ? "bg-white text-zinc-900 border border-zinc-200"
                : "text-zinc-500")
            }
          >
            Link
          </button>
          <button
            type="button"
            onClick={() => setContactTab("docs")}
            className={
              "rounded-xl px-3 py-2 text-xs font-semibold " +
              (contactTab === "docs"
                ? "bg-white text-zinc-900 border border-zinc-200"
                : "text-zinc-500")
            }
          >
            Docs
          </button>
        </div>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
          {contactTab === "media" ? (
            <div className="space-y-5">
              {CONTACT_MEDIA_SECTIONS.map((section) => (
                <div key={section.month}>
                  <div className="rounded-xl bg-zinc-50 px-4 py-2 text-xs font-semibold text-zinc-500">
                    {section.month}
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-3">
                    {section.items.map((src) => (
                      <div
                        key={src}
                        className="aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100"
                      >
                        <img src={src} alt="" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {contactTab === "link" ? (
            <div className="space-y-5">
              {CONTACT_LINK_SECTIONS.map((section) => (
                <div key={section.month}>
                  <div className="rounded-xl bg-zinc-50 px-4 py-2 text-xs font-semibold text-zinc-500">
                    {section.month}
                  </div>
                  <div className="mt-3 space-y-2">
                    {section.items.map((item) => (
                      <div key={item.id} className="flex gap-3 rounded-2xl border border-zinc-200 bg-white p-3">
                        <div
                          className={
                            "grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-sm font-bold " +
                            item.badgeClass
                          }
                        >
                          {item.badge}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold text-zinc-900">
                            {item.title}
                          </div>
                          <div className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {contactTab === "docs" ? (
            <div className="space-y-5">
              {CONTACT_DOC_SECTIONS.map((section) => (
                <div key={section.month}>
                  <div className="rounded-xl bg-zinc-50 px-4 py-2 text-xs font-semibold text-zinc-500">
                    {section.month}
                  </div>
                  <div className="mt-3 space-y-2">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-3 py-3"
                      >
                        <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-zinc-100">
                          <div className="h-7 w-6 rounded-lg border border-zinc-200 bg-white" />
                          <div
                            className={
                              "absolute bottom-1 left-1 rounded-md px-1.5 py-0.5 text-[10px] font-extrabold leading-none " +
                              item.kindClass
                            }
                          >
                            {item.kind}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold text-zinc-900">
                            {item.title}
                          </div>
                          <div className="mt-1 truncate text-xs text-zinc-500">{item.meta}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
