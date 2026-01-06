export type UserSummary = {
  id: string;
  name: string;
  imageUrl: string | null;
};

export type ChatMessage = {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt: string;
  senderId: string | null;
};

export type ContextMenuState = {
  open: boolean;
  userId: string | null;
  x: number;
  y: number;
};

export type ContactTab = "media" | "link" | "docs";
