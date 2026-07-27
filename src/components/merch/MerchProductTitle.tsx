import React from "react";

interface MerchTitleConfig {
  category: string;
  /** Plain text version of the clean product name. */
  name: string;
  /** Rendered version (allows italics etc). */
  node?: React.ReactNode;
}

const TITLE_CONFIG: Record<string, MerchTitleConfig> = {
  "pause-please-i-m-thinking-kids-t-shirt": {
    category: "Kids T-Shirt",
    name: "Pause please...I’m thinking",
    node: <span className="italic">Pause please...I’m thinking</span>,
  },
  "1-in-14-dld-awareness-tote-bag": {
    category: "Tote Bag",
    name: "1 in 14: Have You Heard of DLD?",
  },
  "tote-bag-1-in-14-dld-awareness-tote-bag": {
    category: "Tote Bag",
    name: "1 in 14: Have You Heard of DLD?",
  },
  "my-ideas-are-worth-waiting-for-kids-water-bottle": {
    category: "Water Bottle",
    name: "My Ideas Are Worth Waiting For",
  },
};

/** Product type shown as the small eyebrow/label above the name. */
export function getMerchCategory(handle: string): string {
  return TITLE_CONFIG[handle]?.category ?? "Merch";
}

/** Clean product name without the redundant product-type prefix. */
export function getMerchCleanName(handle: string, fallbackTitle: string): string {
  return TITLE_CONFIG[handle]?.name ?? fallbackTitle;
}

/** Full plain-text title (category + name) for SEO, cart lines and alt text. */
export function getMerchDisplayTitle(handle: string, fallbackTitle: string): string {
  const config = TITLE_CONFIG[handle];
  if (!config) return fallbackTitle;
  return `${config.category}: ${config.name}`;
}

interface MerchProductTitleProps {
  handle: string;
  title: string;
  className?: string;
}

export const MerchProductTitle = ({ handle, title, className }: MerchProductTitleProps) => {
  const config = TITLE_CONFIG[handle];
  return <span className={className}>{config ? (config.node ?? config.name) : title}</span>;
};
