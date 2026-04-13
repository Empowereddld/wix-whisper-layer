/**
 * Purple design system for StoryBuilders admin dashboard
 * Modern, professional aesthetic with purple and lavender colors
 */

// Purple color palette
export const colors = {
  cream: "#ffffff",        // Main background - white
  warmWhite: "#ffffff",    // Card backgrounds - white
  sand: "#f3ebf8",         // Secondary background / borders - lavender
  sandDark: "#dedede",     // Hover states, dividers - light gray
  brown: "#121212",        // Primary text - near black
  brownLight: "#6b7280",   // Secondary text - gray-500
  brownDark: "#3b1f59",    // Headings - deep purple
  amber: "#8861d4",        // Accent / highlights / badges - primary purple
  amberLight: "#f3ebf8",   // Light accent backgrounds - lavender
  amberDark: "#7451c4",    // Accent hover - darker purple
  terracotta: "#8861d4",   // Warm accent (for CTAs, progress) - primary purple
  sage: "#8BA888",         // Success / positive (kept earthy for badges)
  sageLight: "#E8F0E6",    // Success background (kept earthy)
  dustyRose: "#C4A0A0",    // Secondary accent (kept earthy)
  charcoal: "#2C2C2C",     // Dark text for contrast
};

// Card styles (warm, rounded, soft shadows)
export const cards = {
  base: "bg-white border border-[#dedede] rounded-2xl shadow-sm",
  hover: "bg-white border border-[#dedede] rounded-2xl shadow-sm hover:shadow-md hover:border-[#8861d4]/30 transition-all duration-300",
  accent: "bg-[#f3ebf8]/30 border border-[#8861d4]/20 rounded-2xl shadow-sm",
  stat: "bg-white border border-[#dedede] rounded-2xl p-6",
};

// Button styles
export const buttons = {
  primary: "bg-[#8861d4] hover:bg-[#7451c4] text-white rounded-xl px-6 py-3 font-medium transition-all duration-200 shadow-sm hover:shadow-md",
  secondary: "bg-[#f3ebf8] hover:bg-[#e5d8f0] text-[#3b1f59] rounded-xl px-6 py-3 font-medium transition-all duration-200 border border-[#dedede]",
  ghost: "hover:bg-[#f3ebf8] text-[#6b7280] rounded-xl px-4 py-2 transition-all duration-200",
  amber: "bg-[#8861d4] hover:bg-[#7451c4] text-white rounded-xl px-6 py-3 font-medium transition-all duration-200 shadow-sm",
};

// Typography
export const typography = {
  heading: "font-sans font-bold text-[#3b1f59]",
  subheading: "font-sans font-bold text-[#121212]",
  body: "text-[#121212]",
  muted: "text-[#6b7280]",
  accent: "text-[#8861d4] font-medium",
};

// Badge styles (for tier badges, status indicators)
export const badges = {
  default: "bg-[#f3ebf8] text-[#6b7280] rounded-full px-3 py-1 text-sm font-medium",
  amber: "bg-[#f3ebf8] text-[#8861d4] rounded-full px-3 py-1 text-sm font-medium border border-[#8861d4]/20",
  success: "bg-[#E8F0E6] text-[#5A8A55] rounded-full px-3 py-1 text-sm font-medium",
  warning: "bg-[#f3ebf8] text-[#8861d4] rounded-full px-3 py-1 text-sm font-medium",
};

// Page layout
export const layout = {
  page: "min-h-screen bg-white",
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  section: "py-8",
};

// Input styles
export const inputs = {
  base: "bg-white border border-[#dedede] rounded-xl px-4 py-3 text-[#121212] placeholder-[#6b7280]/50 focus:border-[#8861d4] focus:ring-1 focus:ring-[#8861d4]/20 outline-none transition-all",
};

// Legacy glass exports for backward compatibility with old components
export const glass = {
  card: "bg-white border border-[#dedede] rounded-2xl shadow-sm",
  cardDark: "bg-[#f3ebf8] border border-[#dedede] rounded-2xl shadow-sm",
  cardPurple: "bg-[#f3ebf8]/30 border border-[#8861d4]/20 rounded-2xl shadow-sm",
  input: "bg-white border border-[#dedede] rounded-xl px-4 py-3",
  button: "bg-[#f3ebf8] hover:bg-[#e5d8f0] text-[#3b1f59] rounded-xl px-6 py-3 transition-all duration-200",
  buttonPrimary: "bg-[#8861d4] hover:bg-[#7451c4] text-white rounded-xl px-6 py-3 transition-all duration-200 shadow-sm",
  overlay: "bg-black/40",
  nav: "bg-white border-b border-[#dedede]",
};

export const gradients = {
  hero: "bg-gradient-to-br from-white via-[#f3ebf8] to-[#f3ebf8]",
  card: "bg-gradient-to-br from-[#8861d4]/10 to-[#f3ebf8]/10",
  text: "bg-gradient-to-r from-[#8861d4] to-[#7451c4] bg-clip-text text-transparent",
  button: "bg-gradient-to-r from-[#7451c4] to-[#8861d4]",
  mesh: "bg-[radial-gradient(at_40%_20%,rgba(136,97,212,0.1)_0px,transparent_50%),radial-gradient(at_80%_80%,rgba(107,114,128,0.08)_0px,transparent_50%),radial-gradient(at_0%_50%,rgba(116,81,196,0.1)_0px,transparent_50%)]",
};

// Animation presets for framer-motion (motion/react)
export const animations = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
  },
  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 },
  },
  slideUp: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
    transition: { type: "spring", damping: 25 },
  },
  staggerContainer: {
    animate: { transition: { staggerChildren: 0.1 } },
  },
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  pulse: {
    animate: { scale: [1, 1.05, 1] },
    transition: { duration: 2, repeat: Infinity },
  },
  shimmer: {
    animate: { x: ["-100%", "100%"] },
    transition: { duration: 1.5, repeat: Infinity },
  },
};

// Presets for common UI states
export const states = {
  loading: "animate-pulse",
  disabled: "opacity-50 cursor-not-allowed",
  hover: "hover:scale-105 hover:shadow-lg transition-all duration-200",
  active: "ring-2 ring-[#8861d4] ring-offset-2 ring-offset-transparent",
};

// Tier colors (earthy palette)
export const tierColors = {
  0: "#8B7355",   // Storyteller - warm brown
  1: "#D4920B",   // Advocate - amber
  2: "#C67B5C",   // Champion - terracotta
  3: "#8BA888",   // Hero - sage green
  4: "#C4A0A0",   // Legend - dusty rose
  5: "#3D2B1F",   // Founding Elite - dark chocolate
};
