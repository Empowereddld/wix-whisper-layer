import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { matchesLanguageAndType } from "@/lib/resourceOrganization";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Resource = Tables<"resources"> & { is_published?: boolean; long_description?: string | null; great_for?: string[] | null; page_count?: number | null };

export type SortOption = "most_downloaded" | "newest" | "a_z";

export interface Filters {
  roles: string[];
  resourceTypes: string[];
  settings: string[];
  ageRanges: string[];
  languages: string[];
  search: string;
  audienceTab: string; // "" = all, "parent" | "slp" | "educator" | "school_leader"
}

const EMPTY_FILTERS: Filters = {
  roles: [],
  resourceTypes: [],
  settings: [],
  ageRanges: [],
  languages: [],
  search: "",
  audienceTab: "",
};

export function useResources(userRole?: string) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useSearchParams();
  const filters: Filters = {
    ...EMPTY_FILTERS,
    roles: params.getAll("role"), resourceTypes: params.getAll("type"),
    settings: params.getAll("setting"), ageRanges: params.getAll("age"),
    languages: params.getAll("language"), search: params.get("q") || "",
    audienceTab: params.get("audience") || "",
  };
  const sort = (params.get("sort") || "") as SortOption | "";
  const setSort = useCallback((value: SortOption | "") => setParams((previous) => {
    const next = new URLSearchParams(previous);
    if (value) next.set("sort", value); else next.delete("sort");
    return next;
  }, { replace: true }), [setParams]);
  const setFilters = useCallback((update: (previous: Filters) => Filters) => setParams((previous) => {
    const current: Filters = { ...EMPTY_FILTERS, roles: previous.getAll("role"), resourceTypes: previous.getAll("type"), settings: previous.getAll("setting"), ageRanges: previous.getAll("age"), languages: previous.getAll("language"), search: previous.get("q") || "", audienceTab: previous.get("audience") || "" };
    const value = update(current);
    const next = new URLSearchParams(previous);
    for (const [field, key] of [["roles", "role"], ["resourceTypes", "type"], ["settings", "setting"], ["ageRanges", "age"], ["languages", "language"]] as const) {
      next.delete(key); value[field].forEach((item) => next.append(key, item));
    }
    for (const [key, text] of [["q", value.search], ["audience", value.audienceTab]]) {
      if (text) next.set(key, text); else next.delete(key);
    }
    return next;
  }, { replace: true }), [setParams]);

  useEffect(() => {
    const fetchResources = async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("is_published", true);
      if (!error && data) {
        setResources(data as Resource[]);
      }
      setLoading(false);
    };
    fetchResources();
  }, []);

  const clearFilters = useCallback(
    () => setFilters((prev) => ({ ...EMPTY_FILTERS, audienceTab: prev.audienceTab })),
    [setFilters]
  );

  const toggleFilter = useCallback(
    (category: keyof Omit<Filters, "search" | "audienceTab">, value: string) => {
      setFilters((prev) => {
        const arr = prev[category] as string[];
        return {
          ...prev,
          [category]: arr.includes(value)
            ? arr.filter((v) => v !== value)
            : [...arr, value],
        };
      });
    },
    [setFilters]
  );

  const setFilterValues = useCallback((category: "languages" | "resourceTypes", values: string[]) => {
    setFilters((previous) => ({ ...previous, [category]: values }));
  }, [setFilters]);

  const setSearch = useCallback(
    (search: string) => setFilters((prev) => ({ ...prev, search })),
    [setFilters]
  );

  const setAudienceTab = useCallback(
    (audienceTab: string) => setParams((previous) => {
      const next = new URLSearchParams(previous);
      next.delete("role");
      next.delete("saved");
      if (audienceTab) next.set("audience", audienceTab); else next.delete("audience");
      return next;
    }, { replace: true }),
    [setParams]
  );

  const hasActiveFilters = useMemo(
    () =>
      filters.roles.length > 0 ||
      filters.resourceTypes.length > 0 ||
      filters.settings.length > 0 ||
      filters.ageRanges.length > 0 ||
      filters.languages.length > 0,
    [filters]
  );

  const filtered = useMemo(() => {
    let result = [...resources];

    // Audience tab filter (from navbar)
    if (filters.audienceTab) {
      result = result.filter((r) => r.roles?.includes(filters.audienceTab));
    }

    // Search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.roles?.some((role) => role.toLowerCase().includes(q)) ||
          r.settings?.some((s) => s.toLowerCase().includes(q)) ||
          r.resource_type.toLowerCase().includes(q)
      );
    }

    // Role filter (sidebar/pills)
    if (filters.roles.length > 0) {
      result = result.filter((r) =>
        r.roles?.some((role) => filters.roles.includes(role))
      );
    }

    result = result.filter((r) => matchesLanguageAndType(r, filters.languages, filters.resourceTypes));

    // Setting filter
    if (filters.settings.length > 0) {
      result = result.filter((r) =>
        r.settings?.some((s) => filters.settings.includes(s))
      );
    }

    // Age range filter
    if (filters.ageRanges.length > 0) {
      result = result.filter((r) =>
        r.age_ranges?.some((a) => filters.ageRanges.includes(a))
      );
    }



    // Sort
    switch (sort) {
      case "most_downloaded":
        result.sort((a, b) => (b.download_count ?? 0) - (a.download_count ?? 0));
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "a_z":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [resources, filters, sort, userRole]);

  // Recommended resources for the user's role
  const recommended = useMemo(() => {
    if (!userRole) return [];
    return resources
      .filter((r) => r.roles?.includes(userRole))
      .sort((a, b) => (b.download_count ?? 0) - (a.download_count ?? 0))
      .slice(0, 4);
  }, [resources, userRole]);

  // Filter counts
  const filterCounts = useMemo(() => {
    const countMatches = (key: "roles" | "settings" | "languages", value: string) =>
      resources.filter((r) => (r[key] as string[] | null)?.includes(value)).length;

    const typeCount = (type: string) =>
      resources.filter((r) => r.resource_type === type).length;

    const ageCount = (age: string) =>
      resources.filter((r) => (r.age_ranges as string[] | null)?.includes(age)).length;

    return { countMatches, typeCount, ageCount };
  }, [resources]);

  return {
    resources: filtered,
    allResources: resources,
    recommended,
    loading,
    filters,
    sort,
    setSort,
    toggleFilter,
    setFilterValues,
    setSearch,
    setAudienceTab,
    clearFilters,
    hasActiveFilters,
    filterCounts,
  };
}
