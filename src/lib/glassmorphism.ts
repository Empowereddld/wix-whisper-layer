/**
 * Glassmorphism utilities and shared styling for Phase 8 Premium UI Polish + Performance
 * Provides reusable glass-effect classes, gradients, and framer-motion animation presets
 */

export const glass = {
  card: "backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl rounded-2xl",
  cardDark: "backdrop-blur-xl bg-gray-900/40 border border-white/10 shadow-xl rounded-2xl",
  cardPurple:
    "backdrop-blur-xl bg-purple-900/20 border border-purple-300/20 shadow-xl rounded-2xl",
  input: "backdrop-blur-md bg-white/5 border border-white/10 rounded-lg",
  button:
    "backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200",
  buttonPrimary:
    "backdrop-blur-md bg-purple-600/80 border border-purple-400/30 hover:bg-purple-500/80 transition-all duration-200",
  overlay: "backdrop-blur-2xl bg-black/40",
  nav: "backdrop-blur-xl bg-white/5 border-b border-white/10",
};

export const gradients = {
  hero: "bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900",
  card: "bg-gradient-to-br from-purple-500/10 to-indigo-500/10",
  text: "bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent",
  button: "bg-gradient-to-r from-purple-600 to-indigo-600",
  mesh: "bg-[radial-gradient(at_40%_20%,rgba(91,45,142,0.3)_0px,transparent_50%),radial-gradient(at_80%_80%,rgba(59,130,246,0.2)_0px,transparent_50%),radial-gradient(at_0%_50%,rgba(168,85,247,0.15)_0px,transparent_50%)]",
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
  active: "ring-2 ring-purple-500 ring-offset-2 ring-offset-transparent",
};

// Typography scale
export const typography = {
  h1: "text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight",
  h2: "text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight",
  h3: "text-2xl sm:text-3xl md:text-4xl font-bold",
  h4: "text-xl sm:text-2xl md:text-3xl font-semibold",
  body: "text-base sm:text-lg leading-relaxed",
  small: "text-sm text-white/70",
};
