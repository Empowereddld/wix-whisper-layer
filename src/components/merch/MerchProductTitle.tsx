import React from "react";

const DISPLAY_TITLES: Record<string, React.ReactNode> = {
  "pause-please-i-m-thinking-kids-t-shirt": (
    <>
      <span>Kids T-Shirt: </span>
      <span className="italic">Pause please...I’m thinking</span>
    </>
  ),
  "1-in-14-dld-awareness-tote-bag": (
    <>
      <span>Tote Bag: 1 in 14 DLD Awareness</span>
    </>
  ),
  "my-ideas-are-worth-waiting-for-kids-water-bottle": (
    <>
      <span>Water Bottle: My Ideas Are Worth Waiting For</span>
    </>
  ),
};

export function getMerchDisplayTitle(handle: string, fallbackTitle: string): string {
  if (handle === "pause-please-i-m-thinking-kids-t-shirt") {
    return "Kids T-Shirt: Pause please...I’m thinking";
  }
  if (handle === "1-in-14-dld-awareness-tote-bag") {
    return "1 in 14 DLD Awareness Tote Bag";
  }
  if (handle === "my-ideas-are-worth-waiting-for-kids-water-bottle") {
    return "Water Bottle: My Ideas Are Worth Waiting For";
  }
  return fallbackTitle;
}

interface MerchProductTitleProps {
  handle: string;
  title: string;
  className?: string;
}

export const MerchProductTitle = ({ handle, title, className }: MerchProductTitleProps) => {
  const display = DISPLAY_TITLES[handle] ?? <span>{title}</span>;
  return <span className={className}>{display}</span>;
};
