"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { icons } from "@/components/chat/icons";
import type {
  ChatMessage,
  ContactTab,
  ContextMenuState,
  UserSummary,
} from "@/components/chat/types";
import { ContactInfoDrawer } from "@/components/chat/ContactInfoDrawer";
import { ChatPanel } from "@/components/chat/ChatPanel";

const STORAGE_KEY = "shipper_demo_user";

const DEMO_USERS: UserSummary[] = [
  { id: "u1", name: "Adrian Kurt", imageUrl: null },
  { id: "u2", name: "Yomi Immanuel", imageUrl: null },
  { id: "u3", name: "Bianca Nubia", imageUrl: null },
  { id: "u4", name: "Zender Lowre", imageUrl: null },
  { id: "u5", name: "Palmer Dian", imageUrl: null },
  { id: "u6", name: "Yuki Tanaka", imageUrl: null },
];

export default function Home() {
  const router = useRouter();

  const [me, setMe] = useState<UserSummary | null>(null);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeChatTitle, setActiveChatTitle] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threads, setThreads] = useState<Record<string, ChatMessage[]>>({});
  const [search, setSearch] = useState("");
  const [composer, setComposer] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [unreadUserIds, setUnreadUserIds] = useState<Set<string>>(new Set());
  const [archivedUserIds, setArchivedUserIds] = useState<Set<string>>(new Set());

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [newMessageQuery, setNewMessageQuery] = useState("");
  const newMessageRef = useRef<HTMLDivElement | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    open: false,
    userId: null,
    x: 0,
    y: 0,
  });
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  const [contactUserId, setContactUserId] = useState<string | null>(null);
  const [contactTab, setContactTab] = useState<ContactTab>("media");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeUser = useMemo(
    () => (activeUserId ? users.find((u) => u.id === activeUserId) ?? null : null),
    [activeUserId, users],
  );

  const activeUserOnline = useMemo(() => {
    if (!activeUserId) return false;
    return onlineUserIds.has(activeUserId);
  }, [activeUserId, onlineUserIds]);

  function formatTime(iso: string) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  const contactUser = useMemo(
    () => (contactUserId ? users.find((u) => u.id === contactUserId) ?? null : null),
    [contactUserId, users],
  );

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.name.toLowerCase().includes(q));
  }, [search, users]);

  const newMessageUsers = useMemo(() => {
    const q = newMessageQuery.trim().toLowerCase();
    const list = users.filter((u) => u.id !== me?.id);
    if (!q) return list;
    return list.filter((u) => u.name.toLowerCase().includes(q));
  }, [me?.id, newMessageQuery, users]);

  function toggleTheme() {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }

  async function logout() {
    localStorage.removeItem(STORAGE_KEY);
    router.push("/login");
    router.refresh();
  }

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") document.documentElement.classList.add("dark");

    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    const user =
      parsed && typeof parsed === "object"
        ? {
            id: typeof (parsed as any).id === "string" ? (parsed as any).id : "me",
            name: typeof (parsed as any).name === "string" ? (parsed as any).name : "User",
            imageUrl:
              typeof (parsed as any).imageUrl === "string" || (parsed as any).imageUrl === null
                ? (parsed as any).imageUrl
                : null,
          }
        : null;

    if (!user) {
      router.push("/login");
      return;
    }

    setMe(user);

    setLoadingUsers(true);
    setUsers([user, ...DEMO_USERS]);
    setLoadingUsers(false);

    // Demo presence: all contacts show offline by default.
    setOnlineUserIds(new Set());

    const toTodayIso = (hour: number, minute: number) => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0).toISOString();
    };

    const contactIds = DEMO_USERS.map((u) => u.id);
    setThreads((prev) => {
      const next: Record<string, ChatMessage[]> = { ...prev };

      for (const contactId of contactIds) {
        if (next[contactId]?.length) continue;
        next[contactId] = [
          {
            id: `${contactId}-seed-1`,
            role: "USER",
            content: "Hey, Jonjon",
            createdAt: toTodayIso(10, 17),
            senderId: contactId,
          },
          {
            id: `${contactId}-seed-2`,
            role: "USER",
            content: "Can you help with with the last task for Eventora, please?",
            createdAt: toTodayIso(10, 17),
            senderId: contactId,
          },
          {
            id: `${contactId}-seed-3`,
            role: "USER",
            content: "I'm little bit confused with the task.. 😊",
            createdAt: toTodayIso(10, 17),
            senderId: contactId,
          },
          {
            id: `${contactId}-seed-4`,
            role: "USER",
            content: "it's done already, no worries!",
            createdAt: toTodayIso(10, 22),
            senderId: user.id,
          },
          {
            id: `${contactId}-seed-5`,
            role: "USER",
            content: "what...",
            createdAt: toTodayIso(10, 32),
            senderId: contactId,
          },
          {
            id: `${contactId}-seed-6`,
            role: "USER",
            content: "Really?! Thank you so much! 😍",
            createdAt: toTodayIso(10, 32),
            senderId: contactId,
          },
          {
            id: `${contactId}-seed-7`,
            role: "USER",
            content: "anytime! my pleasure~ ❤️",
            createdAt: toTodayIso(11, 1),
            senderId: user.id,
          },
        ];
      }

      return next;
    });

    setActiveUserId((current) => current ?? contactIds[0] ?? null);
  }, [router]);

  useEffect(() => {
    if (!activeUserId) {
      setActiveSessionId(null);
      setActiveChatTitle(null);
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    setActiveSessionId(activeUserId);
    setActiveChatTitle(null);
    setMessages([]);

    const nextMsgs = threads[activeUserId] ?? [];
    // Slight delay to mimic loading.
    const t = window.setTimeout(() => {
      setMessages(nextMsgs);
      setLoadingMessages(false);
    }, 150);
    return () => window.clearTimeout(t);
  }, [activeUserId, threads]);

  async function sendMessage() {
    const content = composer.trim();
    if (!content || sending) return;

    const sessionId = activeSessionId;
    const userId = activeUserId;
    if (!sessionId || !userId) return;

    setSending(true);
    try {
      const now = new Date().toISOString();
      const newMessage: ChatMessage = {
        id: `${Date.now()}`,
        role: "USER",
        content,
        createdAt: now,
        senderId: me?.id ?? "me",
      };

      setThreads((prev) => {
        const existing = prev[userId] ?? [];
        return { ...prev, [userId]: [...existing, newMessage] };
      });

      setMessages((prev) => [...prev, newMessage]);
      setComposer("");

      // Demo auto-reply from the contact (avoid echoing the user's message).
      const replyText = "Got it — I’ll take a look and get back to you. 👍";
      const reply: ChatMessage = {
        id: `${Date.now()}-r`,
        role: "ASSISTANT",
        content: replyText,
        createdAt: new Date(Date.now() + 500).toISOString(),
        senderId: userId,
      };

      window.setTimeout(() => {
        setThreads((prev) => {
          const existing = prev[userId] ?? [];
          return { ...prev, [userId]: [...existing, reply] };
        });

        // Keep the UI snappy if the user is still on this chat.
        if (activeUserId === userId) setMessages((prev) => [...prev, reply]);
      }, 500);
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    if (!menuOpen && !newMessageOpen && !contextMenu.open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setNewMessageOpen(false);
        setContextMenu((prev) => ({ ...prev, open: false, userId: null }));
      }
    }

    function onPointerDown(e: MouseEvent) {
      const t = e.target as Node | null;
      if (menuRef.current && t && menuRef.current.contains(t)) return;
      if (newMessageRef.current && t && newMessageRef.current.contains(t)) return;
      if (contextMenuRef.current && t && contextMenuRef.current.contains(t)) return;
      setMenuOpen(false);
      setNewMessageOpen(false);
      setContextMenu((prev) => ({ ...prev, open: false, userId: null }));
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onPointerDown);
    };
  }, [menuOpen, newMessageOpen, contextMenu.open]);

  useEffect(() => {
    if (!contactUserId) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setContactUserId(null);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [contactUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen w-screen bg-[#F3F3EE] text-zinc-900">
      <div className="flex h-full w-full flex-col gap-[24px] p-[24px]">
        <div className="flex items-center gap-[24px]">
          <div className="flex w-[76px] items-center justify-center">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="grid h-11 w-11 place-items-center"
              aria-label="Open menu"
              type="button"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Container(1).svg" alt="" className="h-11 w-11" />
            </button>
          </div>
          <header className="flex h-[56px] flex-1 items-center justify-between gap-[24px] rounded-[16px] border border-zinc-200 bg-white px-[24px] py-[12px]">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 bg-white px-4 text-sm font-medium text-zinc-900"
              >
                <img src="/Vector(4).svg" alt="" className="h-4 w-4" />
                Message
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="hidden h-10 items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 text-sm text-zinc-500 md:inline-flex"
              >
                <span className="text-zinc-400">{icons.search}</span>
                <span className="pr-6">Search</span>
                <span className="rounded-xl border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs text-zinc-500">
                  ⌘ K
                </span>
              </button>

              <button
                className="grid h-10 w-10 place-items-center rounded-2xl text-zinc-600 hover:bg-zinc-100"
                aria-label="Notifications"
              >
                <img src="/Vector(3).svg" alt="" className="h-5 w-5" />
              </button>
              <button
                className="grid h-10 w-10 place-items-center rounded-2xl text-zinc-600 hover:bg-zinc-100"
                aria-label="Settings"
              >
                <img src="/Vector(2).svg" alt="" className="h-5 w-5" />
              </button>

              <div className="mx-1 h-6 w-px bg-zinc-200" />

              <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-zinc-200">
                {me?.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={me.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="grid h-10 w-10 place-items-center rounded-2xl text-zinc-600 hover:bg-zinc-100"
                aria-label="Open menu"
              >
                {icons.chevronDown}
              </button>
            </div>
          </header>
        </div>

        <div className="flex min-h-0 flex-1 gap-[24px]">
          <aside className="flex h-full w-[76px] flex-col items-center justify-between px-[16px] py-[24px]">
            <div className="flex w-full flex-col items-center gap-5">
              <button
                type="button"
                className="grid h-11 w-11 place-items-center rounded-2xl text-zinc-900 hover:bg-white"
                aria-label="Home"
              >
                <img src="/Vector(1).svg" alt="" className="h-5 w-5" />
              </button>

              <button
                type="button"
                className="grid h-11 w-11 place-items-center rounded-2xl border border-emerald-600 bg-[#F0FDF4] text-zinc-900"
                aria-label="Messages"
              >
                <img src="/Vector(5).svg" alt="" className="h-5 w-5" />
              </button>

              <button
                type="button"
                className="grid h-11 w-11 place-items-center rounded-2xl text-zinc-900 hover:bg-white"
                aria-label="Explore"
              >
                <img src="/Vector(6).svg" alt="" className="h-5 w-5" />
              </button>

              <button
                type="button"
                className="grid h-11 w-11 place-items-center rounded-2xl text-zinc-900 hover:bg-white"
                aria-label="Files"
              >
                <img src="/Vector(7).svg" alt="" className="h-5 w-5" />
              </button>

              <button
                type="button"
                className="grid h-11 w-11 place-items-center rounded-2xl text-zinc-900 hover:bg-white"
                aria-label="Media"
              >
                <img src="/Vector(8).svg" alt="" className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1" />

            <button
              type="button"
              className="mb-5 grid h-11 w-11 place-items-center rounded-2xl text-zinc-900 hover:bg-white"
              aria-label="Magic"
            >
              <img src="/Vector(9).svg" alt="" className="h-5 w-5" />
            </button>

            <div className="mb-2 grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-zinc-200">
              {me?.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={me.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="text-sm font-semibold text-zinc-700">
                  {(me?.name ?? "U").slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
          </aside>

          {menuOpen ? (
            <div className="pointer-events-auto fixed inset-0 z-50">
              <div
                ref={menuRef}
                className="absolute left-4 top-16 flex h-[428px] w-[307px] flex-col gap-[4px] rounded-[16px] border border-zinc-200 bg-white p-[4px] opacity-100 shadow-lg"
              >
                <div className="rounded-2xl bg-zinc-50 p-[4px]">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      router.push("/");
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left hover:bg-white"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-2xl bg-white text-zinc-700">
                      {icons.chevronLeft}
                    </span>
                    <span className="text-sm font-medium">Go back to dashboard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!activeSessionId) return;
                      const next = window.prompt(
                        "Rename chat",
                        activeChatTitle ?? activeUser?.name ?? "",
                      );
                      const title = (next ?? "").trim();
                      if (!title) return;
                      void (async () => {
                        const res = await fetch(`/api/chats/${activeSessionId}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ title }),
                        });
                        if (res.ok) {
                          setActiveChatTitle(title);
                          setMenuOpen(false);
                        }
                      })();
                    }}
                    disabled={!activeSessionId}
                    className="mt-[4px] flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-zinc-900 hover:bg-white disabled:opacity-50"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-2xl bg-white text-zinc-700">
                      {icons.pencil}
                    </span>
                    <span className="text-sm font-medium text-black">Rename file</span>
                  </button>

                  <div className="mt-[4px] border-t border-zinc-200/60 pt-[12px]">
                    <div className="px-3">
                      <div className="text-sm font-semibold">{me?.name ?? ""}</div>
                      <div className="text-xs text-zinc-500">
                        {(me?.name ?? "user").toLowerCase().replace(/\s+/g, "")}@shipper.local
                      </div>
                    </div>

                    <div className="mt-[12px] rounded-2xl bg-white p-3">
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <div>Credits</div>
                        <div>Renews in</div>
                      </div>
                      <div className="mt-1 flex items-end justify-between">
                        <div className="text-sm font-semibold text-zinc-900">20 left</div>
                        <div className="text-sm font-semibold text-zinc-900">6h 24m</div>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-zinc-100">
                        <div className="h-2 w-[70%] rounded-full bg-emerald-600" />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
                        <div>5 of 25 used today</div>
                        <div className="text-emerald-600">+25 tomorrow</div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    window.alert("Coming soon");
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left hover:bg-zinc-50"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-zinc-50 text-zinc-700">
                    {icons.gift}
                  </span>
                  <span className="text-sm font-semibold">Win free credits</span>
                </button>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left hover:bg-zinc-50"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-zinc-50 text-zinc-700">
                    {icons.sun}
                  </span>
                  <span className="text-sm font-semibold">Theme Style</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    void logout();
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left hover:bg-zinc-50"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-zinc-50 text-zinc-700">
                    {icons.logout}
                  </span>
                  <span className="text-sm font-semibold">Log out</span>
                </button>
              </div>
            </div>
          ) : null}

          <aside className="flex h-full w-[400px] flex-col gap-[24px] rounded-[24px] bg-white p-[24px]">
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="text-xl font-semibold">All Message</div>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setNewMessageOpen((v) => !v);
                    setNewMessageQuery("");
                  }}
                  className="inline-flex h-9 items-center gap-2 rounded-xl bg-emerald-600 px-3 text-sm font-medium text-white"
                  aria-label="New Message"
                >
                  <span className="grid h-5 w-5 place-items-center">{icons.pencil}</span>
                  New Message
                </button>
              </div>

              {newMessageOpen ? (
                <div
                  ref={newMessageRef}
                  className="absolute right-0 top-12 z-40 h-[440px] w-[273px] rounded-[16px] border border-zinc-200 bg-white p-[12px]"
                >
                  <div className="text-base font-semibold text-zinc-900">New Message</div>

                  <div className="mt-3 flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2">
                    <span className="text-zinc-400">{icons.search}</span>
                    <input
                      value={newMessageQuery}
                      onChange={(e) => setNewMessageQuery(e.target.value)}
                      placeholder="Search name or email"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                      autoFocus
                    />
                  </div>

                  <div className="mt-3 h-[356px] overflow-y-auto">
                    {newMessageUsers.length ? (
                      <div className="space-y-1">
                        {newMessageUsers.map((u) => (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => {
                              setActiveUserId(u.id);
                              setNewMessageOpen(false);
                            }}
                            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left hover:bg-zinc-100"
                          >
                            <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-zinc-200">
                              {u.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={u.imageUrl} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <div className="text-sm font-semibold text-zinc-700">
                                  {u.name.slice(0, 1).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="truncate text-sm font-medium text-zinc-900">{u.name}</div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-2 py-3 text-sm text-zinc-500">No users.</div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2">
                <span className="text-zinc-400">{icons.search}</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search in message"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                />
              </div>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-xl border border-zinc-200 bg-white text-zinc-600"
                aria-label="Filter"
              >
                <img src="/Vector(12).svg" alt="" className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingUsers ? (
                <div className="px-2 py-3 text-sm text-zinc-500">Loading…</div>
              ) : filteredUsers.length ? (
                filteredUsers.map((u) => {
                  const isActive = u.id === activeUserId;
                  const isOnline = onlineUserIds.has(u.id);
                  const isUnread = unreadUserIds.has(u.id);
                  const isArchived = archivedUserIds.has(u.id);

                  return (
                    <div
                      key={u.id}
                      className="flex w-full items-stretch gap-3"
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        const MENU_W = 260;
                        const MENU_H = 320;
                        const pad = 12;
                        const x = Math.min(e.clientX, window.innerWidth - MENU_W - pad);
                        const y = Math.min(e.clientY, window.innerHeight - MENU_H - pad);

                        setMenuOpen(false);
                        setNewMessageOpen(false);
                        setContextMenu({ open: true, userId: u.id, x, y });
                      }}
                    >
                      {isUnread ? (
                        <button
                          type="button"
                          onClick={() =>
                            setUnreadUserIds((prev) => {
                              const next = new Set(prev);
                              next.delete(u.id);
                              return next;
                            })
                          }
                          className="grid w-[74px] place-items-center rounded-2xl bg-emerald-600 px-2 py-3 text-white"
                          aria-label="Unread"
                        >
                          <div className="grid h-6 w-6 place-items-center">{icons.unread}</div>
                          <div className="mt-1 text-xs font-semibold">Unread</div>
                        </button>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => setActiveUserId(u.id)}
                        className={
                          "flex min-w-0 flex-1 items-center gap-3 rounded-2xl bg-zinc-50 px-4 py-3 text-left hover:bg-zinc-100 " +
                          (isActive ? "ring-1 ring-zinc-200" : "")
                        }
                      >
                        <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-zinc-200 text-sm font-semibold text-zinc-700">
                          {u.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={u.imageUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            u.name.slice(0, 1).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="truncate text-sm font-semibold text-zinc-900">
                              {u.name}
                            </div>
                            <div className="shrink-0 text-xs text-zinc-400">
                              {isOnline ? "Online" : ""}
                            </div>
                          </div>
                          <div className="truncate text-xs text-zinc-500">
                            Thanks for the explanation!
                          </div>
                        </div>
                      </button>

                      {isArchived ? (
                        <button
                          type="button"
                          onClick={() =>
                            setArchivedUserIds((prev) => {
                              const next = new Set(prev);
                              next.delete(u.id);
                              return next;
                            })
                          }
                          className="grid w-[74px] place-items-center rounded-2xl bg-emerald-600 px-2 py-3 text-white"
                          aria-label="Archive"
                        >
                          <div className="grid h-6 w-6 place-items-center">{icons.archive}</div>
                          <div className="mt-1 text-xs font-semibold">Archive</div>
                        </button>
                      ) : null}
                    </div>
                  );
                })
              ) : (
                <div className="px-2 py-3 text-sm text-zinc-500">No users.</div>
              )}
            </div>

            {contextMenu.open ? (
              <div className="pointer-events-none fixed inset-0 z-50">
                <div
                  ref={contextMenuRef}
                  style={{ left: contextMenu.x, top: contextMenu.y }}
                  className="pointer-events-auto fixed w-[260px] rounded-[16px] border border-zinc-200 bg-white p-2 shadow-lg"
                >
                  {(
                    [
                      { key: "unread", label: "Mark as unread", icon: icons.unread },
                      { key: "archive", label: "Archive", icon: icons.archive },
                      {
                        key: "mute",
                        label: "Mute",
                        icon: icons.mute,
                        right: icons.chevronRight,
                      },
                      { key: "info", label: "Contact info", icon: icons.info },
                      { key: "export", label: "Export chat", icon: icons.export },
                      { key: "clear", label: "Clear chat", icon: icons.clear },
                    ] as Array<{
                      key: "unread" | "archive" | "mute" | "info" | "export" | "clear";
                      label: string;
                      icon: ReactNode;
                      right?: ReactNode;
                    }>
                  ).map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        const userId = contextMenu.userId;
                        setContextMenu((prev) => ({ ...prev, open: false, userId: null }));
                        if (!userId) return;

                        if (item.key === "unread") {
                          setUnreadUserIds((prev) => {
                            const next = new Set(prev);
                            if (next.has(userId)) next.delete(userId);
                            else next.add(userId);
                            return next;
                          });
                          return;
                        }

                        if (item.key === "archive") {
                          setArchivedUserIds((prev) => {
                            const next = new Set(prev);
                            if (next.has(userId)) next.delete(userId);
                            else next.add(userId);
                            return next;
                          });
                          return;
                        }

                        if (item.key === "info") {
                          setContactUserId(userId);
                          setContactTab("media");
                          return;
                        }
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-zinc-900 hover:bg-zinc-50"
                    >
                      <span className="grid h-5 w-5 place-items-center text-zinc-700">
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {item.right ? (
                        <span className="grid h-5 w-5 place-items-center text-zinc-400">
                          {item.right}
                        </span>
                      ) : null}
                    </button>
                  ))}

                  <div className="my-1 h-px w-full bg-zinc-200" />

                  <button
                    type="button"
                    onClick={() => {
                      setContextMenu((prev) => ({ ...prev, open: false, userId: null }));
                      // UI-only for now.
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                  >
                    <span className="grid h-5 w-5 place-items-center">{icons.trash}</span>
                    <span className="flex-1">Delete chat</span>
                  </button>
                </div>
              </div>
            ) : null}

            {contactUser ? (
              <ContactInfoDrawer
                contactUser={contactUser}
                contactTab={contactTab}
                setContactTab={setContactTab}
                onClose={() => setContactUserId(null)}
              />
            ) : null}
          </aside>

          <main className="flex min-w-0 flex-1 flex-col">
            <ChatPanel
              activeUser={activeUser}
              activeUserOnline={activeUserOnline}
              loadingMessages={loadingMessages}
              messages={messages}
              meId={me?.id ?? null}
              formatTime={formatTime}
              messagesEndRef={messagesEndRef}
              composer={composer}
              setComposer={setComposer}
              sending={sending}
              sendMessage={() => void sendMessage()}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
