import React from "react";

const DISPLAY_TITLES: Record<string, React.ReactNode> = {
  "pause-please-i-m-thinking-kids-t-shirt": (
    <>
      <span>Kids T-Shirt: </span>
      <span className="italic">Pause please...I’m thinking.</span>
    </>
  ),
};

export function getMerchDisplayTitle(handle: string, fallbackTitle: string): string {
  if (handle === "pause-please-i-m-thinking-kids-t-shirt") {
    return "Kids T-Shirt: Pause please...I’m thinking.";
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
