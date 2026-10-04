import { supabase } from "@/integrations/supabase/client";

const VALID_SOURCES = new Set(["music-page", "song-popup"]);

/**
 * Records a click on a "Listen to the song" button. Fire-and-forget:
 * tracking never blocks navigation and never surfaces errors to visitors.
 */
export const trackStreamingClick = (source: string) => {
  if (!VALID_SOURCES.has(source)) return;
  void supabase
    .from("streaming_link_clicks")
    .insert({ source })
    .then(({ error }) => {
      if (error) console.warn("streaming click tracking skipped:", error.message);
    });
};
