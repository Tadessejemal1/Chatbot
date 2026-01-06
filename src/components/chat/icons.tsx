import type { ReactNode } from "react";

function Icon({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "h-5 w-5"}
    >
      {children}
    </svg>
  );
}

export const icons = {
  logo: (
    <svg viewBox="0 0 48 48" className="h-6 w-6" aria-hidden>
      <circle cx="24" cy="24" r="20" fill="currentColor" />
      <path
        d="M16 30l1.2-5 12.1-12.1a2.2 2.2 0 0 1 3.1 0l1.7 1.7a2.2 2.2 0 0 1 0 3.1L22 29.8 16 30z"
        fill="white"
      />
      <path d="M27 14l7 7" stroke="white" strokeWidth="2" />
    </svg>
  ),
  home: (
    <Icon>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 10v10h14V10" />
    </Icon>
  ),
  chat: (
    <Icon>
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </Icon>
  ),
  settings: (
    <Icon>
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
      <path d="M19.4 15a7.8 7.8 0 0 0 .1-1l2-1.3-2-3.4-2.4.6a7.4 7.4 0 0 0-1.7-1L14.9 6h-4l-.5 2a7.4 7.4 0 0 0-1.7 1l-2.4-.6-2 3.4L6.3 14a7.8 7.8 0 0 0 .1 1l-2 1.3 2 3.4 2.4-.6a7.4 7.4 0 0 0 1.7 1l.5 2h4l.5-2a7.4 7.4 0 0 0 1.7-1l2.4.6 2-3.4z" />
    </Icon>
  ),
  search: (
    <Icon>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </Icon>
  ),
  filter: (
    <Icon>
      <path d="M3 5h18" />
      <path d="M7 12h10" />
      <path d="M10 19h4" />
    </Icon>
  ),
  send: (
    <Icon>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4z" />
    </Icon>
  ),
  msg: (
    <Icon>
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </Icon>
  ),
  chevronLeft: (
    <Icon>
      <path d="M15 18l-6-6 6-6" />
    </Icon>
  ),
  pencil: (
    <Icon>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </Icon>
  ),
  gift: (
    <Icon>
      <path d="M20 12v10H4V12" />
      <path d="M2 7h20v5H2z" />
      <path d="M12 22V7" />
      <path d="M12 7H7.5a2.5 2.5 0 1 1 0-5C9 2 10 3 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 1 0 0-5C15 2 14 3 12 7z" />
    </Icon>
  ),
  sun: (
    <Icon>
      <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.93 19.07l1.41-1.41" />
      <path d="M17.66 6.34l1.41-1.41" />
    </Icon>
  ),
  logout: (
    <Icon>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </Icon>
  ),
  bell: (
    <Icon>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </Icon>
  ),
  chevronDown: (
    <Icon>
      <path d="M6 9l6 6 6-6" />
    </Icon>
  ),
  compass: (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <path d="M16 8l-2.6 6.4L7 17l2.6-6.4L16 8z" />
    </Icon>
  ),
  folder: (
    <Icon>
      <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    </Icon>
  ),
  image: (
    <Icon>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M8 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
      <path d="M21 16l-6-6-8 8" />
    </Icon>
  ),
  sparkle: (
    <Icon>
      <path d="M12 2l1.2 4.2L17 8l-3.8 1.8L12 14l-1.2-4.2L7 8l3.8-1.8L12 2z" />
    </Icon>
  ),
  unread: (
    <Icon>
      <path d="M20 12a8 8 0 1 1-16 0" />
      <path d="M4 12a8 8 0 0 1 12.8-6.4" />
      <path d="M12 7v5l3 2" />
    </Icon>
  ),
  archive: (
    <Icon>
      <path d="M3 7h18" />
      <path d="M5 7v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7" />
      <path d="M10 11h4" />
    </Icon>
  ),
  mute: (
    <Icon>
      <path d="M11 5 6 9H3v6h3l5 4V5z" />
      <path d="M23 9l-6 6" />
      <path d="M17 9l6 6" />
    </Icon>
  ),
  info: (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" />
      <path d="M12 7h.01" />
    </Icon>
  ),
  export: (
    <Icon>
      <path d="M12 3v12" />
      <path d="M8 7l4-4 4 4" />
      <path d="M5 21h14" />
    </Icon>
  ),
  clear: (
    <Icon>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </Icon>
  ),
  trash: (
    <Icon>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M7 6l1 16h8l1-16" />
      <path d="M10 11v7" />
      <path d="M14 11v7" />
    </Icon>
  ),
  chevronRight: (
    <Icon>
      <path d="M9 18l6-6-6-6" />
    </Icon>
  ),
  phone: (
    <Icon>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 11.2 19a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.4 2.1L8.1 9.6a16 16 0 0 0 6.3 6.3l1.2-1.2a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" />
    </Icon>
  ),
  video: (
    <Icon>
      <path d="M23 7l-7 5 7 5V7z" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </Icon>
  ),
  dots: (
    <Icon>
      <path d="M5 12h.01" />
      <path d="M12 12h.01" />
      <path d="M19 12h.01" />
    </Icon>
  ),
  mic: (
    <Icon>
      <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" />
      <path d="M19 11a7 7 0 0 1-14 0" />
      <path d="M12 18v4" />
      <path d="M8 22h8" />
    </Icon>
  ),
  paperclip: (
    <Icon>
      <path d="M21.4 11.6 12.9 20a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5" />
    </Icon>
  ),
  smile: (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <path d="M9 10h.01" />
      <path d="M15 10h.01" />
    </Icon>
  ),
  check: (
    <Icon>
      <path d="M20 6 9 17l-5-5" />
    </Icon>
  ),
};
