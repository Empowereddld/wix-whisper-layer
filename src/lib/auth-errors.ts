export type AuthErrorCode =
  | "already_exists"
  | "invalid_credentials"
  | "email_not_verified"
  | "rate_limited"
  | "network"
  | "unknown";

export interface FriendlyAuthError {
  code: AuthErrorCode;
  title: string;
  description?: string;
}

/**
 * Maps a raw Supabase / auth error message to user-friendly copy.
 * Only maps the recovery-oriented cases we care about. Anything else
 * (including password-strength / HIBP warnings) falls through to a
 * generic fallback so we never comment on password choices.
 */
export function getFriendlyAuthError(
  raw: string | null | undefined,
): FriendlyAuthError {
  const msg = (raw ?? "").toLowerCase();

  if (
    msg.includes("already registered") ||
    msg.includes("already exists") ||
    msg.includes("user already") ||
    msg.includes("user_already_exists")
  ) {
    return {
      code: "already_exists",
      title: "An account with this email already exists",
      description: "Try logging in instead.",
    };
  }

  if (
    msg.includes("invalid login") ||
    msg.includes("invalid credentials") ||
    msg.includes("invalid_grant")
  ) {
    return {
      code: "invalid_credentials",
      title: "Incorrect email or password",
      description: "Double-check your details and try again.",
    };
  }

  if (
    msg.includes("email not confirmed") ||
    msg.includes("not confirmed") ||
    msg.includes("email_not_confirmed")
  ) {
    return {
      code: "email_not_verified",
      title: "Please verify your email first",
      description: "Check your inbox for the verification link.",
    };
  }

  if (
    msg.includes("rate limit") ||
    msg.includes("too many") ||
    msg.includes("429")
  ) {
    return {
      code: "rate_limited",
      title: "Too many attempts",
      description: "Please wait a few minutes and try again.",
    };
  }

  if (
    msg.includes("failed to fetch") ||
    msg.includes("network") ||
    msg.includes("timeout") ||
    msg.includes("offline")
  ) {
    return {
      code: "network",
      title: "Connection issue",
      description: "Please check your internet and try again.",
    };
  }

  return {
    code: "unknown",
    title: "Something went wrong",
    description: "Please try again in a moment.",
  };
}
