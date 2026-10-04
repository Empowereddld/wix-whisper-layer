import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackStreamingClick } from "@/lib/streaming-clicks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import coverArtwork from "@/assets/what-is-dld-cover.webp.asset.json";

const CAMPAIGN_START = new Date("2026-10-03T00:00:00-04:00").getTime();
const CAMPAIGN_END = new Date("2026-11-01T00:00:00-04:00").getTime();
const POPUP_DELAY_MS = 15_000;
const DISMISSAL_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
const STORAGE_KEY = "what-is-dld-song-promo-dismissed-at";
const COVER_ARTWORK_URL = import.meta.env.DEV
  ? new URL(coverArtwork.url, "https://id-preview--51a660d5-acfd-48f5-86f4-38b3ac526ca2.lovable.app").toString()
  : coverArtwork.url;

const isCampaignActive = (now: number) => now >= CAMPAIGN_START && now < CAMPAIGN_END;

const SongPromoPopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const now = Date.now();
    if (!isCampaignActive(now)) return;

    try {
      const dismissedAt = Number(localStorage.getItem(STORAGE_KEY) || 0);
      if (dismissedAt && now - dismissedAt < DISMISSAL_COOLDOWN_MS) return;
    } catch {
      // Storage may be unavailable in strict privacy modes; the campaign can still show.
    }

    const artwork = new Image();
    artwork.src = COVER_ARTWORK_URL;

    const timer = window.setTimeout(() => setOpen(true), POPUP_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // Dismissal still works for this page view when storage is unavailable.
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && dismiss()}>
      <DialogContent className="max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-[720px] overflow-y-auto p-0 [&>button]:right-3 [&>button]:top-3 [&>button]:flex [&>button]:h-10 [&>button]:w-10 [&>button]:items-center [&>button]:justify-center [&>button]:border [&>button]:border-primary [&>button]:bg-background [&>button]:opacity-100 sm:w-full">
        <div className="grid grid-rows-[auto_auto] sm:grid-cols-[240px_1fr] sm:grid-rows-1">
          <img
            src={COVER_ARTWORK_URL}
            alt="What Is DLD? song cover by Empowered DLD"
            width={1024}
            height={1024}
            className="aspect-[16/9] w-full object-cover object-[center_32%] sm:aspect-auto sm:h-full sm:object-center"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className="flex flex-col justify-center bg-background px-5 pb-5 pt-5 sm:p-8">
            <DialogHeader className="text-left">
              <p className="mb-1 text-xs font-bold uppercase text-primary sm:text-sm">New from Empowered DLD</p>
              <DialogTitle className="text-[22px] font-bold leading-tight text-foreground sm:text-3xl">
                A song for DLD Awareness Month{" "}
                <span className="align-middle text-lg font-semibold opacity-75 sm:text-xl" aria-hidden="true">
                  💜
                </span>
              </DialogTitle>
              <DialogDescription className="pt-2 text-sm leading-relaxed text-foreground/75 sm:pt-3 sm:text-[15px]">
                <em>What Is DLD?</em> helps children and families understand DLD in a way they can hear, remember, and share.
              </DialogDescription>
            </DialogHeader>
            <Button
              asChild
              size="lg"
              className="mt-5 min-h-[48px] w-full sm:mt-6 sm:w-fit"
              onClick={() => {
                trackStreamingClick("song-popup");
                dismiss();
              }}
            >
              <Link to="/music">
                <Headphones className="mr-2 h-5 w-5" aria-hidden="true" />
                Listen to the song
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SongPromoPopup;