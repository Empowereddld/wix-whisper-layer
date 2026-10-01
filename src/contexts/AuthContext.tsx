import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { syncToEmailOctopus } from "@/lib/emailoctopus";

// Adds a confirmed hub account to the newsletter list once per browser/user.
const syncHubUserToEmailOctopus = (user: User) => {
  if (!user.email || !user.email_confirmed_at) return;
  const key = `eo_synced_${user.id}`;
  try {
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, "1");
  } catch {
    // private mode: still attempt the sync (the function is idempotent)
  }
  const meta = (user.user_metadata ?? {}) as {
    first_name?: string;
    last_name?: string;
    full_name?: string;
    given_name?: string;
    family_name?: string;
  };
  // Fall back to the name Google provides only when our own fields are blank.
  // A non-blank name the user typed is never overwritten.
  let firstName = meta.first_name?.trim() || "";
  let lastName = meta.last_name?.trim() || "";
  if (!firstName && !lastName) {
    firstName = meta.given_name?.trim() || "";
    lastName = meta.family_name?.trim() || "";
    if (!firstName && meta.full_name) {
      const parts = meta.full_name.trim().split(/\s+/);
      firstName = parts[0] || "";
      lastName = parts.slice(1).join(" ");
    }
  }
  syncToEmailOctopus({
    email: user.email,
    tag: "resource-hub",
    firstName,
    lastName,
  });
};

interface Profile {
  id: string;
  first_name: string;
  last_name: string | null;
  role: string;
  country: string | null;
  age_range: string | null;
  welcome_dismissed: boolean | null;
  job_title: string | null;
  organization_name: string | null;
  interests: string[] | null;
  created_at: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (data) {
      setProfile(data as Profile);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(() => fetchProfile(session.user.id), 0);
          setTimeout(() => syncHubUserToEmailOctopus(session.user), 0);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    // Also clear the Story Pros waitlist local session so a different person
    // sharing this browser can't open the prior user's dashboard after logout.
    try {
      localStorage.removeItem("sb_waitlist_state");
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
