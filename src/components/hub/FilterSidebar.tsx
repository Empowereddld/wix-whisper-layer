import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Filters } from "@/hooks/useResources";

interface FilterGroup {
  label: string;
  category: keyof Omit<Filters, "search">;
  options: { value: string; label: string }[];
}

const FILTER_GROUPS: FilterGroup[] = [
  {
    label: "By Your Role",
    category: "roles",
    options: [
      { value: "parent", label: "Parents" },
      { value: "slp", label: "SLPs & Therapists" },
      { value: "educator", label: "Educators" },
      { value: "school_leader", label: "School Leaders & Organizations" },
    ],
  },
  {
    label: "By Resource Type",
    category: "resourceTypes",
    options: [
      { value: "poster", label: "Poster" },
      { value: "guide", label: "Guide" },
      { value: "checklist", label: "Checklist" },
      { value: "handout", label: "Handout" },
      { value: "activity", label: "Activity Sheet" },
      { value: "bundle", label: "Bundle" },
      { value: "infographic", label: "Infographic" },
    ],
  },
  {
    label: "By Setting",
    category: "settings",
    options: [
      { value: "Home", label: "Home" },
      { value: "Classroom", label: "Classroom" },
      { value: "Therapy Room", label: "Therapy Room" },
      { value: "School-Wide", label: "School-Wide" },
    ],
  },
  {
    label: "By Age Range",
    category: "ageRanges",
    options: [
      { value: "0-4", label: "0–4 years" },
      { value: "5-7", label: "5–7 years" },
      { value: "8-10", label: "8–10 years" },
      { value: "11-13", label: "11–13 years" },
      { value: "14+", label: "14+ years" },
    ],
  },
  {
    label: "By Language",
    category: "languages",
    options: [
      { value: "English", label: "English" },
      { value: "French", label: "French" },
      { value: "Spanish", label: "Spanish" },
      { value: "Czech", label: "Czech" },
      { value: "Farsi", label: "Farsi" },
      { value: "Welsh", label: "Welsh" },
    ],
  },
];

interface FilterSidebarProps {
  filters: Filters;
  toggleFilter: (category: keyof Omit<Filters, "search">, value: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

const FilterSidebar = ({
  filters,
  toggleFilter,
  clearFilters,
  hasActiveFilters,
  onClose,
  isMobile,
}: FilterSidebarProps) => {
  return (
    <div className="bg-thistle/40 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-midnight text-lg">Filters</h3>
        {isMobile && onClose && (
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-thistle/60 transition-colors">
            <X className="h-5 w-5 text-midnight" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        {FILTER_GROUPS.map((group) => (
          <div key={group.category}>
            <h4 className="text-sm font-semibold text-midnight mb-3">{group.label}</h4>
            <div className="space-y-2.5">
              {group.options.map((option) => {
                const isChecked = (filters[group.category] as string[]).includes(option.value);
                return (
                  <label
                    key={option.value}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggleFilter(group.category, option.value)}
                      className="border-stone-ui data-[state=checked]:bg-hub-lavender data-[state=checked]:border-hub-lavender"
                    />
                    <span className="text-sm text-midnight/80 group-hover:text-midnight transition-colors">
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="w-full mt-6 border-stone-ui text-stone-ui hover:text-midnight hover:border-midnight"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );
};

export default FilterSidebar;
