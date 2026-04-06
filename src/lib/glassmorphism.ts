/**
 * Earthy design system for StoryBuilders waitlist
 * Warm, feminine, Etsy-like aesthetic with natural colors and rounded corners
 */

// Earthy color palette
export const colors = {
  cream: "#FDF8F0",        // Main background
  warmWhite: "#FEFCF9",    // Card backgrounds
  sand: "#F5EDE3",         // Secondary background / borders
  sandDark: "#E8DDD0",     // Hover states, dividers
  brown: "#5C4033",        // Primary text
  brownLight: "#8B7355",   // Secondary text
  brownDark: "#3D2B1F",    // Headings
  amber: "#D4920B",        // Accent / highlights / badges
  amberLight: "#F5E6C8",   // Light accent backgrounds
  amberDark: "#B07A09",    // Accent hover
  terracotta: "#C67B5C",   // Warm accent (for CTAs, progress)
  sage: "#8BA888",         // Success / positive
  sageLight: "#E8F0E6",    // Success background
  dustyRose: "#C4A0A0",    // Secondary accent
  charcoal: "#2C2C2C",     // Dark text for contrast
};

// Card styles (warm, rounded, soft shadows)
export const cards = {
  base: "bg-[#FEFCF9] border border-[#E8DDD0] rounded-2xl shadow-sm",
  hover: "bg-[#FEFCF9] border border-[#E8DDD0] rounded-2xl shadow-sm hover:shadow-md hover:border-[#D4920B]/30 transition-all duration-300",
  accent: "bg-[#F5E6C8]/30 border border-[#D4920B]/20 rounded-2xl shadow-sm",
  stat: "bg-[#FEFCF9] border border-[#E8DDD0] rounded-2xl p-6",
};

// Button styles
export const buttons = {
  primary: "bg-[#C67B5C] hover:bg-[#B06A4B] text-white rounded-xl px-6 py-3 font-medium transition-all duration-200 shadow-sm hover:shadow-md",
  secondary: "bg-[#F5EDE3] hover:bg-[#E8DDD0] text-[#5C4033] rounded-xl px-6 py-3 font-medium transition-all duration-200 border border-[#E8DDD0]",
  ghost: "hover:bg-[#F5EDE3] text-[#8B7355] rounded-xl px-4 py-2 transition-all duration-200",
  amber: "bg-[#D4920B] hover:bg-[#B07A09] text-white rounded-xl px-6 py-3 font-medium transition-all duration-200 shadow-sm",
};

// Typography
export const typography = {
  heading: "font-serif text-[#3D2B1F] italic",
  subheading: "font-serif text-[#5C4033]",
  body: "text-[#5C4033]",
  muted: "text-[#8B7355]",
  accent: "text-[#D4920B] font-medium",
};

// Badge styles (for tier badges, status indicators)
export const badges = {
  default: "bg-[#F5EDE3] text-[#8B7355] rounded-full px-3 py-1 text-sm font-medium",
  amber: "bg-[#F5E6C8] text-[#D4920B] rounded-full px-3 py-1 text-sm font-medium border border-[#D4920B]/20",
  success: "bg-[#E8F0E6] text-[#5A8A55] rounded-full px-3 py-1 text-sm font-medium",
  warning: "bg-[#FFF3E0] text-[#C67B5C] rounded-full px-3 py-1 text-sm font-medium",
};

// Page layout
export const layout = {
  page: "min-h-screen bg-[#FDF8F0]",
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  section: "py-8",
};

// Input styles
export const inputs = {
  base: "bg-[#FEFCF9] border border-[#E8DDD0] rounded-xl px-4 py-3 text-[#5C4033] placeholder-[#8B7355]/50 focus:border-[#D4920B] focus:ring-1 focus:ring-[#D4920B]/20 outline-none transition-all",
};

// Legacy glass exports for backward compatibility with old components
export const glass = {
  card: "bg-[#FEFCF9] border border-[#E8DDD0] rounded-2xl shadow-sm",
  cardDark: "bg-[#F5EDE3] border border-[#E8DDD0] rounded-2xl shadow-sm",
  cardPurple: "bg-[#F5E6C8]/30 border border-[#D4920B]/20 rounded-2xl shadow-sm",
  input: "bg-[#FEFCF9] border border-[#E8DDD0] rounded-xl px-4 py-3",
  button: "bg-[#F5EDE3] hover:bg-[#E8DDD0] text-[#5C4033] rounded-xl px-6 py-3 transition-all duration-200",
  buttonPrimary: "bg-[#C67B5C] hover:bg-[#B06A4B] text-white rounded-xl px-6 py-3 transition-all duration-200 shadow-sm",
  overlay: "bg-black/40",
  nav: "bg-[#FEFCF9] border-b border-[#E8DDD0]",
};

export const gradients = {
  hero: "bg-gradient-to-br from-[#FDF8F0] via-[#F5EDE3] to-[#F5EDE3]",
  card: "bg-gradient-to-br from-[#F5E6C8]/20 to-[#F5EDE3]/10",
  text: "bg-gradient-to-r from-[#D4920B] to-[#C67B5C] bg-clip-text text-transparent",
  button: "bg-gradient-to-r from-[#C67B5C] to-[#D4920B]",
  mesh: "bg-[radial-gradient(at_40%_20%,rgba(212,146,11,0.1)_0px,transparent_50%),radial-gradient(at_80%_80%,rgba(139,115,85,0.08)_0px,transparent_50%),radial-gradient(at_0%_50%,rgba(198,123,92,0.1)_0px,transparent_50%)]",
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
  active: "ring-2 ring-[#D4920B] ring-offset-2 ring-offset-transparent",
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
