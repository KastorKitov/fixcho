const parseUTC = (timestamp: string): Date => {
  // Ensure timestamp is treated as UTC even if the Z suffix is missing
  if (!timestamp.endsWith("Z") && !timestamp.includes("+")) {
    return new Date(timestamp + "Z");
  }
  return new Date(timestamp);
};

export const formatTimeAgo = (createdAt: string): string => {
  const now = new Date();
  const created = parseUTC(createdAt);
  const diff = now.getTime() - created.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days < 1 && hours < 1) return "Just now";
  if (days < 1) return `${hours}h ago`;
  return `${days}d ${hours}h ago`;
};