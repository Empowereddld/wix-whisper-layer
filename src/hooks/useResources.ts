import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Resource = Tables<"resources">;

export type SortOption = "most_downloaded" | "newest" | "a_z" | "recommended";

export interface Filters {
  roles: string[];
  resourceTypes: string[];
  settings: string[];
  ageRanges: string[];
  languages: string[];
  search: string;
}

const EMPTY_FILTERS: Filters = {
  roles: [],
  resourceTypes: [],
  settings: [],
  ageRanges: [],
  languages: [],
  search: "",
};

export function useResources(userRole?: string) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortOption>("recommended");

  useEffect(() => {
    const fetchResources = async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*");
      if (!error && data) {
        setResources(data);
      }
      setLoading(false);
    };
    fetchResources();
  }, []);

  const clearFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);

  const toggleFilter = useCallback(
    (category: keyof Omit<Filters, "search">, value: string) => {
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
    []
  );

  const setSearch = useCallback(
    (search: string) => setFilters((prev) => ({ ...prev, search })),
    []
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

    // Search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.description?.toLowerCase().includes(q)) ||
          (r.roles?.some((role) => role.toLowerCase().includes(q))) ||
          (r.settings?.some((s) => s.toLowerCase().includes(q))) ||
          r.resource_type.toLowerCase().includes(q)
      );
    }

    // Role filter
    if (filters.roles.length > 0) {
      result = result.filter((r) =>
        r.roles?.some((role) => filters.roles.includes(role))
      );
    }

    // Resource type filter
    if (filters.resourceTypes.length > 0) {
      result = result.filter((r) =>
        filters.resourceTypes.includes(r.resource_type)
      );
    }

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

    // Language filter
    if (filters.languages.length > 0) {
      result = result.filter((r) =>
        r.languages?.some((l) => filters.languages.includes(l))
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
      case "recommended":
        // Prioritize user's role
        if (userRole) {
          result.sort((a, b) => {
            const aMatch = a.roles?.includes(userRole) ? 1 : 0;
            const bMatch = b.roles?.includes(userRole) ? 1 : 0;
            if (bMatch !== aMatch) return bMatch - aMatch;
            return (b.download_count ?? 0) - (a.download_count ?? 0);
          });
        } else {
          result.sort((a, b) => (b.download_count ?? 0) - (a.download_count ?? 0));
        }
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
    setSearch,
    clearFilters,
    hasActiveFilters,
    filterCounts,
  };
}
