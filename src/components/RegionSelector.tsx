import { Globe, Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { COUNTRY_OPTIONS, getCountryOption, useRegionStore } from "@/stores/regionStore";
import { cn } from "@/lib/utils";

interface RegionSelectorProps {
  variant?: "default" | "compact";
  className?: string;
  align?: "start" | "center" | "end";
}

const RegionSelector = ({ variant = "default", className, align = "start" }: RegionSelectorProps) => {
  const countryCode = useRegionStore((s) => s.countryCode);
  const setCountry = useRegionStore((s) => s.setCountry);
  const current = getCountryOption(countryCode);

  const compact = variant === "compact";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-2 rounded-md border text-[13px] font-medium transition-colors min-h-[44px]",
          compact
            ? "px-3 py-2 border-border/60 bg-background hover:bg-accent text-foreground"
            : "px-3 py-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10",
          className
        )}
        aria-label="Select region and currency"
      >
        <Globe className="w-4 h-4 shrink-0" />
        <span className="whitespace-nowrap">
          {compact ? current.currency : `${current.label} | ${current.currency}`}
        </span>
        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-[220px]">
        {COUNTRY_OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt.code}
            onClick={() => setCountry(opt.code)}
            className="flex items-center justify-between gap-4 cursor-pointer"
          >
            <span className="text-[13px]">
              {opt.label} <span className="text-muted-foreground">| {opt.currency}</span>
            </span>
            {opt.code === countryCode && <Check className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RegionSelector;
