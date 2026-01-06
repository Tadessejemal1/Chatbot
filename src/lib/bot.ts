export function generateBotReply(userMessage: string): string {
  const trimmed = userMessage.trim();
  if (!trimmed) return "Send me a message and I’ll reply.";

  const text = trimmed.toLowerCase();

  if (/(^|\b)(hi|hello|hey|yo|good\s*(morning|afternoon|evening))(\b|$)/i.test(
    trimmed,
  )) {
    return "Hi! I’m Shipper Bot. What do you need help with — a quote, tracking, or delivery ETA?";
  }

  if (/(\b)(help|support|agent|human|customer\s*service)(\b)/i.test(trimmed)) {
    return "Sure — tell me what went wrong (order/tracking ID if you have it) and I’ll guide you. If you want a human agent, say “agent”.";
  }

  if (/(\b)(track|tracking|where\s+is|status)(\b)/i.test(trimmed)) {
    return "I can help with tracking. Share your tracking number (or order ID) and I’ll tell you the latest status and next steps.";
  }

  if (/(\b)(eta|delivery\s*time|when\s+will|arrive|arrival)(\b)/i.test(trimmed)) {
    return "For an ETA, share origin + destination, service type (standard/express), and pickup date. If you have a tracking number, send it and I’ll check status.";
  }

  if (/(\b)(price|quote|rate|cost|how\s*much|pricing)(\b)/i.test(trimmed)) {
    return "To estimate cost, send: origin, destination, weight, dimensions, and delivery speed (standard/express).";
  }

  if (/(\b)(pickup|pick\s*up|collection|schedule)(\b)/i.test(trimmed)) {
    return "To schedule a pickup, send the pickup address, preferred date/time window, and package count + weight.";
  }

  if (/(\b)(refund|return|cancel)(\b)/i.test(trimmed)) {
    return "I can help with refunds/returns. Share your order ID and tell me whether the shipment was delivered, in transit, or not picked up yet.";
  }

  if (/(\b)(customs|duty|tax|invoice|hs\s*code)(\b)/i.test(trimmed)) {
    return "For customs help, tell me the destination country, item description, value, and whether it’s personal or commercial. If you have an invoice, that helps too.";
  }

  if (/(\b)(lost|missing|damaged|broken)(\b)/i.test(trimmed)) {
    return "Sorry about that. Please share the tracking number, what’s missing/damaged, and photos if available. I’ll guide you through the claim steps.";
  }

  const short = trimmed.length > 160 ? trimmed.slice(0, 160) + "…" : trimmed;
  return `Got it: “${short}”. Tell me what you want to do next (quote, track, ETA, pickup, or support).`;
}
