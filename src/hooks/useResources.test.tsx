import { act, renderHook, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { useResources } from "./useResources";
vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: () => ({ select: () => ({ eq: async () => ({ data: [{ id: "a", title: "Poster", description: "", languages: ["French"], resource_type: "poster", roles: [], settings: [], age_ranges: [], created_at: "2026-01-01" }], error: null }) }) }) } }));
describe("gallery state", () => {
  it("restores search, language, type and sort from the gallery URL", async () => {
    const { result } = renderHook(() => useResources(), { wrapper: ({ children }) => <MemoryRouter initialEntries={["/hub?q=Poster&language=French&type=poster&sort=a_z"]}>{children}</MemoryRouter> });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.filters.search).toBe("Poster");
    expect(result.current.filters.languages).toEqual(["French"]);
    expect(result.current.filters.resourceTypes).toEqual(["poster"]);
    expect(result.current.sort).toBe("a_z");
    expect(result.current.resources.map((resource) => resource.id)).toEqual(["a"]);
    act(() => result.current.setFilterValues("languages", ["English"]));
    expect(result.current.resources).toEqual([]);
    act(() => result.current.setFilterValues("languages", ["French"]));
    expect(result.current.resources.map((resource) => resource.id)).toEqual(["a"]);
    expect(result.current.filters.resourceTypes).toEqual(["poster"]);
    expect(result.current.filters.search).toBe("Poster");
  });
});